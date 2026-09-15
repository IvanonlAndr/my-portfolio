import { useSignUpForm } from './useSignUpForm';

export function SignUpForm() {
  const {
    values,
    errors,
    passwordVisible,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
    loading,
    strength
  } = useSignUpForm();

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </label>
      {errors.email && <span className="error">{errors.email}</span>}

      <label>
        Password
        <input
          type={passwordVisible ? 'text' : 'password'}
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />
        <button type="button" onClick={togglePasswordVisibility}>
          {passwordVisible ? 'Hide' : 'Show'}
        </button>
      </label>
      {errors.password && <span className="error">{errors.password}</span>}

      <div className="strength-meter">{strength.percentage}% strong</div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Sign up'}
      </button>
    </form>
  );
}
