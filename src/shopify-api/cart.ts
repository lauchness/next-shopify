import {
  CartFragment,
  CartListDocument,
  CartListQuery,
  CartListQueryVariables,
  CreateCartDocument,
  CreateCartMutation,
  CreateCartMutationVariables,
} from "@/graphql/_generated/operations";
import { shopifyClient } from "./shopify";

export const isCartFragment = (cart: unknown): cart is CartFragment => {
  return (
    typeof cart === "object" &&
    cart !== null &&
    typeof (cart as CartFragment).id !== undefined
  );
};

export const createCart = async (userId: string | undefined) => {
  const cartCreateVariables: CreateCartMutationVariables = {
    userId: userId || "",
  };

  return await shopifyClient<CreateCartMutation>({
    document: CreateCartDocument,
    variables: cartCreateVariables,
  });
};

export const queryCart = async (cartId: string) => {
  const cartVariables: CartListQueryVariables = {
    id: cartId,
  };

  return await shopifyClient<CartListQuery>({
    document: CartListDocument,
    variables: cartVariables,
  });
};
