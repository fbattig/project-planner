interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  required,
  multiline,
  placeholder,
  maxLength,
}: FormFieldProps) {
  const inputClasses =
    'w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--color-border-focus)] transition-colors';

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
      >
        {label}
        {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={5}
          className={`${inputClasses} resize-y min-h-[100px]`}
        />
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={inputClasses}
        />
      )}
    </div>
  );
}
