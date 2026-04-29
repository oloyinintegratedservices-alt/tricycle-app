import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

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
  customer: {
    label: "New Customer",
  },
} satisfies ChartConfig;

export function CustomersChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>New Customers</CardHeader>
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
            <Bar dataKey="customer" fill="#2563eb" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
