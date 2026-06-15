"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";

import { Eye } from "lucide-react";

export type Payment = {
  id: string;
  //   installmentNumber: string;
};

export const columns: ColumnDef<Payment>[] = [
  //   {
  //     accessorKey: "schedule.installmentNumber",
  //     header: "Week",
  //   },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ row }) => {
      const date = row.getValue("paymentDate") as string;
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

const HirePurchasePaymentHistory = ({ order }: { order: any }) => {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["hirepurchasepayments", order.id],
    queryFn: async () => {
      const res = await axios.get(`/api/order/${order.id}/payments`);

      return res.data;
    },
  });

  return (
    <>
      <h2 className="text-2xl font-bold">Payment History</h2>
      <DataTable columns={columns} data={data ?? []} />
    </>
  );
};

export default HirePurchasePaymentHistory;
