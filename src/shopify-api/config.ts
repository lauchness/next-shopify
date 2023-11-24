export const PRODUCTS_PER_PAGE = 12;
export const CART_COOKIE = (userId: string) => `__cart_${userId || "guest"}`;
export const CART_QUERY_KEY = (userId: string) =>
  ["cart", userId || "guest"] as ["cart", string];
export const PRODUCTS_QUERY_KEY = ["products"];
