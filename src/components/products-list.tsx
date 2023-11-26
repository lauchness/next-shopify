"use client";

import { PRODUCTS_QUERY_KEY } from "@/shopify-api/config";
import { fetchProducts } from "@/shopify-api/products";
import { useAddToCart } from "@/shopify-api/useCart";
import formatCurrency from "@/utils/currency";
import { useInfiniteQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";

export const ProductsList: FC = () => {
  const addToCart = useAddToCart();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: PRODUCTS_QUERY_KEY,
      queryFn: fetchProducts,
      getNextPageParam: (lastPage) =>
        lastPage.products.pageInfo.hasNextPage
          ? lastPage.products.pageInfo.endCursor
          : null,
      initialPageParam: null,
    });

  const products = data?.pages.flatMap((page) => page.products.nodes) ?? [];

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative flex flex-col gap-4 border border-neutral-400 px-4 py-6 text-neutral-400"
        >
          <span className="body-16 order-2">
            {formatCurrency(
              product.priceRange.maxVariantPrice.amount,
              product.priceRange.maxVariantPrice.currencyCode
            )}
          </span>
          <div className="relative z-0 aspect-[304/240] order-3">
            <img
              src={product.featuredImage?.url || ""}
              alt={product.featuredImage?.altText || ""}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-1.5 order-4">
            <button
              className="z-10 flex h-[30px] items-center border border-secondary-blue bg-secondary-blue px-3 text-neutral-100 hover:bg-transparent hover:text-secondary-blue disabled:cursor-not-allowed"
              onClick={() => {
                addToCart.mutate({
                  productId: product.variants.nodes[0].id,
                  quantity: 1,
                });
              }}
              disabled={product.availableForSale === false}
            >
              <span className="sr-only">Add to Cart</span>
              {addToCart.isPending ? "..." : "+"}
            </button>
            {product.availableForSale === false ? (
              <p className="special-tiny-sm ml-auto flex h-0 items-center uppercase">
                Sold Out
              </p>
            ) : null}
          </div>
          <Link
            href={`/shop/${product.handle}`}
            className="after:absolute after:inset-0 order-1"
          >
            <h2 className="heading-h4 font-semibold">{product.title}</h2>
          </Link>
        </div>
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
        className={clsx("col-span-full", { hidden: !hasNextPage })}
      >
        {isFetchingNextPage ? "Loading..." : "Load More"}
      </button>
    </ul>
  );
};
