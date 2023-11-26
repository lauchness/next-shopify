import {
  RemoveFromCartDocument,
  RemoveFromCartMutation,
  RemoveFromCartMutationVariables,
  UpdateCartLinesDocument,
  UpdateCartLinesMutation,
  UpdateCartLinesMutationVariables,
} from "@/graphql/_generated/operations";

import { NextResponse } from "next/server";
import { getCartAppRouter } from "@/shopify-api/app-router/cart";
import { shopifyClient } from "@/shopify-api/shopify";

interface RemoveFromCartRequest {
  lineIds: string[];
}

const isRemoveFromCartRequest = (req: any): req is RemoveFromCartRequest => {
  return typeof req === "object" && req.lineIds && Array.isArray(req.lineIds);
};

export async function DELETE(request: Request) {
  const json = await request.json();

  if (!isRemoveFromCartRequest(json)) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const userId = ""; // get auth from cookie storage

  const cart = await getCartAppRouter(userId);

  if (!cart) {
    return NextResponse.json({ error: "Could not get cart" }, { status: 500 });
  }

  const removeFromCartVariables: RemoveFromCartMutationVariables = {
    cartId: cart.id,
    lineIds: [...json.lineIds],
  };

  const mutation = await shopifyClient<RemoveFromCartMutation>({
    document: RemoveFromCartDocument,
    variables: removeFromCartVariables,
  });

  const cartLinesRemove = mutation.cartLinesRemove;

  if (!cartLinesRemove) {
    return NextResponse.json(
      { error: "Could not remove cart lines." },
      { status: 500 }
    );
  } else {
    return NextResponse.json({ data: cartLinesRemove }, { status: 200 });
  }
}
