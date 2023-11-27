import {
  AddToCartDocument,
  AddToCartMutation,
  AddToCartMutationVariables,
} from "@/graphql/_generated/operations";
import { getCartAppRouter } from "@/shopify-api/app-router/cart";
import { shopifyClient } from "@/shopify-api/shopify";
import { NextResponse } from "next/server";

interface AddToCartRequest {
  productId: string;
  quantity: number;
}

const isAddToCartRequest = (json: any): json is AddToCartRequest => {
  return (
    typeof json === "object" &&
    json &&
    json.productId &&
    typeof json.productId === "string" &&
    json.quantity &&
    typeof json.quantity === "number"
  );
};

export async function POST(request: Request) {
  const json = await request.json();

  if (!isAddToCartRequest(json)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const userId = ""; // get auth from cookie storage

  const cart = await getCartAppRouter(userId);

  if (!cart) {
    return NextResponse.json({ error: "Could not get cart" }, { status: 500 });
  }

  const addToCartVariables: AddToCartMutationVariables = {
    cartId: cart.id,
    lines: [{ quantity: json.quantity, merchandiseId: json.productId }],
  };

  const mutation = await shopifyClient<AddToCartMutation>({
    document: AddToCartDocument,
    variables: addToCartVariables,
  });

  const cartLinesAdd = mutation.cartLinesAdd;
  return NextResponse.json({ data: cartLinesAdd }, { status: 201 });
}
