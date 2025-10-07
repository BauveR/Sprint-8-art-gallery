import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'glass' | 'blue' | 'default';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
}

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
    bg-gray-600
    text-white
    shadow
    hover:bg-gray-500
    duration-200
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
  onClick,
  className = '',
  type = 'button',
  variant = 'default',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        // Estilos base
        'inline-flex items-center justify-center gap-2 mt-0 font-semibold py-2 px-5 rounded-full transition-all whitespace-nowrap',
        // Variante específica
        BUTTON_VARIANTS[variant],
        // Clases personalizadas
        className
      )}
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
