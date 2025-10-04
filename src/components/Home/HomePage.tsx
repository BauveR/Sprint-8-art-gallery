import { useObras } from "../../query/obras";
import { useTiendas } from "../../query/tiendas";
import { useExpos } from "../../query/expos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Store, Calendar } from "lucide-react";

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

  return (
    <div className="px-4 md:px-[5%] py-6 space-y-8">
      {/* Logo Section */}
      <div className="flex justify-center pt-2.5 pb-1 md:pt-5 md:pb-7">
        <img
          src="/piedra-arte-02.svg"
          alt="Art Gallery Logo"
          className="w-[30rem] h-[30rem] md:w-[44rem] md:h-[44rem]"
        />
      </div>

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

      {/* Quick Access */}
      <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
        <CardHeader>
          <CardTitle>Acceso Rápido</CardTitle>
          <CardDescription>Gestiona tu galería desde las pestañas superiores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => onNavigate("obras")}
            >
              <Package className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Obras</h3>
              <p className="text-sm text-muted-foreground">
                Añade y gestiona las obras de arte de tu colección
              </p>
            </div>
            <div
              className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => onNavigate("tiendas")}
            >
              <Store className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Tiendas</h3>
              <p className="text-sm text-muted-foreground">
                Administra las ubicaciones físicas de tus tiendas
              </p>
            </div>
            <div
              className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => onNavigate("expos")}
            >
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Exposiciones</h3>
              <p className="text-sm text-muted-foreground">
                Organiza y programa eventos de exposiciones
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
