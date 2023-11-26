import { Cart } from "@/components/cart";

import { prefetchCartAppRouter } from "@/shopify-api/app-router/react-query";
import { CART_QUERY_KEY } from "@/shopify-api/config";
import { prefetchProducts } from "@/shopify-api/react-query";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

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
        <Cart />
      </main>
    </HydrationBoundary>
  );
}
