import { useState } from "react";
import { useAuth } from "../context/AuthContextFirebase";
import { CheckoutFormData } from "../types/forms";

export function useCheckoutForm() {
  const { user } = useAuth();

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

  return {
    formData,
    handleChange,
  };
}
