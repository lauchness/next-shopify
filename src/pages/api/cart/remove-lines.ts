import type { NextApiRequest, NextApiResponse } from "next";

import {
  RemoveFromCartDocument,
  RemoveFromCartMutation,
  RemoveFromCartMutationVariables,
} from "@/graphql/_generated/operations";
import { getCartPagesRouter } from "@/shopify-api/pages-router/cart";
import { shopifyClient } from "@/shopify-api/shopify";

interface RemoveFromCartRequest extends NextApiRequest {
  body: {
    lineIds: string[];
  };
}

const isRemoveFromCartRequest = (req: any): req is RemoveFromCartRequest => {
  return (
    typeof req === "object" &&
    req !== null &&
    req.body &&
    req.body.lineIds &&
    Array.isArray(req.body.lineIds)
  );
};

export default async function handler(
  req: RemoveFromCartRequest,
  res: NextApiResponse<
    { data: RemoveFromCartMutation["cartLinesRemove"] } | { error: string }
  >
) {
  if (req.method !== "DELETE") {
    res.status(405).send({ error: "Only DELETE requests are supported." });
  }

  if (!isRemoveFromCartRequest(req)) {
    res.status(400).send({ error: "invalid request body" });
  }

  const userId = await new Promise<string>((resolve, reject) => {
    resolve("");
  }); // get user ID from your auth system

  const cart = await getCartPagesRouter({ req, res, userId });

  const cartId = cart?.id;

  if (cartId) {
    const removeFromCartVariables: RemoveFromCartMutationVariables = {
      cartId,
      lineIds: [...req.body.lineIds],
    };

    const mutation = await shopifyClient<RemoveFromCartMutation>({
      document: RemoveFromCartDocument,
      variables: removeFromCartVariables,
    });

    const cartLinesRemove = mutation.cartLinesRemove;

    if (!cart) {
      res.status(500).send({ error: "Could not remove from cart." });
    } else {
      res.status(200).json({ data: cartLinesRemove });
    }
  } else {
    res.status(500).send({ error: "Could not get cart." });
  }
}
