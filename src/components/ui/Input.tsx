import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="form-group">
                {label && (
                    <label className="form-label" htmlFor={props.id}>
                        {label}
                        {props.required && <span className="text-danger-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`form-input ${error ? 'border-danger-500 focus:ring-danger-500' : ''} ${className}`}
                    {...props}
                />
                {error && <p className="form-error">{error}</p>}
                {helperText && !error && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
