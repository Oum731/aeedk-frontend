export default function Container({ children, className = "" }) {
  return (
    <div
      className={`w-full max-w-7xl px-4 sm:px-6 md:px-8 mx-auto ${className}`}
    >
      {children}
    </div>
  );
}
