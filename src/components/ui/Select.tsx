import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, helperText, options, className = '', ...props }, ref) => {
        return (
            <div className="form-group">
                {label && (
                    <label className="form-label" htmlFor={props.id}>
                        {label}
                        {props.required && <span className="text-danger-500 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`form-select ${error ? 'border-danger-500 focus:ring-danger-500' : ''} ${className}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="form-error">{error}</p>}
                {helperText && !error && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
