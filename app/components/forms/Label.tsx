export default function Label({
  children,
  ...props
}: React.PropsWithChildren<React.LabelHTMLAttributes<HTMLLabelElement>>) {
  return (
    <label className="label" {...props}>
      {children}
    </label>
  );
}
