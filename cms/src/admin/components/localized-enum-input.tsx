import { InputRenderer } from '@strapi/strapi/admin';

type LocalizedEnumAttribute = {
  enum?: string[];
  options?: {
    labels?: Record<string, string>;
  };
};

type LocalizedEnumInputProps = {
  attribute: LocalizedEnumAttribute;
  disabled?: boolean;
  error?: string;
  hint?: React.ReactNode;
  initialValue?: string | null;
  label?: React.ReactNode;
  labelAction?: React.ReactNode;
  name: string;
  onChange?: (...args: unknown[]) => void;
  placeholder?: string;
  rawError?: unknown;
  required?: boolean;
  value?: string | null;
};

export default function LocalizedEnumInput({
  attribute,
  disabled,
  hint,
  label,
  labelAction,
  name,
  placeholder,
  required,
}: LocalizedEnumInputProps) {
  const options = (attribute.enum || []).map((value) => ({
    value,
    label: attribute.options?.labels?.[value] || value,
  }));

  return (
    <InputRenderer
      disabled={disabled}
      hint={hint}
      label={label}
      labelAction={labelAction}
      name={name}
      placeholder={placeholder}
      required={required}
      type="enumeration"
      options={options}
    />
  );
}
