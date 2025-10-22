import * as direccionesRepo from "../repositories/direccionesRepo";
import type { CreateDireccionInput } from "../repositories/direccionesRepo";

/**
 * Validar datos de dirección
 */
function validateDireccionData(data: CreateDireccionInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.nombre_completo?.trim()) errors.push("Nombre completo es requerido");
  if (!data.telefono?.trim()) errors.push("Teléfono es requerido");
  if (!data.direccion?.trim()) errors.push("Dirección es requerida");
  if (!data.numero_exterior?.trim()) errors.push("Número exterior es requerido");
  if (!data.colonia?.trim()) errors.push("Colonia es requerida");
  if (!data.codigo_postal?.trim()) errors.push("Código postal es requerido");
  if (!data.ciudad?.trim()) errors.push("Ciudad es requerida");
  if (!data.estado?.trim()) errors.push("Estado es requerido");

  // Validar formato de teléfono (10 dígitos)
  if (data.telefono && !/^\d{10}$/.test(data.telefono.replace(/\s|-/g, ""))) {
    errors.push("Teléfono debe tener 10 dígitos");
  }

  // Validar formato de código postal (5 dígitos)
  if (data.codigo_postal && !/^\d{5}$/.test(data.codigo_postal)) {
    errors.push("Código postal debe tener 5 dígitos");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Obtener todas las direcciones de un usuario
 */
export async function getUserAddresses(userId: string) {
  return await direccionesRepo.findByUserId(userId);
}

/**
 * Obtener una dirección por ID
 */
export async function getAddressById(id: number, userId: string) {
  const direccion = await direccionesRepo.findById(id, userId);

  if (!direccion) {
    throw new Error("Dirección no encontrada");
  }

  return direccion;
}

/**
 * Obtener dirección predeterminada del usuario
 */
export async function getDefaultAddress(userId: string) {
  return await direccionesRepo.findDefaultByUserId(userId);
}

/**
 * Crear una nueva dirección
 */
export async function createAddress(data: CreateDireccionInput) {
  // Validar datos
  const validation = validateDireccionData(data);
  if (!validation.valid) {
    throw new Error(`Datos inválidos: ${validation.errors.join(", ")}`);
  }

  // Si es la primera dirección del usuario, hacerla predeterminada automáticamente
  const existingCount = await direccionesRepo.countByUserId(data.id_user);
  if (existingCount === 0) {
    data.es_predeterminada = true;
  }

  return await direccionesRepo.create(data);
}

/**
 * Actualizar una dirección existente
 */
export async function updateAddress(
  id: number,
  userId: string,
  data: Partial<CreateDireccionInput>
) {
  // Verificar que la dirección existe y pertenece al usuario
  await getAddressById(id, userId);

  // Si hay datos para validar, validarlos
  if (Object.keys(data).length > 0) {
    const fullData = { ...data, id_user: userId } as CreateDireccionInput;
    const validation = validateDireccionData(fullData);

    // Solo validar si se están actualizando campos requeridos
    const requiredFields = ["nombre_completo", "telefono", "direccion", "numero_exterior", "colonia", "codigo_postal", "ciudad", "estado"];
    const hasRequiredFieldUpdate = Object.keys(data).some(key => requiredFields.includes(key));

    if (hasRequiredFieldUpdate && !validation.valid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(", ")}`);
    }
  }

  const updated = await direccionesRepo.update(id, userId, data);

  if (!updated) {
    throw new Error("No se pudo actualizar la dirección");
  }

  return updated;
}

/**
 * Establecer una dirección como predeterminada
 */
export async function setDefaultAddress(id: number, userId: string) {
  // Verificar que la dirección existe y pertenece al usuario
  await getAddressById(id, userId);

  // setAsDefault ya maneja quitar el flag de las otras direcciones
  const success = await direccionesRepo.setAsDefault(id, userId);

  if (!success) {
    throw new Error("No se pudo establecer la dirección como predeterminada");
  }

  return { success: true, message: "Dirección predeterminada actualizada" };
}

/**
 * Eliminar una dirección
 */
export async function deleteAddress(id: number, userId: string) {
  // Verificar que la dirección existe y pertenece al usuario
  const direccion = await getAddressById(id, userId);

  // Verificar que no sea la única dirección predeterminada
  if (direccion.es_predeterminada) {
    const totalDirecciones = await direccionesRepo.countByUserId(userId);
    if (totalDirecciones > 1) {
      throw new Error(
        "No puedes eliminar la dirección predeterminada. Establece otra dirección como predeterminada primero."
      );
    }
  }

  const success = await direccionesRepo.remove(id, userId);

  if (!success) {
    throw new Error("No se pudo eliminar la dirección");
  }

  return { success: true, message: "Dirección eliminada correctamente" };
}

/**
 * Obtener estadísticas de direcciones del usuario
 */
export async function getAddressStats(userId: string) {
  const addresses = await direccionesRepo.findByUserId(userId);
  const defaultAddress = await direccionesRepo.findDefaultByUserId(userId);

  return {
    total: addresses.length,
    hasDefault: !!defaultAddress,
    defaultAddressId: defaultAddress?.id_direccion || null,
  };
}
