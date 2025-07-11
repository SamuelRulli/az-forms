import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Form, FormStep, FormField } from '../types/form';
import { v4 as uuidv4 } from 'uuid';

const EditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Form | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newField, setNewField] = useState<{
    label: string;
    type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';
    required: boolean;
    stepIndex: number;
  }>({
    label: '',
    type: 'text',
    required: false,
    stepIndex: 0
  });
  const [newStepName, setNewStepName] = useState('');

  useEffect(() => {
    if (id) {
      console.log(`Fetching form data for ID: ${id}`);
      fetch(`${import.meta.env.VITE_SERVER_API}/api/forms/${id}`)
        .then(response => {
          console.log(`Response status: ${response.status}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Form data fetched:', data);
          setFormData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching form data:', error);
          setError('Failed to load form data');
          setLoading(false);
        });
    }
  }, [id]);

  const handleSaveForm = () => {
    if (!formData || !formData.title) {
      alert('Please fill in all required fields.');
      return;
    }

    const { _id, ...updatedFormWithoutId } = formData;
    const updatedForm = {
      ...updatedFormWithoutId,
      updatedAt: new Date().toISOString()
    };

    fetch(`${import.meta.env.VITE_SERVER_API}/api/forms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedForm)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error updating form in database');
        return res.json();
      })
      .then(() => {
        navigate('/forms');
      })
      .catch(err => {
        alert('Error updating form in database: ' + err.message);
      });
  };

  const handleAddField = () => {
    if (!newField.label || newField.stepIndex < 0 || !formData || newField.stepIndex >= formData.steps.length) {
      alert('Please fill in the field name and select a valid step.');
      return;
    }

    const updatedSteps = [...formData.steps];
    const newFieldData: FormField = {
      id: `custom-${uuidv4()}`,
      type: newField.type,
      label: newField.label,
      required: newField.required
    };

    updatedSteps[newField.stepIndex].fields.push(newFieldData);
    setFormData({ ...formData, steps: updatedSteps });
    setNewField({ 
      label: '', 
      type: 'text', 
      required: false, 
      stepIndex: newField.stepIndex
    });
  };

  const handleRemoveField = (stepIndex: number, fieldIndex: number) => {
    if (!formData) return;
    const updatedSteps = [...formData.steps];
    updatedSteps[stepIndex].fields.splice(fieldIndex, 1);
    setFormData({ ...formData, steps: updatedSteps });
  };

  const handleMoveFieldUp = (stepIndex: number, fieldIndex: number) => {
    if (!formData || fieldIndex === 0) return;
    const updatedSteps = [...formData.steps];
    const temp = updatedSteps[stepIndex].fields[fieldIndex];
    updatedSteps[stepIndex].fields[fieldIndex] = updatedSteps[stepIndex].fields[fieldIndex - 1];
    updatedSteps[stepIndex].fields[fieldIndex - 1] = temp;
    setFormData({ ...formData, steps: updatedSteps });
  };

  const handleMoveFieldDown = (stepIndex: number, fieldIndex: number) => {
    if (!formData || fieldIndex === formData.steps[stepIndex].fields.length - 1) return;
    const updatedSteps = [...formData.steps];
    const temp = updatedSteps[stepIndex].fields[fieldIndex];
    updatedSteps[stepIndex].fields[fieldIndex] = updatedSteps[stepIndex].fields[fieldIndex + 1];
    updatedSteps[stepIndex].fields[fieldIndex + 1] = temp;
    setFormData({ ...formData, steps: updatedSteps });
  };

  const handleAddStep = () => {
    if (!formData) return;
    const stepTitle = newStepName.trim() || `Nova Etapa ${formData.steps.length + 1}`;
    const newStep: FormStep = {
      id: `step-${formData.steps.length + 1}`,
      title: stepTitle,
      description: 'Descrição da nova etapa',
      fields: []
    };
    setFormData({ ...formData, steps: [...formData.steps, newStep] });
    setNewStepName('');
  };

  const handleRemoveStep = (stepIndex: number) => {
    if (!formData) return;
    const updatedSteps = [...formData.steps];
    updatedSteps.splice(stepIndex, 1);
    setFormData({ ...formData, steps: updatedSteps });
  };

  const handleEditFieldLabel = (stepIndex: number, fieldIndex: number, newLabel: string) => {
    if (!formData) return;
    const updatedSteps = [...formData.steps];
    updatedSteps[stepIndex].fields[fieldIndex].label = newLabel;
    setFormData({ ...formData, steps: updatedSteps });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !formData) {
    return <div>{error || 'No form data available'}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Form</h1>
          <p className="mt-2 text-gray-600">Update the form information as needed</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Form Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: AZ Car Rental Affiliate Registration"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the purpose of this form"
            />
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customize Fields</h2>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Field Name</label>
              <input
                type="text"
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: New Field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value as 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="textarea">Text Area</option>
                <option value="select">Select</option>
                <option value="checkbox">Checkbox</option>
                <option value="radio">Radio Button</option>
                <option value="file">File Upload</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Required</label>
              </div>
              <button
                onClick={handleAddField}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="mr-1 w-4 h-4" /> Add Field
              </button>
            </div>
          </div>
          {formData.steps.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Step</label>
              <select
                value={newField.stepIndex}
                onChange={(e) => setNewField({ ...newField, stepIndex: parseInt(e.target.value) })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {formData.steps.map((step: FormStep, index: number) => (
                  <option key={index} value={index}>{step.title}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-center mb-4 gap-2">
            <input
              type="text"
              value={newStepName}
              onChange={e => setNewStepName(e.target.value)}
              placeholder="Step Name"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              style={{ minWidth: 0, flex: 1 }}
            />
            <button
              onClick={handleAddStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Plus className="mr-1 w-4 h-4" /> Add Step
            </button>
          </div>
          {formData.steps.map((step: FormStep, stepIndex: number) => (
            <div key={stepIndex} className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold text-gray-800">{step.title}</h3>
                <button
                  onClick={() => handleRemoveStep(stepIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" /> Remove Step
                </button>
              </div>
              {step.fields.length > 0 ? (
                <ul className="space-y-2">
                  {step.fields.map((field: FormField, fieldIndex: number) => (
                    <li key={field.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleEditFieldLabel(stepIndex, fieldIndex, e.target.value)}
                        className="flex-grow px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex items-center">
                        {field.required && <span className="text-red-500 mr-1">*</span>}
                        <button
                          onClick={() => handleMoveFieldUp(stepIndex, fieldIndex)}
                          disabled={fieldIndex === 0}
                          className="text-gray-500 hover:text-gray-700 mr-1 disabled:opacity-50"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveFieldDown(stepIndex, fieldIndex)}
                          disabled={fieldIndex === step.fields.length - 1}
                          className="text-gray-500 hover:text-gray-700 mr-1 disabled:opacity-50"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveField(stepIndex, fieldIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhum campo adicionado ainda.</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveForm}
            disabled={!formData || !formData.title}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Save Changes
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
