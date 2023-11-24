import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { createCart, queryCart } from "../cart";
import { CartFragment } from "@/graphql/_generated/operations";
import { getCookie, setCookie } from "cookies-next";
import { CART_COOKIE } from "../config";

export const getCartPagesRouter = async ({
  req,
  res,
  userId,
}: {
  req: NextApiRequest | GetServerSidePropsContext["req"];
  res: NextApiResponse | GetServerSidePropsContext["res"];
  userId: string;
}): Promise<CartFragment | null> => {
  const __cart = getCookie(CART_COOKIE(userId), { req, res });

  if (!__cart) {
    const mutation = await createCart(userId);
    const cart = mutation.cartCreate?.cart;

    if (cart) {
      setCookie(CART_COOKIE(userId), cart.id, {
        req,
        res,
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
