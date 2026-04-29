"use client";
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

import RepaymentSchedule from "./RepaymentSchedulesTable";

const Order = ({ order }: { order: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 w-8 flex justify-center items-center rounded-md p-0 border-2 border-gray-200">
        <Eye className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="min-w-[60vw] no-scrollbar max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div>Brand: {order.model}</div>
        <div>Chasis Number: {order.chasisNumber}</div>
        <div>Engine Number: {order.engineNumber}</div>
        <div>Purchase Price: {order.purchasePrice}</div>
        <div>Sale Price: {order.salePrice}</div>
        <div>Color: {order.color}</div>
        <div>Customer: {order.fullname}</div>
        <div>Order Status: {order.status}</div>
        {order.orderType == "HIRE_PURCHASE" && (
          <RepaymentSchedule order={order} />
        )}

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

export default Order;
