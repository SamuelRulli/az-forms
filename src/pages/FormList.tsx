import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Share2, BarChart3, Edit, Trash2, Copy, ExternalLink } from 'lucide-react';
import { formStorage } from '../lib/formStorage';
import { Form } from '../types/form';

export function FormList() {
  const [forms, setForms] = React.useState<Form[]>([]);

  React.useEffect(() => {
    fetch('http://localhost:4000/api/forms')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setForms(data);
      })
      .catch(error => {
        console.error('Error fetching forms:', error);
        // Fallback to local storage if API fetch fails
        setForms(formStorage.getForms());
      });
  }, []);

  const toggleFormStatus = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      const updatedForm = { ...form, isActive: !form.isActive, updatedAt: new Date() };
      // Update via API
      fetch(`http://localhost:4000/api/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedForm)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update form status');
          return res.json();
        })
        .then(() => {
          // Update local state after successful API update
          setForms(forms.map(f => f.id === formId ? updatedForm : f));
        })
        .catch(err => {
          console.error('Error updating form status:', err);
          alert('Erro ao atualizar status do formulário');
        });
    }
  };

  // Removido: função de deletar formulário para preservar vínculo com respostas

  const copyFormLink = (formId: string) => {
    const link = `${window.location.origin}/fill/${formId}`;
    navigator.clipboard.writeText(link);
    alert('Link copiado para a área de transferência!');
  };

  const openFormLink = (formId: string) => {
    const link = `${window.location.origin}/fill/${formId}`;
    window.open(link, '_blank');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">My Forms</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all your forms
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            New Form
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Form
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Created On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Steps
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No forms found</p>
                      <p className="mt-1">Get started by creating your first form.</p>
                      <Link
                        to="/create"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Create Form
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                forms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{form.title}</div>
                        <div className="text-sm text-gray-500">{form.companyName}</div>
                        {form.description && (
                          <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                            {form.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleFormStatus(form.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          form.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {form.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(form.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {form.steps.length} step{form.steps.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyFormLink(form.id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Copy Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openFormLink(form.id)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Open Form"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/responses/${form.id}`}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                          title="View Responses"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/edit-form/${form.id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit Form"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {/* Botão de exclusão removido para preservar vínculo com respostas */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}