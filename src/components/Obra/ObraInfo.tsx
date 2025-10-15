import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Obra } from "../../types";
import { motion } from "framer-motion";

interface ObraInfoProps {
  obra: Obra;
  isAvailable: boolean;
}

export default function ObraInfo({ obra, isAvailable }: ObraInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold">{obra.titulo}</h1>
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Disponible" : "No disponible"}
          </Badge>
        </div>
        <p className="text-2xl text-muted-foreground">{obra.autor}</p>
      </div>

      <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Detalles</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {obra.anio && (
              <div>
                <span className="text-muted-foreground">Año:</span>
                <p className="font-medium">{obra.anio}</p>
              </div>
            )}
            {obra.tecnica && (
              <div>
                <span className="text-muted-foreground">Técnica:</span>
                <p className="font-medium">{obra.tecnica}</p>
              </div>
            )}
            {obra.medidas && (
              <div>
                <span className="text-muted-foreground">Medidas:</span>
                <p className="font-medium">{obra.medidas}</p>
              </div>
            )}
            {obra.ubicacion && (
              <div>
                <span className="text-muted-foreground">Ubicación:</span>
                <p className="font-medium capitalize">
                  {obra.ubicacion === "en_exposicion" && "En exposición"}
                  {obra.ubicacion === "en_tienda" && "En tienda"}
                  {obra.ubicacion === "almacen" && "Almacén"}
                </p>
              </div>
            )}
            {obra.tienda_nombre && (
              <div>
                <span className="text-muted-foreground">Tienda:</span>
                <p className="font-medium">{obra.tienda_nombre}</p>
              </div>
            )}
            {obra.expo_nombre && (
              <div>
                <span className="text-muted-foreground">Exposición:</span>
                <p className="font-medium">{obra.expo_nombre}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
