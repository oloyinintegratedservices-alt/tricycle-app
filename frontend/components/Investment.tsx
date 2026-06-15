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

import PayoutSchedule from "./PayoutSchedulesTable";
import InvestmentPayoutHistory from "./InvestmentPayoutHistory";

const Investment = ({ investment }: { investment: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 w-8 flex justify-center items-center rounded-md p-0 border-2 border-gray-200">
        <Eye className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="min-w-[60vw] no-scrollbar max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Investment Details</DialogTitle>
        </DialogHeader>
        <div>Brand: {investment.model}</div>
        <div>Chasis Number: {investment.chasisNumber}</div>
        <div>Engine Number: {investment.engineNumber}</div>
        <div>
          Purchase Price:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "NGN",
          }).format(investment.investedAmount)}
        </div>
        <div>
          Sale Price:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "NGN",
          }).format(investment.expectedReturn)}
        </div>
        <div>Color: {investment.color}</div>
        <div>Customer: {investment.fullname}</div>
        <div>Investment Status: {investment.status}</div>
        {/* <PayoutSchedule investment={investment} /> */}
        <InvestmentPayoutHistory investment={investment} />

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

export default Investment;
