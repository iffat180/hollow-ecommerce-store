import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export default function Input({
  label,
  error,
  required = false,
  className = '',
  id,
  ...props
}: InputProps) {
  // Generate unique ID if not provided
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-roboto font-medium text-dark mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        id={inputId}
        className={`
          w-full px-4 py-3 rounded-lg border-2 
          bg-white text-dark font-roboto
          border-gray-300 
          focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20
          disabled:bg-gray-100 disabled:cursor-not-allowed
          placeholder:text-gray-400
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-red-500 font-roboto"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}