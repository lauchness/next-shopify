import { Cart } from "@/components/cart";
import { prefetchCartPagesRouter } from "@/shopify-api/pages-router/react-query";

import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FC } from "react";

interface CartPageProps {}

export const getServerSideProps: GetServerSideProps<CartPageProps> = async ({
  req,
  res,
}) => {
  const queryClient = new QueryClient();
  const userId = await new Promise<string>((resolve, reject) => {
    resolve("");
  }); // get user ID from your auth system

  await prefetchCartPagesRouter({ req, res, queryClient, userId });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const CartPage: FC<CartPageProps> = () => {
  return (
    <main>
      <h1 className="text-2xl sm:text-4xl font-semibold">My Cart</h1>

      <Link
        className="text-lg relative flex items-center gap-1.5 mb-4 underline"
        href="/pages-router"
      >
        Back to Shop
      </Link>

      <Cart pagesRouter />
    </main>
  );
};

export default CartPage;
