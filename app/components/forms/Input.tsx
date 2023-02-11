import classNames from "classnames";
import InputError from "./InputError";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function Input({ error, id, ...props }: InputProps) {
  return (
    <>
      <input
        id={id}
        className={classNames(
          "input-bordered",
          "input",
          "w-full",
          "max-w-sm",
          error ? ["input-error", "focus:input-error"] : "focus:input-primary"
        )}
        aria-errormessage={error ? `${id}-error` : undefined}
        {...props}
      />
      <InputError error={error} id={`${id}-error`} />
    </>
  );
}
