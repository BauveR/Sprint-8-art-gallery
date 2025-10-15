import { useState } from "react";
import { useAuth } from "../context/AuthContextFirebase";
import { CheckoutFormData } from "../types/forms";

export function useCheckoutForm() {
  const { user } = useAuth();

  const [formData, setFormData] = useState<CheckoutFormData>({
    nombre: user?.name || "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
