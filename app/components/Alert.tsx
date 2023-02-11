export interface AlertProps {
  icon?: React.ReactNode;
  className?: string;
}

export default function Alert({
  icon,
  children,
  className,
}: React.PropsWithChildren<AlertProps>) {
  return (
    <div className={"alert alert-error " + className}>
      {icon}
      <span>{children}</span>
    </div>
  );
}
