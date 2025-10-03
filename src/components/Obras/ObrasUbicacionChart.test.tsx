import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ObrasUbicacionChart from './ObrasUbicacionChart';
import type { Obra } from '../../types';

describe('ObrasUbicacionChart', () => {
  const mockObras: Obra[] = [
    {
      id_obra: 1,
      autor: 'Test Author 1',
      titulo: 'Test Obra 1',
      estado_venta: 'disponible',
      ubicacion: 'en_tienda',
    } as Obra,
    {
      id_obra: 2,
      autor: 'Test Author 2',
      titulo: 'Test Obra 2',
      estado_venta: 'disponible',
      ubicacion: 'en_exposicion',
    } as Obra,
    {
      id_obra: 3,
      autor: 'Test Author 3',
      titulo: 'Test Obra 3',
      estado_venta: 'disponible',
      ubicacion: 'almacen',
    } as Obra,
  ];

  it('renders the chart title', () => {
    render(<ObrasUbicacionChart obras={mockObras} />);
    expect(screen.getByText('Distribución de Obras')).toBeInTheDocument();
  });

  it('renders the chart description', () => {
    render(<ObrasUbicacionChart obras={mockObras} />);
    expect(screen.getByText('Por ubicación física')).toBeInTheDocument();
  });

  it('handles empty obras array', () => {
    render(<ObrasUbicacionChart obras={[]} />);
    expect(screen.getByText('Distribución de Obras')).toBeInTheDocument();
  });

  it('processes obras data correctly', () => {
    render(<ObrasUbicacionChart obras={mockObras} />);
    // Verificar que el componente se renderiza sin errores con los datos proporcionados
    expect(screen.getByText('Distribución de Obras')).toBeInTheDocument();
  });
});
