import type { NextApiRequest, NextApiResponse } from "next";

import {
  UpdateCartLinesDocument,
  UpdateCartLinesMutation,
  UpdateCartLinesMutationVariables,
} from "@/graphql/_generated/operations";
import { getCartPagesRouter } from "@/shopify-api/pages-router/cart";
import { shopifyClient } from "@/shopify-api/shopify";

interface UpdateLinesRequest extends NextApiRequest {
  body: {
    lines: UpdateCartLinesMutationVariables["lines"];
  };
}

const isUpdateLinesRequest = (req: any): req is UpdateLinesRequest => {
  return (
    typeof req === "object" &&
    req !== null &&
    req.body &&
    req.body.lines &&
    Array.isArray(req.body.lines)
  );
};

export default async function handler(
  req: UpdateLinesRequest,
  res: NextApiResponse<
    { data: UpdateCartLinesMutation["cartLinesUpdate"] } | { error: string }
  >
) {
  if (req.method !== "PUT") {
    res.status(405).send({ error: "Only PUT requests are supported." });
  }

  if (!isUpdateLinesRequest(req)) {
    res.status(400).send({ error: "invalid request body" });
  }

  const userId = await new Promise<string>((resolve, reject) => {
    resolve("");
  }); // get user ID from your auth system

  const cart = await getCartPagesRouter({ req, res, userId });

  const cartId = cart?.id;

  if (cartId) {
    const updateCartLinesVariables: UpdateCartLinesMutationVariables = {
      cartId,
      lines: req.body.lines,
    };

    const mutation = await shopifyClient<UpdateCartLinesMutation>({
      document: UpdateCartLinesDocument,
      variables: updateCartLinesVariables,
    });

    const cartLinesUpdate = mutation.cartLinesUpdate;

    if (!cart) {
      res.status(500).send({ error: "Could not update cart lines." });
    } else {
      res.status(200).json({ data: cartLinesUpdate });
    }
  } else {
    res.status(500).send({ error: "Could not get cart." });
  }
}
