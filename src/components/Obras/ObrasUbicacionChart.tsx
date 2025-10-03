import { useMemo, useEffect, useState } from "react";
import { Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Obra } from "../../types";

const LABELS = {
  en_exposicion: "En Exposición",
  en_tienda: "En Tienda",
  almacen: "Almacén",
};

interface Props {
  obras: Obra[];
}

export default function ObrasUbicacionChart({ obras }: Props) {
  const [colors, setColors] = useState({
    en_exposicion: "#000",
    en_tienda: "#000",
    almacen: "#000",
  });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      setColors({
        en_exposicion: computedStyle.getPropertyValue('--chart-1').trim(),
        en_tienda: computedStyle.getPropertyValue('--chart-2').trim(),
        almacen: computedStyle.getPropertyValue('--chart-3').trim(),
      });
    };

    updateColors();

    // Observar cambios en la clase dark
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

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
      color: colors.en_exposicion,
    },
    en_tienda: {
      label: "En Tienda",
      color: colors.en_tienda,
    },
    almacen: {
      label: "Almacén",
      color: colors.almacen,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Obras</CardTitle>
        <CardDescription>Por ubicación física</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full bg-background/50 rounded-lg">
          <PieChart width={400} height={300}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={{ fill: 'hsl(var(--foreground))' }}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.ubicacion}
                  fill={colors[entry.ubicacion as keyof typeof colors]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
