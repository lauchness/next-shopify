import { CartFragment } from "@/graphql/_generated/operations";

import { CART_COOKIE } from "../config";
import { cookies } from "next/headers";
import { createCart, queryCart } from "../cart";

export const getCartAppRouter = async (
  userId: string
): Promise<CartFragment | null> => {
  const cookieStore = cookies();

  const __cart = cookieStore.get(CART_COOKIE(userId))?.value;

  if (!__cart) {
    const mutation = await createCart(userId);
    const cart = mutation.cartCreate?.cart;

    if (cart) {
      cookieStore.set(CART_COOKIE(userId), cart.id, {
        maxAge: 10 * 365 * 24 * 3_600,
      });

      return cart;
    } else {
      return null;
    }
  } else {
    const query = await queryCart(__cart);
    const cart = query.cart;

    if (cart) {
      return cart;
    } else {
      return null;
    }
  }
};
