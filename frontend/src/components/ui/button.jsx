export function Button({ children, variant = "default", size = "md", className = "", ...props }) {
    const base = "rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition";
  
    const variants = {
      default: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-400 dark:hover:bg-blue-500",
      outline: "border border-gray-400 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
      ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
      destructive: "bg-red-600 hover:bg-red-700 text-white dark:bg-red-400 dark:hover:bg-red-500",
    };
  
    const sizes = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
      icon: "p-2",
    };
  
    return (
      <button
        {...props}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {children}
      </button>
    );
  }
  