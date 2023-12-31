"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AddToCartMutation,
  RemoveFromCartMutation,
  UpdateCartLinesMutation,
  UpdateCartLinesMutationVariables,
} from "@/graphql/_generated/operations";

import { isCartFragment } from "./cart";
import { CART_QUERY_KEY } from "./config";

export const fetchCart = async (userId: string, pagesRouter?: boolean) => {
  const res = await fetch(
    `${pagesRouter ? "/api/" : ""}/cart${
      pagesRouter ? "" : "/data"
    }?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const json = await res.json();

  const cart = json.data;

  if (!isCartFragment(cart)) {
    throw new Error("Invalid cart data.");
  }

  return cart;
};

export const useCart = (pagesRouter?: boolean) => {
  const userId = ""; // get user ID from your auth system

  return useQuery({
    queryKey: CART_QUERY_KEY(userId),
    queryFn: async ({ queryKey }) => {
      const [, userId] = queryKey;

      return await fetchCart(userId, pagesRouter);
    },
    // Maybe you don't want to get a cart unless you have a user id?
    // enabled: !!userId,
  });
};

export const useAddToCart = (pagesRouter?: boolean) => {
  const queryClient = useQueryClient();
  const userId = ""; // get user ID from your auth system
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const res = await fetch(
        `${pagesRouter ? "/api/" : ""}/cart${pagesRouter ? "/" : "/data/"}add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, quantity }),
        }
      );

      const json = await res.json();

      const cartLinesAdd = json.data as AddToCartMutation["cartLinesAdd"];

      if (!cartLinesAdd || !isCartFragment(cartLinesAdd.cart)) {
        throw new Error("Invalid cart data.");
      }

      if (cartLinesAdd.userErrors.length) {
        const error = cartLinesAdd.userErrors[0];
        throw new Error(error.message);
      }

      return cartLinesAdd.cart;
    },
    onError: (error) => {
      console.error(error);
      // Notify the user if there was an error
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY(userId), cart);
    },
  });
};

export const useRemoveFromCart = (pagesRouter?: boolean) => {
  const queryClient = useQueryClient();
  const userId = ""; // get user ID from your auth system
  return useMutation({
    mutationFn: async ({ lineIds }: { lineIds: string[] }) => {
      const res = await fetch(
        `${pagesRouter ? "/api/" : ""}/cart${
          pagesRouter ? "/" : "/data/"
        }remove-lines`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lineIds }),
        }
      );

      const json = await res.json();

      const cartLinesRemove =
        json.data as RemoveFromCartMutation["cartLinesRemove"];

      if (!cartLinesRemove || !isCartFragment(cartLinesRemove.cart)) {
        throw new Error("Invalid cart data.");
      }

      if (cartLinesRemove.userErrors.length) {
        const error = cartLinesRemove.userErrors[0];
        throw new Error(error.message);
      }

      return cartLinesRemove.cart;
    },
    onError: (error) => {
      console.error(error);
      // Notify the user if there was an error
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY(userId), cart);
    },
  });
};

export const useCartUpdateLines = (pagesRouter?: boolean) => {
  const queryClient = useQueryClient();
  const userId = ""; // get user ID from your auth system
  return useMutation({
    mutationFn: async ({
      lines,
    }: {
      lines: UpdateCartLinesMutationVariables["lines"];
    }) => {
      const res = await fetch(
        `${pagesRouter ? "/api/" : ""}/cart${
          pagesRouter ? "/" : "/data/"
        }/update-lines`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lines }),
        }
      );

      const json = await res.json();

      const cartLinesUpdate =
        json.data as UpdateCartLinesMutation["cartLinesUpdate"];

      if (!cartLinesUpdate || !isCartFragment(cartLinesUpdate.cart)) {
        throw new Error("Invalid cart data.");
      }

      if (cartLinesUpdate.userErrors.length) {
        const error = cartLinesUpdate.userErrors[0];
        throw new Error(error.message);
      }

      return cartLinesUpdate;
    },
    onError: (error) => {
      console.error(error);
      // Notify the user if there was an error
    },
    onSuccess: (cartLinesUpdate) => {
      queryClient.setQueryData(CART_QUERY_KEY(userId), cartLinesUpdate.cart);
    },
  });
};
