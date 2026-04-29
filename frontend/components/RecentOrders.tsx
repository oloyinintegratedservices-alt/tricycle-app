"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Order } from "@/types";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "tricycle.model",
    header: "Brand",
  },
  {
    accessorKey: "tricycle.chasisNumber",
    header: "Chasis Number",
  },
  {
    accessorKey: "tricycle.engineNumber",
    header: "Engine Number",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "user.fullname",
    header: "Customer",
  },
  {
    accessorKey: "orderType",
    header: "Order Type",
  },
  {
    accessorKey: "totalPrice",
    header: "Amount",
    cell: ({ row }) => {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(row.getValue("totalPrice") as number);
    },
  },
];

const RecentOrders = ({ orders }: { orders: Order[] }) => {
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <h2 className="my-4 mx-2 font-bold">Recent Orders</h2>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentOrders;
