export function Input({ className = "", ...props }) {
    return (
      <input
        {...props}
        className={`border p-2 rounded w-full bg-white text-black dark:bg-zinc-800 dark:text-white ${className}`}
      />
    );
  }
  