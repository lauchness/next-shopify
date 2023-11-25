import { CartFragment } from "@/graphql/_generated/operations";

import { CART_COOKIE } from "../config";
import { cookies } from "next/headers";
import { queryCart } from "../cart";

export const getCartAppRouter = async (
  userId: string
): Promise<CartFragment | null> => {
  const cookieStore = cookies();

  const __cart = cookieStore.get(CART_COOKIE(userId))?.value;

  if (!__cart) {
    return null;
  }

  const query = await queryCart(__cart);
  const cart = query.cart;

  if (cart) {
    return cart;
  } else {
    return null;
  }
};
