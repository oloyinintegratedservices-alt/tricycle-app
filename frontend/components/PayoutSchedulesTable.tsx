"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import EditPayoutSchedule from "./EditPayoutSchedule";
import PayoutHistory from "./PayoutHistory";

export type PayoutSchedule = {
  id: string;
  installmentNumber: string;
};

export const columns: ColumnDef<PayoutSchedule>[] = [
  {
    accessorKey: "installmentNumber",
    header: "Breakdown",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const date = row.getValue("startDate") as string;
      const formatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });
      const formatted = formatter.format(new Date(date));

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "End Date",
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as string;
      const formatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });
      const formatted = formatter.format(new Date(date));

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },

  {
    accessorKey: "amountDue",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountDue"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <EditPayoutSchedule payoutschedule={row.original} />
          <PayoutHistory payoutschedule={row.original} />
        </div>
      );
    },
  },
];

const PayoutSchedule = ({ investment }: { investment: any }) => {
  const { data } = useQuery({
    queryKey: ["payoutschedules"],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3002/api/investment/${investment.id}/payoutschedules`,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Payout Schedule </h2>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
};

export default PayoutSchedule;
