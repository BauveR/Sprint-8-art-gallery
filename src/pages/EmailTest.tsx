import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendShipmentNotification } from "@/config/emailjs";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";

export default function EmailTest() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [orderNumber, setOrderNumber] = useState("TEST-001");
  const [trackingNumber, setTrackingNumber] = useState("1234567890");
  const [carrier, setCarrier] = useState("FedEx");
  const [trackingLink, setTrackingLink] = useState("https://www.fedex.com/fedextrack/?tracknumbers=1234567890");

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendTest = async () => {
    if (!email || !name) {
      setResult({
        success: false,
        message: "Por favor completa el email y nombre",
      });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      console.log("🧪 Iniciando test de envío de email...");

      const response = await sendShipmentNotification({
        to_email: email,
        to_name: name,
        order_id: orderNumber,
        tracking_number: trackingNumber,
        carrier: carrier,
        tracking_link: trackingLink,
        items: [
          { titulo: "Obra de Arte de Prueba 1" },
          { titulo: "Obra de Arte de Prueba 2" },
        ],
      });

      console.log("✅ Respuesta de EmailJS:", response);

      setResult({
        success: true,
        message: `Email enviado exitosamente. Status: ${response.status}, Text: ${response.text}`,
      });
    } catch (error: any) {
      console.error("❌ Error en test de email:", error);

      setResult({
        success: false,
        message: `Error: ${error?.message || error?.text || "Error desconocido"}. Status: ${error?.status || "N/A"}`,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Herramienta de Diagnóstico de EmailJS</CardTitle>
          <p className="text-sm text-gray-600">
            Prueba el envío de correos de notificación de envío
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email del destinatario</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@ejemplo.com"
            />
          </div>

          <div>
            <Label htmlFor="name">Nombre del destinatario</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <Label htmlFor="orderNumber">Número de orden</Label>
            <Input
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ORD-2024-001"
            />
          </div>

          <div>
            <Label htmlFor="carrier">Paquetería</Label>
            <Input
              id="carrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="FedEx, DHL, Estafeta..."
            />
          </div>

          <div>
            <Label htmlFor="trackingNumber">Número de rastreo</Label>
            <Input
              id="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="1234567890"
            />
          </div>

          <div>
            <Label htmlFor="trackingLink">Link de seguimiento</Label>
            <Input
              id="trackingLink"
              type="url"
              value={trackingLink}
              onChange={(e) => setTrackingLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <Button
            onClick={handleSendTest}
            disabled={sending || !email || !name}
            className="w-full"
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Email de Prueba"
            )}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.success
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <p
                  className={`text-sm ${
                    result.success
                      ? "text-green-800 dark:text-green-200"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {result.message}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <h3 className="font-semibold mb-2">Instrucciones:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside text-gray-600 dark:text-gray-400">
              <li>Completa el email y nombre del destinatario</li>
              <li>Verifica que los demás campos tengan valores válidos</li>
              <li>Haz clic en "Enviar Email de Prueba"</li>
              <li>Abre la consola del navegador (F12) para ver logs detallados</li>
              <li>Revisa tu bandeja de entrada y carpeta de SPAM</li>
            </ol>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
              Problemas comunes:
            </h3>
            <ul className="text-sm space-y-1 list-disc list-inside text-yellow-700 dark:text-yellow-300">
              <li>El email puede llegar a la carpeta de SPAM</li>
              <li>EmailJS puede tener límite de 200 emails/mes en plan gratuito</li>
              <li>Verifica que el template esté configurado correctamente en EmailJS</li>
              <li>Las variables del template deben coincidir con las del código</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
