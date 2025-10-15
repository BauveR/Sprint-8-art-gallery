import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'glass' | 'blue' | 'default' | 'ghost' | 'secondary' | 'outline' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'default';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
}

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4',
  lg: 'py-3 px-6 text-lg',
  default: 'py-2 px-5',
};

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  glass: `
    bg-gradient-to-r from-indigo-300/20 to-teal-300/20
    backdrop-blur-xl
    shadow-2xl shadow-black/5
    border border-slate-500/10
    ring-1 ring-slate-900/10
    text-blue-800
    font-extrabold
    hover:from-indigo-300/30 hover:to-teal-300/30
    hover:border-slate-900/40
    hover:shadow-slate-900/20
    dark:bg-gradient-to-r dark:from-white/10 dark:to-white/10
    dark:border-white/20
    dark:ring-white/10
    dark:text-white
    dark:hover:from-white/20 dark:hover:to-white/20
    dark:hover:border-white/30
    dark:hover:shadow-white/20
    hover:scale-105
    active:scale-95
    transition-all duration-700 ease-out
    relative overflow-hidden
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-slate-900/20 before:to-transparent
    dark:before:via-white/20
    before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000
  `,
  blue: `
    bg-slate-500
    text-white
    shadow-md
    hover:bg-slate-400
    duration-300
  `,
  default: `
    bg-black
    text-white
    hover:opacity-90
  `,
  ghost: `
    bg-transparent
    hover:bg-gray-100
    dark:hover:bg-gray-800
  `,
  secondary: `
    bg-gray-100
    hover:bg-gray-200
    text-gray-900
    dark:bg-gray-800
    dark:hover:bg-gray-700
    dark:text-gray-100
  `,
  outline: `
    border
    border-input
    bg-background
    hover:bg-accent
    hover:text-accent-foreground
  `,
  destructive: `
    bg-red-600
    text-white
    hover:bg-red-700
  `,
};

/**
 * Función helper para generar clases de variantes de botón
 * Usada por otros componentes como Calendar
 */
export function buttonVariants({ variant = 'default' }: { variant?: ButtonVariant } = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 mt-0 font-semibold py-2 px-5 rounded-full transition-all whitespace-nowrap',
    BUTTON_VARIANTS[variant]
  );
}

/**
 * Componente de botón unificado con múltiples variantes
 * @param variant - Estilo del botón (glass, blue, default)
 */
export function Button({
  children,
  className = '',
  type = 'button',
  variant = 'default',
  size = 'default',
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        // Estilos base
        'inline-flex items-center justify-center gap-2 mt-0 font-semibold rounded-full transition-all whitespace-nowrap',
        // Size
        BUTTON_SIZES[size],
        // Variante específica
        BUTTON_VARIANTS[variant],
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed',
        // Clases personalizadas
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Re-exports con nombres legacy para compatibilidad
export const GlassButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="glass" />
);

export const BlueButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="blue" />
);
