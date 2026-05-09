"use client";

import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Order from "@/components/Order";
import EditOrder from "@/components/EditOrder";
import DeleteOrder from "@/components/DeleteOrder";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

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
  startDate: Date;
  paymentDay: string;
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
    accessorKey: "paymentDay",
    header: "Payment Day",
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const { data } = useQuery({
    queryKey: ["hirepurchaseorders"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/order/hirepurchase`,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Hire Purchase Orders</h2>

      <div className="overflow-hidden rounded-md border">
        <div className="flex items-center py-4 ml-2">
          <Select
            value={
              (table.getColumn("paymentDay")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) => {
              table.getColumn("paymentDay")?.setFilterValue(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select weekday" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Weekday</SelectLabel>
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Tuesday">Tuesday</SelectItem>
                <SelectItem value="Wednesday">Wednesday</SelectItem>
                <SelectItem value="Thursday">Thursday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Saturday">Saturday</SelectItem>
                <SelectItem value="Sunday">Sunday</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Page;
