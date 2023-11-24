import { QueryClient } from "@tanstack/react-query";

import { PRODUCTS_QUERY_KEY } from "./config";
import { queryProducts } from "./products";

export const prefetchProducts = async (queryClient: QueryClient) => {
  const query = await queryProducts();
  await queryClient.prefetchInfiniteQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => query,
    getNextPageParam: (lastPage) => {
      if (lastPage.products.pageInfo.hasNextPage) {
        return lastPage.products.pageInfo.endCursor;
      } else {
        return null;
      }
    },
    initialPageParam: null,
    pages: 1,
  });
};
