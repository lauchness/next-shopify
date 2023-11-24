import { QueryClient } from "@tanstack/react-query";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getCartPagesRouter } from "./cart";
import { CART_QUERY_KEY } from "../config";

export const prefetchCartPagesRouter = async ({
  queryClient,
  req,
  res,
  userId,
}: {
  queryClient: QueryClient;
  req: NextApiRequest | GetServerSidePropsContext["req"];
  res: NextApiResponse | GetServerSidePropsContext["res"];
  userId: string;
}) => {
  const query = await getCartPagesRouter({ req, res, userId });
  await queryClient.prefetchQuery({
    queryKey: CART_QUERY_KEY(userId),
    queryFn: () => query,
  });
};
