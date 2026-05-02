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
    accessorKey: "user.fullname",
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
];

const RecentInvestments = ({ investments }: { investments: Investment[] }) => {
  const table = useReactTable({
    data: investments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <h2 className="my-4 mx-2 font-bold">Recent Investments</h2>
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

export default RecentInvestments;
