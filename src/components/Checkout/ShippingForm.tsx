import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ShippingFormProps {
  formData: {
    nombre: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    telefono: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ShippingForm({ formData, onChange }: ShippingFormProps) {
  return (
    <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
      <CardHeader>
        <CardTitle>Información de Envío</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre completo</label>
          <Input name="nombre" value={formData.nombre} onChange={onChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Dirección</label>
          <Input name="direccion" value={formData.direccion} onChange={onChange} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ciudad</label>
            <Input name="ciudad" value={formData.ciudad} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Código Postal</label>
            <Input name="codigoPostal" value={formData.codigoPostal} onChange={onChange} required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <Input name="telefono" type="tel" value={formData.telefono} onChange={onChange} required />
        </div>
      </CardContent>
    </Card>
  );
}
