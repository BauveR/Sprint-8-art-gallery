import * as React from "react";
import { Button } from "./Button";

export type ComboItem = { value: string | number; label: string };

interface ComboboxProps {
  items: ComboItem[];
  placeholder?: string;
  onSelect: (item: ComboItem) => void;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  items,
  placeholder = "Buscar…",
  onSelect,
  className = "",
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const select = (it: ComboItem) => {
    onSelect(it);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="flex gap-2">
        <input
          disabled={disabled}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="border rounded-lg px-3 py-2 text-sm w-56 bg-white"
          onFocus={() => setOpen(true)}
        />
        <Button
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Cerrar" : "Abrir"}
        </Button>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-[22rem] rounded-xl border bg-white shadow-lg">
          <ul className="max-h-56 overflow-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">Sin resultados</li>
            )}
            {filtered.map((it) => (
              <li key={String(it.value)}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => select(it)}
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
