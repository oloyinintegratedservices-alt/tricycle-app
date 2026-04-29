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

const Tricycle = ({ tricycle }: { tricycle: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 w-8 flex justify-center items-center rounded-md p-0 border-2 border-gray-200">
        <Eye className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tricycle Details</DialogTitle>
        </DialogHeader>
        <div>Brand: {tricycle.model}</div>
        <div>Chasis Number: {tricycle.chasisNumber}</div>
        <div>Engine Number: {tricycle.engineNumber}</div>
        <div>Purchase Price: {tricycle.purchasePrice}</div>
        <div>Sale Price: {tricycle.salePrice}</div>
        <div>Color: {tricycle.color}</div>

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

export default Tricycle;
