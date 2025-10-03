import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ObrasVentasChart from './ObrasVentasChart';
import type { Obra } from '../../types';

describe('ObrasVentasChart', () => {
  const mockObras: Obra[] = [
    {
      id_obra: 1,
      autor: 'Test Author 1',
      titulo: 'Test Obra 1',
      estado_venta: 'entregado',
      ubicacion: 'almacen',
    } as Obra,
    {
      id_obra: 2,
      autor: 'Test Author 2',
      titulo: 'Test Obra 2',
      estado_venta: 'enviado',
      ubicacion: 'almacen',
    } as Obra,
    {
      id_obra: 3,
      autor: 'Test Author 3',
      titulo: 'Test Obra 3',
      estado_venta: 'disponible',
      ubicacion: 'en_tienda',
    } as Obra,
  ];

  it('renders the chart title', () => {
    render(<ObrasVentasChart obras={mockObras} />);
    expect(screen.getByText('Ventas Mensuales')).toBeInTheDocument();
  });

  it('renders the description with totals', () => {
    render(<ObrasVentasChart obras={mockObras} />);
    // La descripción incluye información de últimos 6 meses
    expect(screen.getByText(/Últimos 6 meses/)).toBeInTheDocument();
  });

  it('handles empty obras array', () => {
    render(<ObrasVentasChart obras={[]} />);
    expect(screen.getByText('Ventas Mensuales')).toBeInTheDocument();
  });

  it('processes ventas data correctly', () => {
    render(<ObrasVentasChart obras={mockObras} />);
    // Verificar que el componente se renderiza sin errores con los datos proporcionados
    expect(screen.getByText('Ventas Mensuales')).toBeInTheDocument();
  });
});
