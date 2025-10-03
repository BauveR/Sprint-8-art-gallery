import { useMemo } from "react";
import { Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Obra } from "../../types";

const COLORS = {
  en_exposicion: "hsl(var(--chart-1))",
  en_tienda: "hsl(var(--chart-2))",
  almacen: "hsl(var(--chart-3))",
};

const LABELS = {
  en_exposicion: "En Exposición",
  en_tienda: "En Tienda",
  almacen: "Almacén",
};

interface Props {
  obras: Obra[];
}

export default function ObrasUbicacionChart({ obras }: Props) {
  const data = useMemo(() => {
    const counts = obras.reduce((acc, obra) => {
      const ubicacion = obra.ubicacion ?? "almacen";
      acc[ubicacion] = (acc[ubicacion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([ubicacion, count]) => ({
      name: LABELS[ubicacion as keyof typeof LABELS] || ubicacion,
      value: count,
      ubicacion,
    }));
  }, [obras]);

  const chartConfig = {
    value: {
      label: "Obras",
    },
    en_exposicion: {
      label: "En Exposición",
      color: COLORS.en_exposicion,
    },
    en_tienda: {
      label: "En Tienda",
      color: COLORS.en_tienda,
    },
    almacen: {
      label: "Almacén",
      color: COLORS.almacen,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Obras</CardTitle>
        <CardDescription>Por ubicación física</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart width={400} height={300}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry) => (
                <Cell
                  key={entry.ubicacion}
                  fill={COLORS[entry.ubicacion as keyof typeof COLORS]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
