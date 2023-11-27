import { CartLink } from "@/components/cart-link";
import { ProductsList } from "@/components/products-list";
import { prefetchCartPagesRouter } from "@/shopify-api/pages-router/react-query";

import { prefetchProducts } from "@/shopify-api/react-query";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { FC } from "react";

interface ShopProps {}

export const getServerSideProps: GetServerSideProps<ShopProps> = async ({
  req,
  res,
}) => {
  const queryClient = new QueryClient();
  const userId = await new Promise<string>((resolve, reject) => {
    resolve("");
  }); // get user ID from your auth system

  await prefetchProducts(queryClient);
  await prefetchCartPagesRouter({ req, res, queryClient, userId });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const ShopPage: FC<ShopProps> = () => {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-2xl sm:text-4xl font-semibold">My Shopify Shop</h1>

      <CartLink pagesRouter />

      <div className="flow-root mt-8">
        <h2 className="text-xl font-semibold">My Products</h2>
        <ProductsList pagesRouter />
      </div>
    </main>
  );
};

export default ShopPage;
