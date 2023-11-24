import { Cart } from "@/components/cart";
import { ProductsList } from "@/components/products-list";
import { prefetchCartAppRouter } from "@/shopify-api/app-router/react-query";
import { prefetchProducts } from "@/shopify-api/react-query";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Link from "next/link";

export default async function Home() {
  const queryClient = new QueryClient();

  const userId = await new Promise<string>((resolve, reject) => {
    resolve("");
  }); // get user ID from your auth system

  await prefetchCartAppRouter(queryClient, userId);
  await prefetchProducts(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-screen flex-col p-6">
        <h1 className="text-2xl sm:text-4xl font-semibold">My Shopify Shop</h1>

        <Cart />

        <div className="flow-root mt-8">
          <h2 className="text-xl font-semibold">My Products</h2>
          <ProductsList />
        </div>
      </main>
    </HydrationBoundary>
  );
}
