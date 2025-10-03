import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tienda, Expo } from "../../types";

interface LocationsMapProps {
  tiendas: Tienda[];
  expos: Expo[];
}

// Iconos personalizados para tiendas y exposiciones
const tiendaIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const expoIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LocationsMap({ tiendas, expos }: LocationsMapProps) {
  // Calcular el centro del mapa basado en todas las ubicaciones
  const center = useMemo(() => {
    const allLocations = [
      ...tiendas.map(t => ({ lat: t.lat, lng: t.lng })),
      ...expos.map(e => ({ lat: e.lat, lng: e.lng }))
    ];

    if (allLocations.length === 0) {
      // Centro por defecto (España)
      return { lat: 40.4168, lng: -3.7038 };
    }

    const avgLat = allLocations.reduce((sum, loc) => sum + loc.lat, 0) / allLocations.length;
    const avgLng = allLocations.reduce((sum, loc) => sum + loc.lng, 0) / allLocations.length;

    return { lat: avgLat, lng: avgLng };
  }, [tiendas, expos]);

  const totalLocations = tiendas.length + expos.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Ubicaciones</CardTitle>
        <CardDescription>
          {tiendas.length} tiendas • {expos.length} exposiciones
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] w-full rounded-b-xl overflow-hidden">
          {totalLocations > 0 ? (
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Marcadores de tiendas */}
              {tiendas.map((tienda) => (
                <Marker
                  key={`tienda-${tienda.id_tienda}`}
                  position={[tienda.lat, tienda.lng]}
                  icon={tiendaIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="text-blue-600">🏪 Tienda</strong>
                      <p className="font-semibold">{tienda.nombre}</p>
                      <p className="text-xs text-gray-500">
                        {tienda.lat.toFixed(4)}, {tienda.lng.toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Marcadores de exposiciones */}
              {expos.map((expo) => (
                <Marker
                  key={`expo-${expo.id_expo}`}
                  position={[expo.lat, expo.lng]}
                  icon={expoIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="text-red-600">🎨 Exposición</strong>
                      <p className="font-semibold">{expo.nombre}</p>
                      <p className="text-xs text-gray-500">
                        {expo.fecha_inicio} → {expo.fecha_fin}
                      </p>
                      <p className="text-xs text-gray-500">
                        {expo.lat.toFixed(4)}, {expo.lng.toFixed(4)}
                      </p>
                      {expo.url_expo && (
                        <a
                          href={expo.url_expo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 underline"
                        >
                          Ver más
                        </a>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <p className="text-gray-500 text-sm">Sin ubicaciones para mostrar</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
