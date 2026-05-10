"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import User from "@/components/User";
import EditUser from "@/components/EditUser";
import DeleteUser from "@/components/DeleteUser";
// import Tricycle from "@/components/Tricycle";
// import DeleteTricycle from "@/components/DeleteTricycle";
// import EditTricycle from "@/components/EditTricycle";

export type User = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  createdAt: string;
};

export const columns: ColumnDef<User>[] = [
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
          <User user={row.original} />
          <EditUser user={row.original} />
          <DeleteUser user={row.original} />
        </div>
      );
    },
  },
];

const Page = () => {
  const { data } = useQuery({
    queryKey: ["staffs"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Customers</h2>
      <DataTable columns={columns} data={data?.data ?? []} />
    </div>
  );
};

export default Page;
