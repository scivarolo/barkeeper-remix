interface InputErrorProps {
  error: string | undefined;
  id: string;
}

export default function InputError({ error }: InputErrorProps) {
  return error ? (
    <span
      className="form-validation-error mt-1 text-xs text-error"
      role="alert"
      id="password-error">
      {error}
    </span>
  ) : null;
}
