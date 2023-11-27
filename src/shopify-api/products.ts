import {
  ProductListingDocument,
  ProductListingQuery,
} from "@/graphql/_generated/operations";

import { PRODUCTS_PER_PAGE } from "./config";
import { shopifyClient } from "./shopify";

export const fetchProducts = async ({ pageParam }: { pageParam: unknown }) => {
  const res = await fetch(
    `/products${pageParam ? `?after=${pageParam}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const json = await res.json();

  return json.data as ProductListingQuery;
};

export const queryProducts = async (after?: string | undefined) => {
  const query = await shopifyClient<ProductListingQuery>({
    document: ProductListingDocument,
    variables: {
      first: PRODUCTS_PER_PAGE,
      ...(after ? { after } : {}),
    },
  });

  return query;
};
