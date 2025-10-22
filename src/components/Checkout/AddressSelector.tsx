import { useState } from "react";
import {
  useDirecciones,
  useCreateDireccion,
  useSetDefaultDireccion,
  type DireccionEnvio,
} from "@/hooks/useDirecciones";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ShippingForm from "./ShippingForm";
import type { CheckoutFormData } from "../../types/forms";

interface AddressSelectorProps {
  formData: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSelectAddress: (direccion: DireccionEnvio) => void;
}

export default function AddressSelector({ formData, onChange, onSelectAddress }: AddressSelectorProps) {
  const { toast } = useToast();
  const { data: direcciones = [], isLoading } = useDirecciones();
  const createDireccion = useCreateDireccion();
  const setDefault = useSetDefaultDireccion();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(false);

  // Si no hay direcciones guardadas, mostrar el formulario directamente
  if (isLoading) {
    return (
      <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando direcciones...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSelectAddress = (direccionId: number) => {
    const direccion = direcciones.find((d) => d.id_direccion === direccionId);
    if (direccion) {
      setSelectedId(direccionId);
      setShowNewForm(false);
      onSelectAddress(direccion);
    }
  };

  const handleSaveNewAddress = async () => {
    if (!saveNewAddress) return;

    try {
      await createDireccion.mutateAsync({
        nombre_completo: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        numero_exterior: formData.numeroExterior,
        numero_interior: formData.numeroInterior,
        colonia: formData.colonia,
        codigo_postal: formData.codigoPostal,
        ciudad: formData.ciudad,
        estado: formData.estado,
        pais: formData.pais,
        referencias: formData.referencias,
      });

      toast({
        title: "Dirección guardada",
        description: "Tu dirección ha sido guardada para futuras compras",
      });
    } catch (error: any) {
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudo guardar la dirección",
        variant: "destructive",
      });
    }
  };

  if (direcciones.length === 0 || showNewForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Información de Envío</h3>
          {direcciones.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewForm(false)}
            >
              Ver direcciones guardadas
            </Button>
          )}
        </div>

        <ShippingForm formData={formData} onChange={onChange} />

        {direcciones.length > 0 && (
          <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
            <input
              type="checkbox"
              id="save-address"
              checked={saveNewAddress}
              onChange={(e) => setSaveNewAddress(e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="save-address" className="text-sm text-gray-700 dark:text-gray-300">
              Guardar esta dirección para futuras compras
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Dirección de Envío
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowNewForm(true);
              setSelectedId(null);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Nueva dirección
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3">
          {direcciones.map((direccion) => (
            <div key={direccion.id_direccion} className="flex items-start space-x-3">
              <input
                type="radio"
                name="direccion"
                id={`direccion-${direccion.id_direccion}`}
                value={direccion.id_direccion}
                checked={selectedId === direccion.id_direccion}
                onChange={() => handleSelectAddress(direccion.id_direccion)}
                className="mt-4 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
              />
              <Label
                htmlFor={`direccion-${direccion.id_direccion}`}
                className="flex-1 cursor-pointer"
              >
                <div className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedId === direccion.id_direccion
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {direccion.nombre_completo}
                        </p>
                        {direccion.es_predeterminada && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Predeterminada
                          </Badge>
                        )}
                        {direccion.alias && (
                          <Badge variant="outline" className="text-xs">
                            {direccion.alias}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {direccion.direccion} {direccion.numero_exterior}
                        {direccion.numero_interior && `, Int. ${direccion.numero_interior}`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {direccion.colonia}, CP {direccion.codigo_postal}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {direccion.ciudad}, {direccion.estado}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Tel: {direccion.telefono}
                      </p>
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </div>

        {selectedId && !direcciones.find((d) => d.id_direccion === selectedId)?.es_predeterminada && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={async () => {
              try {
                await setDefault.mutateAsync(selectedId);
                toast({
                  title: "Dirección actualizada",
                  description: "Se estableció como dirección predeterminada",
                });
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.message,
                  variant: "destructive",
                });
              }
            }}
            className="w-full"
          >
            Establecer como predeterminada
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
