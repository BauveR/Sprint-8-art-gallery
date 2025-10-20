import { useState } from "react";
import { CheckoutFormData } from "../types/forms";

export interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): string => {
    if (!email) return "El email es requerido";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email inválido";
    return "";
  };

  const validateNombre = (nombre: string): string => {
    if (!nombre) return "El nombre es requerido";
    if (nombre.length < 3) return "El nombre debe tener al menos 3 caracteres";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return "El nombre solo debe contener letras";
    return "";
  };

  const validateTelefono = (telefono: string): string => {
    if (!telefono) return "El teléfono es requerido";
    const cleanPhone = telefono.replace(/\s/g, "");
    if (!/^\d{10}$/.test(cleanPhone)) return "El teléfono debe tener 10 dígitos";
    return "";
  };

  const validateDireccion = (direccion: string): string => {
    if (!direccion) return "La calle es requerida";
    if (direccion.length < 5) return "La dirección debe tener al menos 5 caracteres";
    return "";
  };

  const validateNumeroExterior = (numero: string): string => {
    if (!numero) return "El número exterior es requerido";
    if (!/^[0-9a-zA-Z\-]+$/.test(numero)) return "Número exterior inválido";
    return "";
  };

  const validateColonia = (colonia: string): string => {
    if (!colonia) return "La colonia es requerida";
    if (colonia.length < 3) return "La colonia debe tener al menos 3 caracteres";
    return "";
  };

  const validateCodigoPostal = (cp: string): string => {
    if (!cp) return "El código postal es requerido";
    if (!/^\d{5}$/.test(cp)) return "El código postal debe tener 5 dígitos";
    return "";
  };

  const validateCiudad = (ciudad: string): string => {
    if (!ciudad) return "La ciudad es requerida";
    if (ciudad.length < 3) return "La ciudad debe tener al menos 3 caracteres";
    return "";
  };

  const validateEstado = (estado: string): string => {
    if (!estado) return "El estado es requerido";
    return "";
  };

  const validateForm = (formData: CheckoutFormData): boolean => {
    const newErrors: ValidationErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const nombreError = validateNombre(formData.nombre);
    if (nombreError) newErrors.nombre = nombreError;

    const telefonoError = validateTelefono(formData.telefono);
    if (telefonoError) newErrors.telefono = telefonoError;

    const direccionError = validateDireccion(formData.direccion);
    if (direccionError) newErrors.direccion = direccionError;

    const numeroError = validateNumeroExterior(formData.numeroExterior);
    if (numeroError) newErrors.numeroExterior = numeroError;

    const coloniaError = validateColonia(formData.colonia);
    if (coloniaError) newErrors.colonia = coloniaError;

    const cpError = validateCodigoPostal(formData.codigoPostal);
    if (cpError) newErrors.codigoPostal = cpError;

    const ciudadError = validateCiudad(formData.ciudad);
    if (ciudadError) newErrors.ciudad = ciudadError;

    const estadoError = validateEstado(formData.estado);
    if (estadoError) newErrors.estado = estadoError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name: keyof CheckoutFormData, value: string): string => {
    let error = "";

    switch (name) {
      case "email":
        error = validateEmail(value);
        break;
      case "nombre":
        error = validateNombre(value);
        break;
      case "telefono":
        error = validateTelefono(value);
        break;
      case "direccion":
        error = validateDireccion(value);
        break;
      case "numeroExterior":
        error = validateNumeroExterior(value);
        break;
      case "colonia":
        error = validateColonia(value);
        break;
      case "codigoPostal":
        error = validateCodigoPostal(value);
        break;
      case "ciudad":
        error = validateCiudad(value);
        break;
      case "estado":
        error = validateEstado(value);
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return error;
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateForm,
    validateField,
    clearError,
    clearAllErrors,
  };
}
