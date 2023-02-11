export default function FormControl({
  children,
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={"form-control w-full max-w-sm " + className} {...props}>
      {children}
    </div>
  );
}
