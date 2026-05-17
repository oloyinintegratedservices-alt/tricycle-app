"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type PayoutSchedule = {
  id: string;
  installmentNumber: string;
};

export const columns: ColumnDef<PayoutSchedule>[] = [
  // {
  //   accessorKey: "payoutSchedule.installmentNumber",
  //   header: "Month",
  // },
  {
    accessorKey: "payoutDate",
    header: "Payout Date",
    cell: ({ row }) => {
      const date = row.getValue("payoutDate") as string;
      const formatter = new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      });
      const formatted = formatter.format(new Date(date));

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //   },

  //   {
  //     id: "actions",
  //     header: "Actions",
  //     cell: ({ row }) => {
  //       return <div className="flex gap-2"></div>;
  //     },
  //   },
];

const Page = () => {
  const { data } = useQuery({
    queryKey: ["payouts"],
    queryFn: async () => {
      const res = await axios.get(`/api/user/payouts`);

      return res.data;
    },
  });

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-3xl font-bold">Payouts History</h2>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
};

export default Page;
