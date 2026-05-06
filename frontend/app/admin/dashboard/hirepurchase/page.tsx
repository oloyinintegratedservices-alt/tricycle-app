"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Order from "@/components/Order";
import EditOrder from "@/components/EditOrder";
import DeleteOrder from "@/components/DeleteOrder";

export type Order = {
  id: string;
  brand: string;
  chasisNumber: string;
  engineNumber: string;
  color: string;
  orderType: string;
  user: string;
  salesPrice: number;
  guarantorName: string;
};

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: "fullname",
    header: "Collector Name",
  },
  {
    accessorKey: "totalPrice",
    header: () => <div className="text-left">Sales Price (₦)</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "downPayment",
    header: () => <div className="text-left">Down Payment (₦)</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("downPayment"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      if (!row.getValue("downPayment"))
        return <div className="text-left font-medium">NGN 0.00</div>;

      return <div className="text-left font-medium">{formatted ?? "-"}</div>;
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
          <Order order={row.original} />
          <EditOrder order={row.original} nameOfQueries="hirepurchaseorders" />
          <DeleteOrder
            order={row.original}
            nameOfQueries="hirepurchaseorders"
          />
        </div>
      );
    },
  },
];

const Page = () => {
  const { data } = useQuery({
    queryKey: ["hirepurchaseorders"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:3002/api/order/hirepurchase",
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
  });

  console.log(data);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Hire Purchase Orders</h2>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
};

export default Page;
