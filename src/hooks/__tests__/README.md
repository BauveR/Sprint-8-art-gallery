# Guía de Tests para Principiantes

Este directorio contiene tests para validar que el formulario de checkout funcione correctamente.

## ¿Qué es un Test?

Un test es código que verifica que otro código funcione correctamente. Piensa en él como una lista de verificación automática.

## Cómo Ejecutar los Tests

### Ejecutar todos los tests
```bash
npm run test
```

### Ejecutar solo los tests de validación
```bash
npm run test useFormValidation
```

### Ver los tests en modo watch (se re-ejecutan automáticamente)
```bash
npm run test -- --watch
```

## Estructura de un Test

Cada test sigue esta estructura simple:

```typescript
it('debe validar email vacío', () => {
  // 1. PREPARAR: Configurar el escenario
  const { result } = renderHook(() => useFormValidation());

  // 2. ACTUAR: Ejecutar la acción a probar
  act(() => {
    result.current.validateField('email', '');
  });

  // 3. VERIFICAR: Comprobar que el resultado es correcto
  expect(result.current.errors.email).toBe('El email es requerido');
});
```

## Tests Incluidos

### 📧 Email (3 tests)
- ✅ Valida email vacío
- ✅ Valida formato inválido (@)
- ✅ Acepta email correcto

### 👤 Nombre (4 tests)
- ✅ Valida nombre vacío
- ✅ Valida nombre muy corto (< 3 caracteres)
- ✅ Rechaza nombres con números
- ✅ Acepta nombres válidos

### 📱 Teléfono (4 tests)
- ✅ Valida teléfono vacío
- ✅ Valida longitud incorrecta
- ✅ Acepta 10 dígitos sin espacios
- ✅ Acepta 10 dígitos con espacios

### 🏠 Dirección (3 tests)
- ✅ Valida dirección vacía
- ✅ Valida dirección muy corta
- ✅ Acepta dirección válida

### 🔢 Número Exterior (3 tests)
- ✅ Valida número vacío
- ✅ Acepta números
- ✅ Acepta alfanumérico (123-A)

### 🏘️ Colonia (3 tests)
- ✅ Valida colonia vacía
- ✅ Valida colonia muy corta
- ✅ Acepta colonia válida

### 📮 Código Postal (4 tests)
- ✅ Valida CP vacío
- ✅ Rechaza menos de 5 dígitos
- ✅ Rechaza más de 5 dígitos
- ✅ Acepta exactamente 5 dígitos

### 🏙️ Ciudad (3 tests)
- ✅ Valida ciudad vacía
- ✅ Valida ciudad muy corta
- ✅ Acepta ciudad válida

### 🗺️ Estado (2 tests)
- ✅ Valida estado vacío
- ✅ Acepta estado válido

### 🧹 Funciones Auxiliares (2 tests)
- ✅ Limpia un error específico
- ✅ Limpia todos los errores

**Total: 34 tests** que verifican cada campo del formulario

## Conceptos Clave

### describe()
Agrupa tests relacionados. Es como una carpeta que organiza tests similares.

### it() o test()
Define un test individual. Describe lo que debe hacer.

### expect()
Verifica que algo sea verdadero. Es la comprobación final.

### renderHook()
Renderiza un hook de React para poder probarlo.

### act()
Ejecuta acciones que cambian el estado. Simula interacciones del usuario.

## Ejemplo Práctico

Imagina que quieres verificar que un email vacío muestra error:

```typescript
it('debe validar email vacío', () => {
  // Paso 1: Crear el hook
  const { result } = renderHook(() => useFormValidation());

  // Paso 2: Intentar validar un email vacío
  act(() => {
    result.current.validateField('email', '');
  });

  // Paso 3: Verificar que hay un mensaje de error
  expect(result.current.errors.email).toBe('El email es requerido');
});
```

Si el test **pasa** ✅ = El código funciona correctamente
Si el test **falla** ❌ = Hay un bug que debes arreglar

## Cómo Agregar Nuevos Tests

1. Abre el archivo `useFormValidation.test.ts`
2. Copia la estructura de un test existente
3. Modifica el campo y el valor a probar
4. Actualiza el mensaje de error esperado
5. Ejecuta `npm run test` para verificar

## Tips para Principiantes

1. **Lee los tests**: Son documentación viva de cómo debe funcionar el código
2. **Ejecuta un test a la vez**: Usa `.only` para enfocarte en uno
   ```typescript
   it.only('debe validar email vacío', () => { ... });
   ```
3. **Debugging**: Si un test falla, lee el mensaje de error con cuidado
4. **Practica**: Intenta modificar un test para que falle y vuelve a arreglarlo

## Recursos Adicionales

- [Documentación de Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
