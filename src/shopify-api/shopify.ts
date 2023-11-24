import { TypedQueryDocumentNode } from "graphql";
import { RequestDocument, request } from "graphql-request";

export async function shopifyClient<Query>({
  document,
  variables,
}: {
  document:
    | RequestDocument
    | TypedQueryDocumentNode<unknown, Record<string, unknown>>;
  variables: Record<string, unknown>;
}) {
  const SHOPIFY_GRAPHQL_ENDPOINT = process.env.SHOPIFY_GRAPHQL_ENDPOINT;
  if (!SHOPIFY_GRAPHQL_ENDPOINT) {
    throw new Error("Missing env SHOPIFY_GRAPHQL_ENDPOINT");
  }
  const DONT_EXPOSE_OR_YOU_WILL_BE_FIRED_SHOPIFY_STOREFRONT_ACCESS_TOKEN =
    process.env
      .DONT_EXPOSE_OR_YOU_WILL_BE_FIRED_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!DONT_EXPOSE_OR_YOU_WILL_BE_FIRED_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error("Missing env SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  }

  const result = await request<Query>({
    url: SHOPIFY_GRAPHQL_ENDPOINT,
    document,
    variables,
    requestHeaders: {
      "X-Shopify-Storefront-Access-Token":
        DONT_EXPOSE_OR_YOU_WILL_BE_FIRED_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
  });

  return result;
}
