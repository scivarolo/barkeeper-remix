export default function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="p-12">
      <div className="alert alert-error text-red-900 shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 flex-shrink-0 stroke-red-800">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="font-bold">
              Spilled drinks! Looks like something went wrong.
            </h3>
            <div className="text-xs">{error.message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
