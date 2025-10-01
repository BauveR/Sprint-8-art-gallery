import * as React from "react";

type Variant = "default" | "secondary" | "destructive" | "ghost" | "link";
type Size = "sm" | "default" | "lg";

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
};

const classesBySize: Record<Size, string> = {
  sm: "px-2 py-1 text-sm",
  default: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
    const cls = `${base} ${classesByVariant[variant]} ${classesBySize[size]} ${className}`;
    return <button ref={ref} className={cls} {...props} />;
  }
);
Button.displayName = "Button";
