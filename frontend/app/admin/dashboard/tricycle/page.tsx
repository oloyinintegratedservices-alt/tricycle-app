"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Tricycle from "@/components/Tricycle";
import DeleteTricycle from "@/components/DeleteTricycle";
import EditTricycle from "@/components/EditTricycle";

export type Tricycle = {
  id: string;
  brand: string;
  chasisNumber: string;
  engineNumber: string;
  color: string;
  purchasePrice: number;
  salesPrice: number;
};

export const columns: ColumnDef<Tricycle>[] = [
  {
    accessorKey: "model",
    header: "Brand",
  },
  {
    accessorKey: "chasisNumber",
    header: "Chasis Number",
  },
  {
    accessorKey: "engineNumber",
    header: "Engine Number",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "purchasePrice",
    header: () => <div className="text-left">Purchase Price(₦)</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("purchasePrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "salePrice",
    header: () => <div className="text-left">Sales Price(₦)</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("salePrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Tricycle tricycle={row.original} />
          <EditTricycle tricycle={row.original} />
          <DeleteTricycle tricycle={row.original} />
        </div>
      );
    },
  },
];

const Page = () => {
  const { data } = useQuery({
    queryKey: ["tricycles"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3002/api/tricycle", {
        withCredentials: true,
      });

      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Tricyles</h2>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
};

export default Page;
