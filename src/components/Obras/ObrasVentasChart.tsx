import { useMemo, useEffect, useState, useId } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Obra } from "../../types";

interface Props {
  obras: Obra[];
}

export default function ObrasVentasChart({ obras }: Props) {
  const id = useId();
  const gradientVentasId = `colorVentas-${id}`;
  const gradientEntregasId = `colorEntregas-${id}`;

  const [colors, setColors] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        chart1: "hsl(var(--chart-1))",
        chart2: "hsl(var(--chart-2))",
      };
    }
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return {
      chart1: computedStyle.getPropertyValue('--chart-1').trim(),
      chart2: computedStyle.getPropertyValue('--chart-2').trim(),
    };
  });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      setColors({
        chart1: computedStyle.getPropertyValue('--chart-1').trim(),
        chart2: computedStyle.getPropertyValue('--chart-2').trim(),
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
    const meses = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    // Contar obras según su estado de venta
    const ventasPorEstado = obras.reduce((acc, obra) => {
      const estado = obra.estado_venta;
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mesActual = new Date().getMonth();

    // Ventas completadas = entregado
    const totalVentas = ventasPorEstado.entregado || 0;

    // En proceso = procesando_envio + enviado
    const totalEnProceso = (ventasPorEstado.procesando_envio || 0) + (ventasPorEstado.enviado || 0);

    // Crear array de 6 meses
    const result = Array.from({ length: 6 }, (_, i) => {
      const mesIndex = (mesActual - 5 + i + 12) % 12;
      return {
        mes: meses[mesIndex],
        ventas: 0,
        entregas: 0,
      };
    });

    // Colocar todos los datos en el mes actual (último mes del array)
    if (result.length > 0) {
      result[result.length - 1].ventas = totalVentas;
      result[result.length - 1].entregas = totalEnProceso;
    }

    return result;
  }, [obras]);

  const chartConfig = {
    ventas: {
      label: "Vendidas (Entregadas)",
      color: colors.chart1,
    },
    entregas: {
      label: "En Proceso",
      color: colors.chart2,
    },
  };

  const totalVentas = data.reduce((sum, item) => sum + item.ventas, 0);
  const totalEnProceso = data.reduce((sum, item) => sum + item.entregas, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas Mensuales</CardTitle>
        <CardDescription>
          Últimos 6 meses • {totalVentas} vendidas, {totalEnProceso} en proceso
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full bg-background/50 rounded-lg">
          <AreaChart data={data} width={500} height={200}>
              <defs>
                <linearGradient id={gradientVentasId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.chart1} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors.chart1} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id={gradientEntregasId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.chart2} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors.chart2} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke={colors.chart1}
              fillOpacity={1}
              fill={`url(#${gradientVentasId})`}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="entregas"
              stroke={colors.chart2}
              fillOpacity={1}
              fill={`url(#${gradientEntregasId})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
