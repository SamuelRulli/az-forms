import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Calendar, Building2 } from 'lucide-react';
import { formStorage } from '../lib/formStorage';
import { Form, FormResponse } from '../types/form';

export function Responses() {
  const { formId } = useParams<{ formId?: string }>();
  const [forms, setForms] = useState<Form[]>([]);
  const [responses, setResponses] = useState<FormResponse[]>([]);

  useEffect(() => {
    setForms(formStorage.getForms());
    // Fetch responses from backend API
    fetch('http://localhost:4000/api/responses')
      .then(res => res.json())
      .then(data => {
        console.log('Respostas recebidas do backend:', data);
        // Remove _id if present, keep the rest of the data
        setResponses(
          Array.isArray(data)
            ? data.map(r => {
                const { _id, ...rest } = r;
                return rest;
              })
            : []
        );
      })
      .catch((err) => {
        console.error('Erro ao buscar respostas do backend:', err);
        setResponses([]);
      });
  }, []);

  const filteredResponses = formId 
    ? responses.filter(r => r.formId === formId)
    : responses;

  const form = formId ? forms.find(f => f.id === formId) : null;

  const exportResponses = () => {
    if (filteredResponses.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Response ID,Company,Completed At,Form ID\n"
      + filteredResponses.map(r => 
          `${r.responseId},${r.companyName},${new Date(r.completedAt).toLocaleString()},${r.formId}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `responses-${formId || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="flex items-center">
            {formId && (
              <Link
                to="/forms"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {form ? `Responses - ${form.title}` : 'All Responses'}
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                {filteredResponses.length} response{filteredResponses.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={exportResponses}
            disabled={filteredResponses.length === 0}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Submission Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Form
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Response ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Export
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-lg font-medium">No responses found</p>
                      <p className="mt-1">Responses will appear here when users fill out the forms.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredResponses.map((response) => {
                  const responseForm = forms.find(f => f.id === response.formId);
                  return (
                    <tr key={response.responseId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">
                            {response.companyName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(response.completedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {responseForm?.title || 'Form not found'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {response.responseId.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            // Export this response as CSV
                            const responseForm = forms.find(f => f.id === response.formId);
                            let headers = [];
                            let values = [];
                            if (responseForm) {
                              headers = responseForm.steps.flatMap(step => step.fields.map(field => field.label));
                              values = responseForm.steps.flatMap(step => step.fields.map(field => {
                                const v = response.responses[field.id];
                                return typeof v === 'boolean' ? (v ? 'Yes' : 'No') : (v ?? '');
                              }));
                            } else {
                              headers = Object.keys(response.responses);
                              values = Object.values(response.responses);
                            }
                            const csvContent = "data:text/csv;charset=utf-8," +
                              headers.join(",") + "\n" +
                              values.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", `resposta-${response.responseId.slice(0,8)}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Export CSV"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedResponse(response)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredResponses.length > 0 && (
        <div className="mt-6 bg-white shadow-sm rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Response Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredResponses.length}</div>
              <div className="text-sm text-blue-800">Total Responses</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {new Set(filteredResponses.map(r => r.companyName)).size}
              </div>
              <div className="text-sm text-green-800">Unique Companies</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {filteredResponses.filter(r => 
                  new Date(r.completedAt).getMonth() === new Date().getMonth()
                ).length}
              </div>
              <div className="text-sm text-purple-800">This Month</div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de visualização */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedResponse(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Response Details</h2>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Company:</span> {selectedResponse.companyName}
              </div>
              <div>
                <span className="font-semibold">Submission Date:</span> {new Date(selectedResponse.completedAt).toLocaleString('en-US')}
              </div>
              <div>
                <span className="font-semibold">Response ID:</span> {selectedResponse.responseId}
              </div>
              <div>
                <span className="font-semibold">Form:</span> {forms.find(f => f.id === selectedResponse.formId)?.title || 'N/A'}
              </div>
              <div className="mt-4">
                <span className="font-semibold">Responses:</span>
                {(() => {
                  const form = forms.find(f => f.id === selectedResponse.formId);
                  if (!form) return <div className="text-gray-500">Form structure not found.</div>;
                  return form.steps.map((step, stepIdx) => (
                    <div key={step.id || stepIdx} className="mb-4">
                      <div className="font-semibold text-gray-700 mb-2">{step.title}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {step.fields.map((field) => {
                          const value = selectedResponse.responses[field.id] ?? '';
                          switch (field.type) {
                            case 'textarea':
                              return (
                                <div key={field.id}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                  <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                    value={value}
                                    disabled
                                    rows={3}
                                  />
                                </div>
                              );
                            case 'select':
                            case 'text':
                            case 'email':
                            case 'number':
                              return (
                                <div key={field.id}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                  <input
                                    type={field.type === 'select' ? 'text' : field.type}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                    value={value}
                                    disabled
                                  />
                                </div>
                              );
                            case 'checkbox':
                              return (
                                <div key={field.id} className="flex items-center mt-2">
                                  <input
                                    type="checkbox"
                                    checked={!!value}
                                    disabled
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded bg-gray-100"
                                  />
                                  <label className="ml-2 text-sm text-gray-700">{field.label}</label>
                                </div>
                              );
                            case 'radio':
                              return (
                                <div key={field.id}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                  <div>
                                    {field.options?.map(option => (
                                      <label key={option} className="inline-flex items-center mr-4">
                                        <input
                                          type="radio"
                                          checked={value === option}
                                          disabled
                                          className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-1">{option}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}