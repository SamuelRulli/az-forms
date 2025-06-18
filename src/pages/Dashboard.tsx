import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FormInput, BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';
import { formStorage } from '../lib/formStorage';
import { Form } from '../types/form';

export function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [responses, setResponses] = useState<any[]>([]);

  useEffect(() => {
    // Fetch forms data
    fetch('http://localhost:4000/api/forms')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setForms(data);
        // Update stats based on fetched data
        stats[0].value = data.length;
        stats[1].value = data.filter((f: Form) => f.isActive).length;
      })
      .catch(error => {
        console.error('Error fetching forms:', error);
        // Fallback to local storage if API fetch fails
        setForms(formStorage.getForms());
      });

    // Fetch responses data
    fetch('http://localhost:4000/api/responses')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setResponses(data);
        // Update stats based on fetched data
        stats[2].value = data.length;
        stats[3].value = data.filter((r: any) => new Date(r.completedAt).getMonth() === new Date().getMonth()).length;
      })
      .catch(error => {
        console.error('Error fetching responses:', error);
        // Fallback to local storage if API fetch fails
        setResponses(formStorage.getResponses());
      });
  }, []);

  const stats = [
    {
      name: 'Total Forms',
      value: forms.length,
      icon: FormInput,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Active Forms',
      value: forms.filter(f => f.isActive).length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Total Responses',
      value: responses.length,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'This Month',
      value: responses.filter(r => new Date(r.completedAt).getMonth() === new Date().getMonth()).length,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentForms = forms.slice(-3).reverse();
  const recentResponses = responses.slice(-5).reverse();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of your forms and responses
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Form
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Forms */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Forms
            </h3>
            {recentForms.length > 0 ? (
              <div className="space-y-3">
                {recentForms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{form.title}</h4>
                      <p className="text-sm text-gray-500">{form.companyName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        form.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {form.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FormInput className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Forms</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first form.</p>
                <div className="mt-6">
                  <Link
                    to="/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Form
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Responses */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Responses
            </h3>
            {recentResponses.length > 0 ? (
              <div className="space-y-3">
                {recentResponses.map((response) => (
                  <div key={response.responseId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{response.companyName}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(response.completedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Responses</h3>
                <p className="mt-1 text-sm text-gray-500">Responses will appear here when users fill out your forms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}