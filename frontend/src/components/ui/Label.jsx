// src/components/ui/Label.jsx
export function Label({ children, className = "", ...props }) {
  return (
    <label
      {...props}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  );
}
