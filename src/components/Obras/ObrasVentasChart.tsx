import { useMemo, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Obra } from "../../types";

interface Props {
  obras: Obra[];
}

export default function ObrasVentasChart({ obras }: Props) {
  const [colors, setColors] = useState({
    chart1: "#000",
    chart2: "#000",
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
    // Simulamos datos de ventas mensuales
    // En producción, esto vendría de un endpoint con datos históricos reales
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const ventasPorEstado = obras.reduce((acc, obra) => {
      const estado = obra.estado_venta;
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generar datos simulados para los últimos 6 meses
    const mesActual = new Date().getMonth();

    return Array.from({ length: 6 }, (_, i) => {
      const mesIndex = (mesActual - 5 + i + 12) % 12;
      const mes = meses[mesIndex];

      // Simular ventas con alguna variación
      const baseVentas = ventasPorEstado.entregado || 0;
      const variation = Math.floor(Math.random() * (baseVentas / 2 + 1));

      return {
        mes,
        ventas: Math.max(0, Math.floor(baseVentas / 6) + variation),
        entregas: Math.max(0, Math.floor((ventasPorEstado.enviado || 0) / 6) + Math.floor(Math.random() * 3)),
      };
    });
  }, [obras]);

  const chartConfig = {
    ventas: {
      label: "Ventas",
      color: colors.chart1,
    },
    entregas: {
      label: "Entregas",
      color: colors.chart2,
    },
  };

  const totalVentas = data.reduce((sum, item) => sum + item.ventas, 0);
  const totalEntregas = data.reduce((sum, item) => sum + item.entregas, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas Mensuales</CardTitle>
        <CardDescription>
          Últimos 6 meses • Total: {totalVentas} ventas, {totalEntregas} entregas
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full bg-background/50 rounded-lg">
          <AreaChart data={data} width={500} height={300}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.chart1} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors.chart1} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorEntregas" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#colorVentas)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="entregas"
              stroke={colors.chart2}
              fillOpacity={1}
              fill="url(#colorEntregas)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
