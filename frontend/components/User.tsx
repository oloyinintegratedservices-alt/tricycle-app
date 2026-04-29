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

const User = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);

  const date = user.createdAt;
  const formatter = new Intl.DateTimeFormat("en-US");
  const formatted = formatter.format(new Date(date));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 w-8 flex justify-center items-center rounded-md p-0 border-2 border-gray-200">
        <Eye className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        <div>Full Name: {user.fullname}</div>
        <div>Email: {user.email}</div>
        <div>Phone Number: {user.phone}</div>
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

export default User;
