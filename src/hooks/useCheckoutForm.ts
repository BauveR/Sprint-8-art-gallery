import { useState } from "react";
import { useAuth } from "../context/AuthContextFirebase";
import { CheckoutFormData } from "../types/forms";
import type { DireccionEnvio } from "./useDirecciones";

export function useCheckoutForm() {
  const { user } = useAuth();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: user?.email || "",
    nombre: user?.name || "",
    telefono: "",
    direccion: "",
    numeroExterior: "",
    numeroInterior: "",
    colonia: "",
    codigoPostal: "",
    ciudad: "",
    estado: "",
    pais: "México",
    referencias: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const loadAddressData = (direccion: DireccionEnvio) => {
    setSelectedAddressId(direccion.id_direccion);
    setFormData({
      email: direccion.email || user?.email || "",
      nombre: direccion.nombre_completo,
      telefono: direccion.telefono,
      direccion: direccion.direccion,
      numeroExterior: direccion.numero_exterior,
      numeroInterior: direccion.numero_interior || "",
      colonia: direccion.colonia,
      codigoPostal: direccion.codigo_postal,
      ciudad: direccion.ciudad,
      estado: direccion.estado,
      pais: direccion.pais,
      referencias: direccion.referencias || "",
    });
  };

  return {
    formData,
    selectedAddressId,
    handleChange,
    loadAddressData,
    setFormData,
  };
}
