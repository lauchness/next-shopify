This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## What?

If you're about to start a project, and need to build a Shopify store, you should be using [Shopify Hydrogen](https://hydrogen.shopify.dev/).

However, if you have no choice but to shim a Shopify store into an existing Next JS app. This repo is a very opinionated way of building out a shopify store in a Next JS app. It's not something you should use as boilerplate, but you can certainly feel free to copy the ideas here.

### App Router vs. Pages Router

I've implemented this using both App/Pages router so you can apply these ideas to either.

## How?

Effectively, shopify exposes a GraphQL API endpoint, so to manage your store, all you have to do is hit that endpoint with the appropriate queries/mutations.

### GraphQL

Since GraphQL has a fully typed schema, we can use that to generate our types locally. [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) is used to do this, which defines the output in `codegen.ts`.

You can use an https address for this schema, but I couldn't figure out how to hit the shopify schema, so I just copied and pasted the whole thing in `src/graphql/schema.json` - if you can figure out the endpoint, you can remove this file and replace your schema endpoint in `codegen.ts`.

### Making GraphQL Requests

The [GraphQL Request](https://www.npmjs.com/package/graphql-request) library was leveraged here, because it's simple and effective. It uses `node-fetch` under the hood, which might be a problem for you, but it's been fine for this.

There's a nifty helper function called `shopifyClient` in `src/shopify-api/shopify.ts` which is probably the most useful thing in this whole repo. It works with the generated types from codegen, and uses graphql request to allow you to make fully typed async requests to your shopify endpoint.

For this to work you need to have two environment variables set:

- `SHOPIFY_GRAPHQL_ENDPOINT` which is the GraphQL endpoint for your shopify instance
- `DONT_EXPOSE_OR_YOU_WILL_BE_FIRED_SHOPIFY_STOREFRONT_ACCESS_TOKEN` which is your private storefront access token for your shopify instance.

Both of these should be kept secret and NEVER exposed to the client facing code.

### React Query

[React Query](https://tanstack.com/query/latest) is used to manage state, prefetching everything in either `RSC` for App Router, or `getSeverSideProps` for Pages. The functions for prefetching/querying are all tucked away in `src/shopify-api`. Most are the same for either architecture, but those with significant differences live in their respective `/app-router` or `/pages-router` directory.

There's a `src/shopify-api/useCart.tsx` which would be simpler if both pages/app router weren't in tandem. Every one of the hooks can be simplified for whatever architecture you choose.

### Tailwind

This project uses [Tailwind CSS](https://tailwindcss.com/). That being said, the design is brutal and absolutely no effort was put in to make this look nice. I would be sorry about this, except instead I don't care because no one should ever use this.

## TL;DR

DO NOT use this project - it's a jumping off point for ideas.

DO use [Shopify Hydrogen](https://hydrogen.shopify.dev/) if you can - if you can't and for some awful reason have to shim a shopify store into an existing NextJS project, take these ideas.

Please, for the love of software, do NOT clone/fork this project and use it as a starting point. That would make the author sad.
