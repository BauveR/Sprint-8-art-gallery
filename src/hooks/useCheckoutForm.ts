import { useState } from "react";
import { useAuth } from "../context/AuthContextFirebase";

interface CheckoutFormData {
  nombre: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
}

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
