"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import User from "@/components/User";
import EditUser from "@/components/EditUser";
import DeleteUser from "@/components/DeleteUser";

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
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`/api/user`);

      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Users</h2>
      <DataTable columns={columns} data={data?.data ?? []} />
    </div>
  );
};

export default Page;
