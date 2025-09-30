import * as React from "react";

type Variant = "default" | "secondary" | "destructive" | "ghost" | "link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const classesByVariant: Record<Variant, string> = {
  default: "bg-black text-white hover:opacity-90",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent hover:bg-gray-100",
  link: "bg-transparent text-blue-600 underline p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
    const cls = `${base} ${classesByVariant[variant]} ${className}`;
    return <button ref={ref} className={cls} {...props} />;
  }
);
Button.displayName = "Button";
