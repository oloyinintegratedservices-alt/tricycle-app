"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import axios from "axios";
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

export type RepaymentSchedule = {
  id: string;
  installmentNumber: string;
};

export const columns: ColumnDef<RepaymentSchedule>[] = [
  {
    accessorKey: "payoutSchedule.installmentNumber",
    header: "Month",
  },
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

const PayoutHistory = ({ payoutschedule }: { payoutschedule: any }) => {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["payouts"],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3002/api/investment/schedule/${payoutschedule.id}/payouts`,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
  });

  console.log("87", data);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 w-8 flex justify-center items-center rounded-md p-0 border-2 border-gray-200">
        <Eye className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="min-w-[60vw] no-scrollbar max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment History</DialogTitle>
        </DialogHeader>

        <DataTable
          columns={columns}
          data={
            data?.sort(
              (a: any, b: any) =>
                b.payoutSchedule.installmentNumber -
                a.payoutSchedule.installmentNumber,
            ) ?? []
          }
        />

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            variant="destructive"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayoutHistory;
