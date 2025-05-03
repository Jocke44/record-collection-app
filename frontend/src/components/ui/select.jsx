export function Select({ className = "", ...props }) {
    return (
      <select
        {...props}
        className={`border p-2 rounded text-sm bg-white text-black dark:bg-zinc-800 dark:text-white ${className}`}
      />
    );
  }
  