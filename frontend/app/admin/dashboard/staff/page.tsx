"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import Staff from "@/components/Staff";
import EditStaff from "@/components/EditStaff";
import DeleteStaff from "@/components/DeleteStaff";

export type Staff = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  createdAt: string;
};

export const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "fullname",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-left">Joined</div>,
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      const formatter = new Intl.DateTimeFormat("en-US");
      const formatted = formatter.format(new Date(date));

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Staff staff={row.original} />
          <EditStaff staff={row.original} />
          <DeleteStaff staff={row.original} />
        </div>
      );
    },
  },
];

const Page = () => {
  const { data } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axios.get(`/api/user/staff`);

      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Staffs</h2>
      <DataTable columns={columns} data={data?.data ?? []} />
    </div>
  );
};

export default Page;
