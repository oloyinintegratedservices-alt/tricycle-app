"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Investment } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartAreaIcon, DollarSign, ListOrdered, Caravan } from "lucide-react";
import RecentInvestments from "@/components/RecentInvestments";

const UserDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["userstats"],
    queryFn: async () => {
      const res = await axios.get(`/api/dashboard/user`);

      return res.data;
    },
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get(`/api/auth/me`);

      return res.data;
    },
  });

  if (isLoading || isLoadingUser) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white">
      <h2 className="text-3xl font-bold">
        Welcome {user?.fullname?.split(" ")[0]}
      </h2>
      <div className="md:grid space-y-4 grid-cols-4 gap-8 my-4">
        <div className="p-4 bg-green-800 rounded-md text-white flex gap-x-4 ">
          <div className="flex justify-center items-center w-9 h-9 bg-white rounded-md text-blue-950 p-2">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="m-0">
            <h3 className="m-0">Total Investments</h3>
            <span className="text-2xl font-semibold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(data?.totalInvested)}
            </span>
          </div>
        </div>
        <div className="p-4 bg-blue-500 rounded-md text-white flex gap-x-4 ">
          <div className="flex justify-center items-center w-9 h-9 bg-white rounded-md text-green-800 p-2">
            <ChartAreaIcon className="w-4 h-4" />
          </div>
          <div className="m-0">
            <h3 className="m-0">Total Returns</h3>
            <span className="text-2xl font-semibold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(data?.totalExpected)}
            </span>
          </div>
        </div>
        <div className="p-4 bg-red-900 rounded-md text-white flex gap-x-4 ">
          <div className="flex justify-center items-center w-9 h-9 bg-white rounded-md text-green-800 p-2">
            <ChartAreaIcon className="w-4 h-4" />
          </div>
          <div className="m-0">
            <h3 className="m-0">Total Payouts</h3>
            <span className="text-2xl font-semibold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(data?.totalPayouts)}
            </span>
          </div>
        </div>
        <div className="p-4 bg-blue-500 rounded-md text-white flex gap-x-4 ">
          <div className="flex justify-center items-center w-9 h-9 bg-white rounded-md text-green-800 p-2">
            <ChartAreaIcon className="w-4 h-4" />
          </div>
          <div className="m-0">
            <h3 className="m-0">Total Balance</h3>
            <span className="text-2xl font-semibold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(data?.totalBalance)}
              {/* {data?.totalBalance ?? 0} */}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {/* <RecentOrders orders={data?.recentOrders as Order[]} /> */}

        <RecentInvestments
          investments={data?.recentInvestments as Investment[]}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
