import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import { Card, CardContent, CardHeader } from "./ui/card";

const chartConfig = {
  order: {
    label: "New Order",
  },
} satisfies ChartConfig;

export function OrdersChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>New orders</CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-50 w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })
              }
            />
            <Tooltip
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="order" fill="#2563eb" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
