import { Cart } from "@/components/cart";

import { prefetchCartAppRouter } from "@/shopify-api/app-router/react-query";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Link from "next/link";

export default async function CartPage() {
  const queryClient = new QueryClient();

  const userId = await new Promise<string>((resolve, reject) => {
    resolve("");
  }); // get user ID from your auth system

  await prefetchCartAppRouter(queryClient, userId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <h1 className="text-2xl sm:text-4xl font-semibold">My Cart</h1>

        <Link
          className="text-lg relative flex items-center gap-1.5 mb-4 underline"
          href="/"
        >
          Back to Shop
        </Link>

        <Cart />
      </main>
    </HydrationBoundary>
  );
}
