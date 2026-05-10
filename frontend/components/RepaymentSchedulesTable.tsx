"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import Order from "@/components/Order";
import EditOrder from "@/components/EditOrder";
import DeleteOrder from "@/components/DeleteOrder";
import EditRepaymentSchedule from "./EditRepaymentSchedule";
import PaymentHistory from "./PaymentHistory";

export type RepaymentSchedule = {
  id: string;
  installmentNumber: string;
};

export const columns: ColumnDef<RepaymentSchedule>[] = [
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
      const formatted = new Intl.NumberFormat("en-US", {
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
          <EditRepaymentSchedule repaymentschedule={row.original} />
          <PaymentHistory repaymentschedule={row.original} />
        </div>
      );
    },
  },
];

const RepaymentSchedule = ({ order }: { order: any }) => {
  const { data } = useQuery({
    queryKey: ["repaymentschedules"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/${order.id}/repaymentschedules`,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Repayment Schedule </h2>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
};

export default RepaymentSchedule;
