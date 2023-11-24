"use client";

import { useCart } from "@/shopify-api/useCart";
import Link from "next/link";
import { FC } from "react";

export const Cart: FC = () => {
  const { data } = useCart();

  return (
    <Link className="text-lg relative my-2" href="/cart">
      Cart
      <span className="relative bg-white text-black rounded-full h-5 min-w-[20px]">
        {data?.totalQuantity}
      </span>
    </Link>
  );
};
