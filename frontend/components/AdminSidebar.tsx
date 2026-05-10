"use client";

import Link from "next/link";
import DashboardMenu from "./DashboardMenu";
import {
  User2Icon,
  LayoutGrid,
  Caravan,
  CirclePlus,
  User,
  ChartCandlestick,
  BriefcaseBusiness,
  BadgeDollarSign,
  SquarePercent,
  LogOut,
  UserRoundPlus,
  UserRoundPlusIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const AdminSidebar = ({ closeSidebar }: { closeSidebar?: () => void }) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);

      localStorage.clear();

      router.replace("/");
    },
  });

  return (
    <div className="w-64 h-full overflow-y-auto border-r bg-white pb-4">
      <div className="p-4 border-b-2">Oloyin Integrated Services</div>
      <DashboardMenu
        menu={{
          title: "Main",
          children: [
            {
              name: "Dashboard",
              icon: LayoutGrid,
              href: "/admin/dashboard",
            },
          ],
        }}
      />
      <DashboardMenu
        menu={{
          title: "Tricycles",
          children: [
            {
              name: "All Tricyles",
              icon: Caravan,
              href: "/admin/dashboard/tricycle",
            },
            {
              name: "Add Tricycle",
              icon: CirclePlus,
              href: "/admin/dashboard/tricycle/add",
            },
          ],
        }}
      />
      <DashboardMenu
        menu={{
          title: "People",
          children: [
            {
              name: "Staffs",
              icon: User2Icon,
              href: "/admin/dashboard/staff",
            },
            {
              name: "Add Staff",
              icon: UserRoundPlus,
              href: "/admin/dashboard/staff/add",
            },
            {
              name: "Users",
              icon: User,
              href: "/admin/dashboard/user",
            },
            {
              name: "Add User",
              icon: UserRoundPlusIcon,
              href: "/admin/dashboard/user/add",
            },
          ],
        }}
      />
      <DashboardMenu
        menu={{
          title: "Hire Purchase",
          children: [
            {
              name: "All Orders",
              icon: BadgeDollarSign,
              href: "/admin/dashboard/hirepurchase",
            },
            {
              name: "New Order",
              icon: SquarePercent,
              href: "/admin/dashboard/hirepurchase/add",
            },
          ],
        }}
      />
      <DashboardMenu
        menu={{
          title: "Orders",
          children: [
            {
              name: "All Orders",
              icon: BadgeDollarSign,
              href: "/admin/dashboard/order",
            },
            {
              name: "New Order",
              icon: SquarePercent,
              href: "/admin/dashboard/order/add",
            },
          ],
        }}
      />
      <DashboardMenu
        menu={{
          title: "Investments",
          children: [
            {
              name: "All Investments",
              icon: ChartCandlestick,
              href: "/admin/dashboard/investment",
            },
            {
              name: "New Investment",
              icon: BriefcaseBusiness,
              href: "/admin/dashboard/investment/add",
            },
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

export default AdminSidebar;
