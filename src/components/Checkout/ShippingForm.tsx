import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShippingFormProps } from "../../types/components";
import { useFormValidation } from "../../hooks/useFormValidation";
import { CheckoutFormData } from "../../types/forms";

const ESTADOS_MEXICO = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Guanajuato",
  "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

export default function ShippingForm({ formData, onChange }: ShippingFormProps) {
  const { errors, validateField } = useFormValidation();

  const handleBlur = (name: keyof CheckoutFormData) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    validateField(name, e.target.value);
  };

  const handleChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e);
    // Validate on change only if there's already an error
    if (errors[e.target.name]) {
      validateField(e.target.name as keyof CheckoutFormData, e.target.value);
    }
  };

  return (
    <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
      <CardHeader>
        <CardTitle>Información de Envío</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información de contacto */}
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChangeWithValidation}
            onBlur={handleBlur("email")}
            placeholder="tu@email.com"
            className={errors.email ? "border-red-500" : ""}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre completo *</label>
            <Input
              name="nombre"
              value={formData.nombre}
              onChange={handleChangeWithValidation}
              onBlur={handleBlur("nombre")}
              placeholder="Juan Pérez"
              className={errors.nombre ? "border-red-500" : ""}
              required
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Teléfono *</label>
            <Input
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChangeWithValidation}
              onBlur={handleBlur("telefono")}
              placeholder="55 1234 5678"
              className={errors.telefono ? "border-red-500" : ""}
              required
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium mb-2">Calle *</label>
          <Input
            name="direccion"
            value={formData.direccion}
            onChange={handleChangeWithValidation}
            onBlur={handleBlur("direccion")}
            placeholder="Av. Reforma"
            className={errors.direccion ? "border-red-500" : ""}
            required
          />
          {errors.direccion && (
            <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Número Ext. *</label>
            <Input
              name="numeroExterior"
              value={formData.numeroExterior}
              onChange={handleChangeWithValidation}
              onBlur={handleBlur("numeroExterior")}
              placeholder="123"
              className={errors.numeroExterior ? "border-red-500" : ""}
              required
            />
            {errors.numeroExterior && (
              <p className="text-red-500 text-sm mt-1">{errors.numeroExterior}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Número Int.</label>
            <Input
              name="numeroInterior"
              value={formData.numeroInterior || ""}
              onChange={handleChangeWithValidation}
              placeholder="4B"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Código Postal *</label>
            <Input
              name="codigoPostal"
              value={formData.codigoPostal}
              onChange={handleChangeWithValidation}
              onBlur={handleBlur("codigoPostal")}
              placeholder="06600"
              maxLength={5}
              pattern="[0-9]{5}"
              className={errors.codigoPostal ? "border-red-500" : ""}
              required
            />
            {errors.codigoPostal && (
              <p className="text-red-500 text-sm mt-1">{errors.codigoPostal}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Colonia *</label>
          <Input
            name="colonia"
            value={formData.colonia}
            onChange={handleChangeWithValidation}
            onBlur={handleBlur("colonia")}
            placeholder="Juárez"
            className={errors.colonia ? "border-red-500" : ""}
            required
          />
          {errors.colonia && (
            <p className="text-red-500 text-sm mt-1">{errors.colonia}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ciudad *</label>
            <Input
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChangeWithValidation}
              onBlur={handleBlur("ciudad")}
              placeholder="Ciudad de México"
              className={errors.ciudad ? "border-red-500" : ""}
              required
            />
            {errors.ciudad && (
              <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estado *</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChangeWithValidation}
              onBlur={handleBlur("estado")}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.estado ? "border-red-500" : "border-input"}`}
              required
            >
              <option value="">Selecciona un estado</option>
              {ESTADOS_MEXICO.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            {errors.estado && (
              <p className="text-red-500 text-sm mt-1">{errors.estado}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">País *</label>
          <Input
            name="pais"
            value={formData.pais}
            onChange={onChange}
            readOnly
            disabled
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Solo disponible para envíos en México</p>
        </div>

        {/* Referencias opcionales */}
        <div>
          <label className="block text-sm font-medium mb-2">Referencias de entrega (opcional)</label>
          <textarea
            name="referencias"
            value={formData.referencias || ""}
            onChange={onChange}
            placeholder="Ej: Entre calle X y Y, casa de color azul, timbre #2"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </CardContent>
    </Card>
  );
}
