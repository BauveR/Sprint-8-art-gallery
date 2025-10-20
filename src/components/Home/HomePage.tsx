import { useObras } from "../../query/obras";
import { useTiendas } from "../../query/tiendas";
import { useExpos } from "../../query/expos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Store, Calendar } from "lucide-react";
import Model3DGallery from "../Admin/Model3DGallery";

type Tab = "admin" | "obras" | "tiendas" | "expos";

interface HomePageProps {
  onNavigate: (tab: Tab) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: obrasData } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 10 });
  const { data: tiendas = [] } = useTiendas();
  const { data: expos = [] } = useExpos();

  const totalObras = obrasData?.total ?? 0;
  const totalTiendas = tiendas.length;
  const totalExpos = expos.length;

  const obrasDisponibles = obrasData?.data.filter(o => o.estado_venta === "disponible").length ?? 0;
  const obrasVendidas = obrasData?.data.filter(o => ["enviado", "entregado"].includes(o.estado_venta)).length ?? 0;

  // Modelos 3D para mostrar
  const models = [
    {
      path: "https://res.cloudinary.com/dmweipuof/image/upload/v1760910351/Bound_Stones_compressed_myawsg.glb",
      name: "Bound Stones"
    },
    {
      path: "https://res.cloudinary.com/dmweipuof/image/upload/v1760910360/Balancing_Act_compressed_kgwxnz.glb",
      name: "Balancing Act"
    },
    {
      path: "https://res.cloudinary.com/dmweipuof/image/upload/v1760910655/Screenshot_final_j6nnfu.glb",
      name: "Pebble Art"
    }
  ];

  return (
    <div className="px-4 md:px-[5%] py-6 space-y-8">
      {/* 3D Models Gallery */}
      <Model3DGallery models={models} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => onNavigate("obras")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obras Totales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObras}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {obrasDisponibles} disponibles • {obrasVendidas} vendidas
            </p>
          </CardContent>
        </Card>

        <Card
          className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => onNavigate("tiendas")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiendas</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTiendas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ubicaciones activas
            </p>
          </CardContent>
        </Card>

        <Card
          className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => onNavigate("expos")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exposiciones</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Eventos programados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
