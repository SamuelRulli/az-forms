import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Building2 } from 'lucide-react';
import { Form, FormResponse } from '../types/form';
import { FormField } from '../components/FormField';
import { StepIndicator } from '../components/StepIndicator';
import { formStorage } from '../lib/formStorage';
import { v4 as uuidv4 } from 'uuid';

export function FillForm() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<Form | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('FillForm - formId:', formId);
    
    if (formId) {
      fetch(`${import.meta.env.VITE_SERVER_API}/api/forms/${formId}`)
        .then(response => {
          console.log(`Response status: ${response.status}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Form data fetched:', data);
          if (data && data.isActive) {
            setForm(data);
          } else if (data && !data.isActive) {
            console.log('Form is inactive');
          } else {
            console.log('Form not found');
          }
        })
        .catch(error => {
          console.error('Error fetching form data:', error);
          // Fallback to local storage if API fetch fails
          try {
            const foundForm = formStorage.getFormById(formId);
            console.log('FillForm - Found form in local storage:', foundForm);
            if (foundForm && foundForm.isActive) {
              setForm(foundForm);
            }
          } catch (localError) {
            console.error('Error loading form from local storage:', localError);
          }
        });
    }
    
    setLoading(false);
  }, [formId]);

  const validateStep = (stepIndex: number): boolean => {
    if (!form) return false;
    
    const step = form.steps[stepIndex];
    const stepErrors: Record<string, string> = {};
    
    step.fields.forEach(field => {
      const value = formData[field.id];
      
      if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        stepErrors[field.id] = 'This field is required';
      }
      
      if (field.type === 'email' && value && typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          stepErrors[field.id] = 'Please enter a valid email';
        }
      }
    });
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (!form) return;
    
    const isValid = validateStep(currentStep - 1);
    if (isValid) {
      setCompletedSteps([...new Set([...completedSteps, currentStep])]);
      if (currentStep < form.steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!form) return;
    
    const isValid = validateStep(currentStep - 1);
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      const response: FormResponse = {
        formId: form.id,
        responseId: uuidv4(),
        companyName: form.companyName,
        responses: formData,
        completedAt: new Date(),
        ipAddress: 'Unknown'
      };
      
      // Save to backend API
      await fetch(`${import.meta.env.VITE_SERVER_API}/api/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      });
      formStorage.addResponse(response); // Optional: keep local copy
      setIsCompleted(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    setFormData({ ...formData, [fieldId]: value });
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: '' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-6">
            The form you are trying to access does not exist or has been deactivated.
          </p>
          <button
            onClick={() => window.close()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for filling out the form. Your information has been successfully saved.
          </p>
          <button
            onClick={() => window.close()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = form.steps[currentStep - 1];
  const isLastStep = currentStep === form.steps.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="https://storage.googleapis.com/agentpro-cdn/azportal/az-remove-bg.png" alt="AZ Logo" className="h-8 w-auto mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">{form.companyName}</h1>
          </div>
          <h2 className="text-xl text-gray-700">{form.title}</h2>
          {form.description && (
            <p className="mt-2 text-gray-600">{form.description}</p>
          )}
        </div>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={form.steps.length}
          completedSteps={completedSteps}
        />

        {/* Form Step */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{currentStepData.title}</h3>
            {currentStepData.description && (
              <p className="mt-1 text-sm text-gray-600">{currentStepData.description}</p>
            )}
          </div>

          <div className="space-y-6">
            {currentStepData.fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                value={formData[field.id] || (field.type === 'checkbox' ? false : '')}
                onChange={(value) => handleFieldChange(field.id, value)}
                error={errors[field.id]}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}