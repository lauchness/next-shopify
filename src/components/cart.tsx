"use client";

import { useCart, useRemoveFromCart } from "@/shopify-api/useCart";
import { FC } from "react";
import { CartLine } from "./cart-line";
import formatCurrency from "@/utils/currency";

interface CartProps {
  pagesRouter?: boolean;
}

export const Cart: FC<CartProps> = ({ pagesRouter = false }) => {
  const { data: cart } = useCart();
  const removeItems = useRemoveFromCart(pagesRouter);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full flex-col gap-2">
        {cart?.lines.nodes.map((line) => {
          return (
            <CartLine
              line={line}
              key={line.id}
              removeItem={() => {
                removeItems.mutate({ lineIds: [line.id] });
              }}
              pagesRouter={pagesRouter}
            />
          );
        })}
      </div>

      <div className="flex w-full items-center justify-between text-neutral-20">
        <span className="font-semibold">Total</span>
        <span>
          {formatCurrency(
            cart?.cost.subtotalAmount.amount,
            cart?.cost.subtotalAmount.currencyCode
          )}
        </span>
      </div>

      <a
        href={cart?.checkoutUrl}
        className="self-end border border-neutral-20 w-full py-1 px-2 my-2"
      >
        Checkout on Shopify
      </a>
    </div>
  );
};
