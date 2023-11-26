import {
  UpdateCartLinesDocument,
  UpdateCartLinesMutation,
  UpdateCartLinesMutationVariables,
} from "@/graphql/_generated/operations";

import { NextResponse } from "next/server";
import { getCartAppRouter } from "@/shopify-api/app-router/cart";
import { shopifyClient } from "@/shopify-api/shopify";

interface UpdateLinesRequest {
  walletAddress: string;
  lines: UpdateCartLinesMutationVariables["lines"];
}

const isUpdateLinesRequest = (req: any): req is UpdateLinesRequest => {
  return (
    typeof req === "object" && req.lines && typeof Array.isArray(req.lines)
  );
};

export async function PUT(request: Request) {
  const json = await request.json();

  if (!isUpdateLinesRequest(request)) {
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

  const updateCartLinesVariables: UpdateCartLinesMutationVariables = {
    cartId: cart.id,
    lines: json.lines,
  };

  const mutation = await shopifyClient<UpdateCartLinesMutation>({
    document: UpdateCartLinesDocument,
    variables: updateCartLinesVariables,
  });

  const cartLinesUpdate = mutation.cartLinesUpdate;

  if (!cartLinesUpdate) {
    return NextResponse.json(
      { error: "Could not update cart lines." },
      { status: 500 }
    );
  } else {
    return NextResponse.json({ data: cartLinesUpdate }, { status: 200 });
  }
}
