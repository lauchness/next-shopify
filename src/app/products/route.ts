import { queryProducts } from "@/shopify-api/products";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params?: { after: string } }
) {
  const after = context.params?.after ?? "";

  const query = await queryProducts(after);

  return NextResponse.json({ data: query }, { status: 200 });
}
