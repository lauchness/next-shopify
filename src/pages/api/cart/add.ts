import type { NextApiRequest, NextApiResponse } from "next";

import {
  AddToCartDocument,
  AddToCartMutation,
  AddToCartMutationVariables,
} from "@/graphql/_generated/operations";
import { getCartPagesRouter } from "@/shopify-api/pages-router/cart";
import { shopifyClient } from "@/shopify-api/shopify";

interface AddToCartRequest extends NextApiRequest {
  body: {
    productId: string;
    quantity: number;
  };
}

const isAddToCartRequest = (req: any): req is AddToCartRequest => {
  return (
    typeof req === "object" &&
    req.body &&
    req.body.productId &&
    typeof req.body.productId === "string" &&
    req.body.quantity &&
    typeof req.body.quantity === "number"
  );
};

export default async function handler(
  req: AddToCartRequest,
  res: NextApiResponse<
    { data: AddToCartMutation["cartLinesAdd"] } | { error: string }
  >
) {
  if (req.method !== "POST") {
    res.status(405).send({ error: "Only POST requests are supported." });
  }

  if (!isAddToCartRequest(req)) {
    res.status(400).send({ error: "invalid request body" });
  }

  const userId = await new Promise<string>((resolve, reject) => {
    resolve("");
  }); // get user ID from your auth system

  const cart = await getCartPagesRouter({ req, res, userId });

  const cartId = cart?.id;

  if (cartId) {
    const addToCartVariables: AddToCartMutationVariables = {
      cartId,
      lines: [
        { quantity: req.body.quantity, merchandiseId: req.body.productId },
      ],
    };

    const mutation = await shopifyClient<AddToCartMutation>({
      document: AddToCartDocument,
      variables: addToCartVariables,
    });

    const cartLinesAdd = mutation.cartLinesAdd;

    if (!cart) {
      res.status(500).send({ error: "Could not add to cart." });
    } else {
      res.status(200).json({ data: cartLinesAdd });
    }
  } else {
    res.status(500).send({ error: "Could not get cart." });
  }
}
