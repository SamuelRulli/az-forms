import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Car, Users, MapPin, ArrowRight, Sparkles, Plus, Trash2, Eye } from 'lucide-react';
// If any icon is undefined, fallback to a simple span or another icon
import { formTemplates } from '../data/templates';
import { Form, FormStep, FormField as FormFieldType, FormTemplate } from '../types/form';
import { formStorage } from '../lib/formStorage';
import { v4 as uuidv4 } from 'uuid';

export function CreateForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState<boolean>(!!id);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [customSteps, setCustomSteps] = useState<FormStep[]>([]);
  const [newField, setNewField] = useState({
    label: '',
    type: 'text',
    required: false,
    stepIndex: 0
  });
  const [newStepName, setNewStepName] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<FormTemplate | null>(null);

  React.useEffect(() => {
    if (id) {
      console.log(`Fetching form data for ID: ${id}`);
      fetch(`http://localhost:4000/api/forms/${id}`)
        .then(response => {
          console.log(`Response status: ${response.status}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Form data fetched:', data);
          setFormData({
            title: data.title,
            description: data.description
          });
          setCustomSteps(data.steps);
          setIsEditing(true);
          // Set a default template for editing mode to enable customization
          if (!selectedTemplate) {
            setSelectedTemplate('blank-form');
          }
        })
        .catch(error => {
          console.error('Error fetching form data:', error);
          alert('Error loading form data');
          // Fallback to default values to ensure UI renders
          setIsEditing(true);
          setSelectedTemplate('blank-form');
        });
    }
  }, [id]);

  const iconMap = {
    Car: Car,
    Users: Users,
    MapPin: MapPin,
    Sparkles: Sparkles
  };

  const handleSaveForm = () => {
    if (!selectedTemplate || !formData.title) {
      alert('Please fill in all required fields.');
      return;
    }

    const template = formTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const stepsToUse = selectedTemplate === 'blank-form' || selectedTemplate === 'az-car-rental-complete' ? customSteps : template.steps;

    const form: Form = {
      id: isEditing ? id! : uuidv4(),
      title: formData.title,
      description: formData.description,
      companyName: '',
      steps: stepsToUse.map((step, index) => ({
        ...step,
        id: `step-${index + 1}`
      })) as FormStep[],
      createdAt: isEditing ? new Date() : new Date(), // Maintain original createdAt if editing
      updatedAt: new Date(),
      isActive: true
    };

    // Save or update to backend API
    const url = isEditing ? `http://localhost:4000/api/forms/${id}` : 'http://localhost:4000/api/forms';
    const method = isEditing ? 'PUT' : 'POST';
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${isEditing ? 'updating' : 'saving'} form to database`);
        return res.json();
      })
      .then(() => {
        if (!isEditing) {
          formStorage.addForm(form); // Optional: keep local copy for new forms
        }
        navigate('/forms');
      })
      .catch(err => {
        alert(`Error ${isEditing ? 'updating' : 'saving'} form to database: ` + err.message);
      });
  };

  const handleAddField = () => {
    if (!newField.label || newField.stepIndex < 0 || newField.stepIndex >= customSteps.length) {
      alert('Please fill in the field name and select a valid step.');
      return;
    }

    const updatedSteps = [...customSteps];
    const newFieldData: FormFieldType = {
      id: `custom-${uuidv4()}`,
      type: newField.type as 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio',
      label: newField.label,
      required: newField.required
    };

    updatedSteps[newField.stepIndex].fields.push(newFieldData);
    setCustomSteps(updatedSteps);
    setNewField({ label: '', type: 'text', required: false, stepIndex: newField.stepIndex });
  };

  const handleRemoveField = (stepIndex: number, fieldIndex: number) => {
    const updatedSteps = [...customSteps];
    updatedSteps[stepIndex].fields.splice(fieldIndex, 1);
    setCustomSteps(updatedSteps);
  };

  const handleAddStep = () => {
    const stepTitle = newStepName.trim() || `Nova Etapa ${customSteps.length + 1}`;
    const newStep: FormStep = {
      id: `step-${customSteps.length + 1}`,
      title: stepTitle,
      description: 'Descrição da nova etapa',
      fields: []
    };
    setCustomSteps([...customSteps, newStep]);
    setNewStepName('');
  };

  React.useEffect(() => {
    if (selectedTemplate) {
      const template = formTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        if (selectedTemplate === 'blank-form') {
          setCustomSteps([]);
        } else {
          setCustomSteps(template.steps.map((step, index) => ({ ...step, id: `step-${index + 1}` })));
        }
      }
    }
  }, [selectedTemplate]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{isEditing ? 'Edit Form' : 'Create New Form'}</h1>
          <p className="mt-2 text-gray-600">
            {isEditing ? 'Update the form information as needed' : 'Choose a template and customize it to your needs'}
          </p>
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

        {(selectedTemplate || isEditing) && (
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
                  onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="textarea">Text Area</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio Button</option>
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
            {customSteps.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Step</label>
                <select
                  value={newField.stepIndex}
                  onChange={(e) => setNewField({ ...newField, stepIndex: parseInt(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {customSteps.map((step, index) => (
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
            {customSteps.map((step, stepIndex) => (
              <div key={stepIndex} className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-semibold text-gray-800">{step.title}</h3>
                  <button
                    onClick={() => {
                      const updatedSteps = [...customSteps];
                      updatedSteps.splice(stepIndex, 1);
                      setCustomSteps(updatedSteps);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" /> Remove Step
                  </button>
                </div>
                {step.fields.length > 0 ? (
                  <ul className="space-y-2">
                    {step.fields.map((field, fieldIndex) => (
                      <li key={field.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
                        <button
                          onClick={() => handleRemoveField(stepIndex, fieldIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No fields added yet.</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Template</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {formTemplates.map((template) => {
              const IconComponent = iconMap[template.icon as keyof typeof iconMap];
              const isSelected = selectedTemplate === template.id;

              return (
                <div
                  key={template.id}
                  className={`relative rounded-lg p-6 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div
                    className="flex items-center mb-3"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-100' : 'bg-white'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        isSelected ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className={`ml-3 text-sm font-medium ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {template.name}
                    </h3>
                  </div>
                  <p
                    className={`text-sm ${
                      isSelected ? 'text-blue-700' : 'text-gray-600'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    {template.description}
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    {template.steps.length} step{template.steps.length !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveForm}
              disabled={!selectedTemplate || !formData.title}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Create Form'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Modal de visualização de template removido conforme solicitação */}
    </div>
  );
}