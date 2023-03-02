import classNames from "classnames";

interface ContainerProps {
  className?: string;
}

export default function Container({
  children,
  className,
}: React.PropsWithChildren) {
  return (
    <div
      className={classNames(
        "rounded-xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800",
        className
      )}>
      {children}
    </div>
  );
}
