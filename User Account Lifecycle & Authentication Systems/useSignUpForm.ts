import { useState, FormEvent } from 'react';
import { validateEmail, validatePassword, getPasswordStrength } from './validation';

type FieldErrors = { email: string; password: string | React.ReactNode };

// Placeholder mock — in a real app this would be a generated Apollo mutation hook.
function useCreateAccountMutation() {
  return [
    async ({ variables }: { variables: { email: string; password: string } }) => {
      console.log('Submitting', variables);
    },
    { loading: false, error: undefined, data: undefined }
  ] as const;
}

export function useSignUpForm() {
  const [createAccount, { loading, error, data }] = useCreateAccountMutation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({ email: '', password: '' });

  const handleChange = (field: 'email' | 'password', value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const emailResult = validateEmail(values.email);
    const passwordResult = validatePassword(values.password);

    if (!emailResult.valid) {
      setErrors((prev) => ({ ...prev, email: emailResult.message }));
      return;
    }

    if (!passwordResult.valid) {
      setErrors((prev) => ({ ...prev, password: passwordResult.message }));
      return;
    }

    createAccount({ variables: values });
  };

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const strength = getPasswordStrength(values.password);

  return {
    values,
    errors,
    passwordVisible,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
    loading,
    error,
    data,
    strength
  };
}
