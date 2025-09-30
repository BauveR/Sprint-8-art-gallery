import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export function PopoverContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align="start"
        className={
          "z-50 w-[280px] rounded-xl border bg-white p-2 shadow-md outline-none " +
          (className ?? "")
        }
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
