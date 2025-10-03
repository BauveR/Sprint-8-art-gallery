import * as React from "react";

type Variant = "default" | "secondary" | "destructive" | "ghost" | "link" | "outline";
type Size = "sm" | "default" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const classesByVariant: Record<Variant, string> = {
  default: "bg-black text-white hover:opacity-90",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent hover:bg-gray-100",
  link: "bg-transparent text-blue-600 underline p-0",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
};

const classesBySize: Record<Size, string> = {
  sm: "px-2 py-1 text-sm",
  default: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "h-10 w-10",
};

export function buttonVariants({ variant = "default", size = "default" }: { variant?: Variant; size?: Size } = {}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  return `${base} ${classesByVariant[variant]} ${classesBySize[size]}`;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const cls = `${buttonVariants({ variant, size })} ${className}`;
    return <button ref={ref} className={cls} {...props} />;
  }
);
Button.displayName = "Button";
