"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";

import { Trash } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "@/lib/axios";

const DeleteStaff = ({ staff }: { staff: any }) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/api/user/${staff.id}`);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Staff has been deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 w-8 flex justify-center items-center rounded-md p-0 border-2 border-gray-200">
        <Trash className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Are you absolutely sure to delete this staff data ?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the staff
            and remove data from servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="destructive">
            Close
          </Button>
          <Button
            type="button"
            className="px-10"
            onClick={() => mutation.mutate()}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStaff;
