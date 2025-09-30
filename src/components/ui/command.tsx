import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";

export function Command(props: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={
        "flex h-full w-full flex-col overflow-hidden rounded-xl border bg-white text-sm " +
        (props.className ?? "")
      }
      {...props}
    />
  );
}
export const CommandInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="px-2 py-2 border-b">
    <input
      className="h-8 w-full outline-none placeholder:text-gray-400"
      {...props}
    />
  </div>
);

export function CommandList(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={"max-h-60 overflow-auto " + (props.className ?? "")} {...props} />;
}
export function CommandEmpty(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="px-3 py-6 text-sm text-gray-500" {...props} />;
}
export function CommandGroup({
  heading,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { heading?: string }) {
  return (
    <div className="py-2">
      {heading && <div className="px-3 pb-1 text-xs font-semibold text-gray-500">{heading}</div>}
      <div {...props} />
    </div>
  );
}
export function CommandItem(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }
) {
  return (
    <button
      className={
        "flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 " +
        (props.selected ? "bg-gray-100" : "")
      }
      {...props}
    />
  );
}
