"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search tasks..." }: SearchBarProps) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors focus-within:border-sky-500 dark:border-slate-700 dark:bg-slate-900 sm:px-5">
      <svg
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border-0 bg-transparent px-0 py-0 text-sm text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
      />
    </label>
  );
}
