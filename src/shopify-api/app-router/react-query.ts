import { QueryClient } from "@tanstack/react-query";
import { getCartAppRouter } from "./cart";
import { CART_QUERY_KEY } from "../config";

export const prefetchCartAppRouter = async (
  queryClient: QueryClient,
  userId: string
) => {
  const query = await getCartAppRouter(userId);
  await queryClient.prefetchQuery({
    queryKey: CART_QUERY_KEY(userId),
    queryFn: () => query,
  });
};
