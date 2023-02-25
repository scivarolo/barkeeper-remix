export default function Container({ children }: React.PropsWithChildren) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      {children}
    </div>
  );
}
