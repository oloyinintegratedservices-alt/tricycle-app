"use client";

import DashboardMenu from "./DashboardMenu";
import { LayoutGrid, Caravan, ChartCandlestick, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const UserSidebar = ({ closeSidebar }: { closeSidebar?: () => void }) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        "http://localhost:3002/api/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);

      router.replace("/");
    },
  });

  return (
    <div className="w-64 h-full overflow-y-auto border-r bg-white">
      <div className="p-4 border-b-2">Oloyin Integrated Services</div>
      <DashboardMenu
        menu={{
          title: "Main",
          children: [
            {
              name: "Dashboard",
              icon: LayoutGrid,
              href: "/user/dashboard",
            },
          ],
        }}
      />
      <DashboardMenu
        menu={{
          title: "My Investments",
          children: [
            {
              name: "Payouts History",
              icon: Caravan,
              href: "/user/dashboard/payments",
            },
            // {
            //   name: "Orders",
            //   icon: Caravan,
            //   href: "/user/dashboard/order",
            // },
            // {
            //   name: "Investments",
            //   icon: ChartCandlestick,
            //   href: "/user/dashboard/investment",
            // },
          ],
        }}
      />

      <div className="mt-4">
        <Button
          onClick={() => {
            mutation.mutate();
          }}
          variant="destructive"
          className="mx-4 space-x-2 cursor-pointer"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserSidebar;
