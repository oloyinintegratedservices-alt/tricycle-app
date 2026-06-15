"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type Payout = {
  id: string;
};

export const columns: ColumnDef<Payout>[] = [
  {
    accessorKey: "payoutDate",
    header: "Payment Date",
    cell: ({ row }) => {
      const date = row.getValue("payoutDate") as string;
      const formatter = new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "medium",
      });
      const formatted = formatter.format(new Date(date));

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },

  {
    accessorKey: "amount",
    header: "Amount Paid",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "method",
    header: "Method",
  },
];

const InvestmentPayoutHistory = ({ investment }: { investment: any }) => {
  const { data } = useQuery({
    queryKey: ["investmentpayouts", [investment.id]],
    queryFn: async () => {
      const res = await axios.get(`/api/investment/${investment.id}/payouts`);

      return res.data;
    },
  });

  return (
    <>
      <h2 className="text-2xl font-bold">Payout History</h2>
      <DataTable columns={columns} data={data ?? []} />
    </>
  );
};

export default InvestmentPayoutHistory;
