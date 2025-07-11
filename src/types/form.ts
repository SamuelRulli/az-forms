export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  acceptedFileTypes?: string[]; // For file uploads (e.g., ['image/*', '.pdf'])
  maxFileSize?: number; // Maximum file size in bytes
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface Form {
  _id?: string;
  id: string;
  title: string;
  description?: string;
  companyName: string;
  steps: FormStep[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface FormResponse {
  _id?: string;
  formId: string;
  responseId: string;
  companyName: string;
  responses: Record<string, any>;
  completedAt: Date;
  ipAddress?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  steps: Omit<FormStep, 'id'>[];
}
