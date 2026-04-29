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

const Staff = ({ staff }: { staff: any }) => {
  const [open, setOpen] = useState(false);

  const date = staff.createdAt;
  const formatter = new Intl.DateTimeFormat("en-US");
  const formatted = formatter.format(new Date(date));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 w-8 flex justify-center items-center rounded-md p-0 border-2 border-gray-200">
        <Eye className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
        </DialogHeader>
        <div>Full Name: {staff.fullname}</div>
        <div>Email: {staff.email}</div>
        <div>Phone Number: {staff.phone}</div>
        <div>Joined: {formatted}</div>

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

export default Staff;
