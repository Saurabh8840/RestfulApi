// src/components/ui/Input.jsx
export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}
