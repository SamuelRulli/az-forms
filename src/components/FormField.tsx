import React, { useState, useRef, useCallback } from 'react';
import { FormField as FormFieldType } from '../types/form';

interface FormFieldProps {
  field: FormFieldType;
  value: string | boolean | File | null;
  onChange: (value: string | boolean | File | null) => void;
  error?: string;
}

export function FormField({ field, value, onChange, error }: FormFieldProps) {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";

  const renderField = () => {
    switch (field.type) {
      case 'file':
        return renderFileUpload();
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseClasses} ${errorClasses} min-h-[100px] resize-vertical`}
            required={field.required}
          />
        );
      
      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.required}
          >
            <option value="">Selecione uma opção</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">{field.label}</label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">{option}</label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  // File upload with drag and drop functionality
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  }, []);

  const validateAndProcessFile = (file: File) => {
    // Validate file type if acceptedFileTypes is specified
    if (field.acceptedFileTypes && field.acceptedFileTypes.length > 0) {
      const fileType = file.type;
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      const isValidType = field.acceptedFileTypes.some(type => {
        if (type.startsWith('.')) {
          // Check file extension
          return type.toLowerCase() === fileExtension;
        } else if (type.endsWith('/*')) {
          // Check MIME type category (e.g., 'image/*')
          const category = type.split('/')[0];
          return fileType.startsWith(category + '/');
        } else {
          // Check exact MIME type
          return type === fileType;
        }
      });
      
      if (!isValidType) {
        alert(`Tipo de arquivo não permitido. Por favor, use um dos seguintes tipos: ${field.acceptedFileTypes.join(', ')}`);
        return;
      }
    }
    
    // Validate file size if maxFileSize is specified
    if (field.maxFileSize && file.size > field.maxFileSize) {
      const maxSizeMB = (field.maxFileSize / (1024 * 1024)).toFixed(2);
      alert(`O arquivo é muito grande. O tamanho máximo permitido é ${maxSizeMB} MB.`);
      return;
    }
    
    onChange(file);
  };

  const handleRemoveFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderFileUpload = () => {
    const dragAreaClasses = `
      border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
      transition-colors duration-200 ease-in-out
      ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
      ${errorClasses}
    `;

    const fileValue = value as File | null;
    
    return (
      <div>
        {!fileValue ? (
          <div
            className={dragAreaClasses}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileInputChange}
              accept={field.acceptedFileTypes?.join(',')}
              required={field.required}
            />
            <div className="flex flex-col items-center justify-center">
              <svg 
                className="w-10 h-10 text-gray-400 mb-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
              </p>
              {field.acceptedFileTypes && (
                <p className="text-xs text-gray-500">
                  {field.acceptedFileTypes.join(', ')}
                </p>
              )}
              {field.maxFileSize && (
                <p className="text-xs text-gray-500">
                  Tamanho máximo: {(field.maxFileSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg 
                  className="w-8 h-8 text-blue-500 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate" style={{ maxWidth: '200px' }}>
                    {fileValue.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileValue.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {field.type !== 'checkbox' && (
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
