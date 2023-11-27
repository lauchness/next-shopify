import { CartFragment } from "@/graphql/_generated/operations";
import { getCartPagesRouter } from "@/shopify-api/pages-router/cart";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: CartFragment } | { error: string }>
) {
  if (req.method !== "GET") {
    res.status(405).send({ error: "Only GET requests are supported." });
  }

  const userId = await new Promise<string>((resolve, reject) => {
    resolve("");
  }); // get user ID from your auth system

  const cart = await getCartPagesRouter({ req, res, userId });

  if (cart) {
    res.status(200).json({ data: cart });
  } else {
    res.status(500).send({ error: "Could not get cart." });
  }
}
