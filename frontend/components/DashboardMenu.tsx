"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type DashboardMenuProps = {
  menu: {
    title: string;
    children?: {
      name: string;
      icon: React.ElementType;
      href: string;
    }[];
  };
};

const DashboardMenu = ({ menu }: DashboardMenuProps) => {
  const pathname = usePathname();

  return (
    <div className="border-b-2 py-4 mx-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
        {menu.title}
      </h3>
      {menu.children?.map((item, id) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={id}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
              isActive
                ? "bg-[#FFF6EE] text-[#FE9F43]"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default DashboardMenu;
