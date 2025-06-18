export interface Form {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  companyName?: string;
  steps: FormStep[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
}