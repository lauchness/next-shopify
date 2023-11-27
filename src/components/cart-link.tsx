"use client";

import { useCart } from "@/shopify-api/useCart";
import Link from "next/link";
import { FC } from "react";

interface CartLinkProps {
  pagesRouter?: boolean;
}

export const CartLink: FC<CartLinkProps> = ({ pagesRouter }) => {
  const { data } = useCart();

  return (
    <Link
      className="text-lg relative flex items-center gap-1.5"
      href={pagesRouter ? "/pages-router/cart" : "/cart"}
    >
      Cart
      <span className="bg-white text-black rounded-full h-5 min-w-[20px] text-sm flex items-center justify-center">
        {data?.totalQuantity}
      </span>
    </Link>
  );
};
