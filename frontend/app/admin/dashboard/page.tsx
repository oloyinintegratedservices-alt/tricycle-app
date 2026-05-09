"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomersChart } from "@/components/CustomersChart";
import { OrdersChart } from "@/components/OrdersChart";
import RecentOrders from "@/components/RecentOrders";
import axios from "axios";
import { Order } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartAreaIcon, DollarSign, ListOrdered, Caravan } from "lucide-react";

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/admin`,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
  });

  console.log(data);

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`,
        {
          withCredentials: true,
        },
      );

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
      <div className="md:grid grid-cols-4 gap-8 mt-4">
        <div className="p-4 bg-primary rounded-md text-white flex gap-x-4 ">
          <div className="flex justify-center items-center w-9 h-9 bg-white rounded-md text-primary p-2">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div className="m-0">
            <h3 className="m-0">Total Customers</h3>
            <span className="text-lg font-semibold">
              {data?.totalCustomers ?? 0}
            </span>
          </div>
        </div>
        <div className="p-4 bg-blue-950  rounded-md text-white flex gap-x-4 ">
          <div className="flex justify-center items-center w-9 h-9 bg-white rounded-md text-green-800 p-2">
            <Caravan className="w-4 h-4" />
          </div>
          <div className="m-0">
            <h3 className="m-0">Total Tricycles</h3>
            <span className="text-lg font-semibold">
              {data?.totalTricycles ?? 0}
            </span>
          </div>
        </div>
        <div className="p-4 bg-green-800 rounded-md text-white flex gap-x-4 ">
          <div className="flex justify-center items-center w-9 h-9 bg-white rounded-md text-blue-950 p-2">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="m-0">
            <h3 className="m-0">Total Orders</h3>
            <span className="text-lg font-semibold">
              {data?.totalOrders ?? 0}
            </span>
          </div>
        </div>
        <div className="p-4 bg-blue-500 rounded-md text-white flex gap-x-4 ">
          <div className="flex justify-center items-center w-9 h-9 bg-white rounded-md text-green-800 p-2">
            <ChartAreaIcon className="w-4 h-4" />
          </div>
          <div className="m-0">
            <h3 className="m-0">Total Investments</h3>
            <span className="text-lg font-semibold">
              {" "}
              {data?.totalInvestments ?? 0}
            </span>
          </div>
        </div>
      </div>
      <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomersChart
          data={data?.customersPerDay?.map(({ date, count }: any) => ({
            date,
            customer: count,
          }))}
        />
        <OrdersChart
          data={data?.ordersPerDay?.map(({ date, count }: any) => ({
            date,
            order: count,
          }))}
        />
      </div>
      {/* Recents Orders */}

      <RecentOrders orders={data?.recentOrders as Order[]} />

      {/* Top Investors */}
    </div>
  );
};

export default AdminDashboard;
