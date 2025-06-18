import { Form, FormResponse } from '../types/form';

// This will store forms globally, accessible even without authentication
class FormStorage {
  private formsKey = 'global_forms';
  private responsesKey = 'global_form_responses';

  getForms(): Form[] {
    try {
      const stored = localStorage.getItem(this.formsKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading forms:', error);
      return [];
    }
  }

  saveForms(forms: Form[]): void {
    try {
      localStorage.setItem(this.formsKey, JSON.stringify(forms));
    } catch (error) {
      console.error('Error saving forms:', error);
    }
  }

  getFormById(id: string): Form | null {
    const forms = this.getForms();
    return forms.find(form => form.id === id) || null;
  }

  addForm(form: Form): void {
    const forms = this.getForms();
    forms.push(form);
    this.saveForms(forms);
  }

  updateForm(updatedForm: Form): void {
    const forms = this.getForms();
    const index = forms.findIndex(form => form.id === updatedForm.id);
    if (index !== -1) {
      forms[index] = updatedForm;
      this.saveForms(forms);
    }
  }

  deleteForm(id: string): void {
    const forms = this.getForms();
    const filteredForms = forms.filter(form => form.id !== id);
    this.saveForms(filteredForms);
  }

  getResponses(): FormResponse[] {
    try {
      const stored = localStorage.getItem(this.responsesKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading responses:', error);
      return [];
    }
  }

  saveResponses(responses: FormResponse[]): void {
    try {
      localStorage.setItem(this.responsesKey, JSON.stringify(responses));
    } catch (error) {
      console.error('Error saving responses:', error);
    }
  }

  addResponse(response: FormResponse): void {
    const responses = this.getResponses();
    responses.push(response);
    this.saveResponses(responses);
    // Note: For MongoDB integration, set up a backend API to handle database operations.
    console.warn('MongoDB integration requires a backend service. Currently saving to localStorage only.');
  }

  getFormResponses(formId: string): FormResponse[] {
    const responses = this.getResponses();
    return responses.filter(response => response.formId === formId);
  }
}

export const formStorage = new FormStorage();