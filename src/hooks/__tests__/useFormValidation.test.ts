/**
 * Tests para el hook de validación de formulario
 *
 * Este archivo contiene tests simples para aprender testing en React
 * Cada test valida un campo específico del formulario de checkout
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../useFormValidation';

// ============================================
// GUÍA PARA PRINCIPIANTES
// ============================================
// describe(): Agrupa tests relacionados
// it() o test(): Define un test individual
// expect(): Verifica que algo sea verdadero
// renderHook(): Renderiza un hook de React para testing
// act(): Ejecuta acciones que actualizan el estado
// ============================================

describe('useFormValidation - Validación de Campos de Envío', () => {

  // ====================================
  // TESTS DE EMAIL
  // ====================================

  it('debe validar email vacío', () => {
    // Paso 1: Renderizar el hook
    const { result } = renderHook(() => useFormValidation());

    // Paso 2: Validar un email vacío
    act(() => {
      const error = result.current.validateField('email', '');
    });

    // Paso 3: Verificar que hay un error
    expect(result.current.errors.email).toBe('El email es requerido');
  });

  it('debe validar email con formato inválido', () => {
    const { result } = renderHook(() => useFormValidation());

    // Email sin @
    act(() => {
      result.current.validateField('email', 'emailinvalido');
    });

    expect(result.current.errors.email).toBe('Email inválido');
  });

  it('debe aceptar email válido', () => {
    const { result } = renderHook(() => useFormValidation());

    // Email correcto
    act(() => {
      result.current.validateField('email', 'usuario@ejemplo.com');
    });

    // No debe haber error
    expect(result.current.errors.email).toBe('');
  });

  // ====================================
  // TESTS DE NOMBRE
  // ====================================

  it('debe validar nombre vacío', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('nombre', '');
    });

    expect(result.current.errors.nombre).toBe('El nombre es requerido');
  });

  it('debe validar nombre muy corto', () => {
    const { result } = renderHook(() => useFormValidation());

    // Nombre con menos de 3 caracteres
    act(() => {
      result.current.validateField('nombre', 'AB');
    });

    expect(result.current.errors.nombre).toBe('El nombre debe tener al menos 3 caracteres');
  });

  it('debe validar nombre con números', () => {
    const { result } = renderHook(() => useFormValidation());

    // Nombres no deben tener números
    act(() => {
      result.current.validateField('nombre', 'Juan123');
    });

    expect(result.current.errors.nombre).toBe('El nombre solo debe contener letras');
  });

  it('debe aceptar nombre válido', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('nombre', 'Juan Pérez');
    });

    expect(result.current.errors.nombre).toBe('');
  });

  // ====================================
  // TESTS DE TELÉFONO
  // ====================================

  it('debe validar teléfono vacío', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('telefono', '');
    });

    expect(result.current.errors.telefono).toBe('El teléfono es requerido');
  });

  it('debe validar teléfono con menos de 10 dígitos', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('telefono', '123456789');
    });

    expect(result.current.errors.telefono).toBe('El teléfono debe tener 10 dígitos');
  });

  it('debe aceptar teléfono válido sin espacios', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('telefono', '5512345678');
    });

    expect(result.current.errors.telefono).toBe('');
  });

  it('debe aceptar teléfono válido con espacios', () => {
    const { result } = renderHook(() => useFormValidation());

    // Los espacios se deben ignorar en la validación
    act(() => {
      result.current.validateField('telefono', '55 1234 5678');
    });

    expect(result.current.errors.telefono).toBe('');
  });

  // ====================================
  // TESTS DE DIRECCIÓN/CALLE
  // ====================================

  it('debe validar dirección vacía', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('direccion', '');
    });

    expect(result.current.errors.direccion).toBe('La calle es requerida');
  });

  it('debe validar dirección muy corta', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('direccion', 'Av');
    });

    expect(result.current.errors.direccion).toBe('La dirección debe tener al menos 5 caracteres');
  });

  it('debe aceptar dirección válida', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('direccion', 'Av. Reforma');
    });

    expect(result.current.errors.direccion).toBe('');
  });

  // ====================================
  // TESTS DE NÚMERO EXTERIOR
  // ====================================

  it('debe validar número exterior vacío', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('numeroExterior', '');
    });

    expect(result.current.errors.numeroExterior).toBe('El número exterior es requerido');
  });

  it('debe aceptar número exterior numérico', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('numeroExterior', '123');
    });

    expect(result.current.errors.numeroExterior).toBe('');
  });

  it('debe aceptar número exterior alfanumérico', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('numeroExterior', '123-A');
    });

    expect(result.current.errors.numeroExterior).toBe('');
  });

  // ====================================
  // TESTS DE COLONIA
  // ====================================

  it('debe validar colonia vacía', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('colonia', '');
    });

    expect(result.current.errors.colonia).toBe('La colonia es requerida');
  });

  it('debe validar colonia muy corta', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('colonia', 'Ab');
    });

    expect(result.current.errors.colonia).toBe('La colonia debe tener al menos 3 caracteres');
  });

  it('debe aceptar colonia válida', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('colonia', 'Juárez');
    });

    expect(result.current.errors.colonia).toBe('');
  });

  // ====================================
  // TESTS DE CÓDIGO POSTAL
  // ====================================

  it('debe validar código postal vacío', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('codigoPostal', '');
    });

    expect(result.current.errors.codigoPostal).toBe('El código postal es requerido');
  });

  it('debe validar código postal con menos de 5 dígitos', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('codigoPostal', '1234');
    });

    expect(result.current.errors.codigoPostal).toBe('El código postal debe tener 5 dígitos');
  });

  it('debe validar código postal con más de 5 dígitos', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('codigoPostal', '123456');
    });

    expect(result.current.errors.codigoPostal).toBe('El código postal debe tener 5 dígitos');
  });

  it('debe aceptar código postal válido', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('codigoPostal', '06600');
    });

    expect(result.current.errors.codigoPostal).toBe('');
  });

  // ====================================
  // TESTS DE CIUDAD
  // ====================================

  it('debe validar ciudad vacía', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('ciudad', '');
    });

    expect(result.current.errors.ciudad).toBe('La ciudad es requerida');
  });

  it('debe validar ciudad muy corta', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('ciudad', 'CD');
    });

    expect(result.current.errors.ciudad).toBe('La ciudad debe tener al menos 3 caracteres');
  });

  it('debe aceptar ciudad válida', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('ciudad', 'Ciudad de México');
    });

    expect(result.current.errors.ciudad).toBe('');
  });

  // ====================================
  // TESTS DE ESTADO
  // ====================================

  it('debe validar estado vacío', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('estado', '');
    });

    expect(result.current.errors.estado).toBe('El estado es requerido');
  });

  it('debe aceptar estado válido', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      result.current.validateField('estado', 'Ciudad de México');
    });

    expect(result.current.errors.estado).toBe('');
  });

  // ====================================
  // TESTS DE FUNCIONES AUXILIARES
  // ====================================

  it('debe limpiar un error específico', () => {
    const { result } = renderHook(() => useFormValidation());

    // Primero creamos un error
    act(() => {
      result.current.validateField('email', '');
    });

    expect(result.current.errors.email).toBe('El email es requerido');

    // Ahora limpiamos el error
    act(() => {
      result.current.clearError('email');
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('debe limpiar todos los errores', () => {
    const { result } = renderHook(() => useFormValidation());

    // Creamos varios errores
    act(() => {
      result.current.validateField('email', '');
      result.current.validateField('nombre', '');
      result.current.validateField('telefono', '');
    });

    // Verificamos que existen errores
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);

    // Limpiamos todos los errores
    act(() => {
      result.current.clearAllErrors();
    });

    // Verificamos que no hay errores
    expect(Object.keys(result.current.errors).length).toBe(0);
  });
});
