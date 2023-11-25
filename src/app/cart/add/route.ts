import {
  AddToCartDocument,
  AddToCartMutation,
  AddToCartMutationVariables,
} from "@/graphql/_generated/operations";
import { getCartAppRouter } from "@/shopify-api/app-router/cart";
import { createCart } from "@/shopify-api/cart";
import { CART_COOKIE } from "@/shopify-api/config";
import { shopifyClient } from "@/shopify-api/shopify";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface AddToCartRequest {
  userId: string;
  productId: string;
  quantity: number;
}

const isAddToCartRequest = (json: any): json is AddToCartRequest => {
  return (
    typeof json === "object" &&
    json.productId &&
    typeof json.productId === "string" &&
    json.quantity &&
    typeof json.quantity === "number" &&
    typeof json.userId === "string"
  );
};

export async function POST(
  request: Request,
  context: { params?: { userId: string } }
) {
  const json = await request.json();

  console.log("json", json);

  if (!isAddToCartRequest(json)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const userId = context.params?.userId ?? "guest"; // '1'

  const cart = await getCartAppRouter(userId);

  if (!cart) {
    return NextResponse.json({ error: "Could not get cart" }, { status: 500 });
  } else {
    const addToCartVariables: AddToCartMutationVariables = {
      cartId: cart.id,
      lines: [{ quantity: json.quantity, merchandiseId: json.productId }],
    };

    const mutation = await shopifyClient<AddToCartMutation>({
      document: AddToCartDocument,
      variables: addToCartVariables,
    });

    const cartLinesAdd = mutation.cartLinesAdd;
    return NextResponse.json({ data: cartLinesAdd }, { status: 200 });
  }
}
