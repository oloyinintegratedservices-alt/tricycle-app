"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import Investment from "@/components/Investment";
import EditInvestment from "@/components/EditInvestment";
import DeleteInvestment from "@/components/DeleteInvestment";

export type Investment = {
  id: string;
  brand: string;
  chasisNumber: string;
  engineNumber: string;
  color: string;
  fullname: string;
  salesPrice: number;
};

export const columns: ColumnDef<Investment>[] = [
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
    header: "Customer",
  },
  {
    accessorKey: "investedAmount",
    header: () => <div className="text-left">Total Invested Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("investedAmount"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "expectedReturn",
    header: () => <div className="text-left">Total Expected Return</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("expectedReturn"));
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
          <Investment investment={row.original} />
          {/* <EditInvestment investment={row.original} />
          <DeleteInvestment investment={row.original} /> */}
        </div>
      );
    },
  },
];

const Page = () => {
  const { data } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/investment`,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Investments</h2>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
};

export default Page;
