import { getCartAppRouter } from "@/shopify-api/app-router/cart";
import { createCart } from "@/shopify-api/cart";
import { CART_COOKIE } from "@/shopify-api/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params?: { userId: string } }
) {
  const cookieStore = cookies();
  const userId = context.params?.userId ?? "guest"; // '1'

  const cart = await getCartAppRouter(userId);

  if (cart) {
    return NextResponse.json({ data: cart }, { status: 200 });
  } else {
    const mutation = await createCart(userId);
    const cartId = mutation.cartCreate?.cart?.id;

    if (cartId) {
      cookieStore.set(CART_COOKIE(userId), cartId, {
        maxAge: 10 * 365 * 24 * 3_600,
      });

      return NextResponse.json({ data: cart }, { status: 200 });
    }
    return NextResponse.json(
      { error: "Could not create cart" },
      { status: 500 }
    );
  }
}
