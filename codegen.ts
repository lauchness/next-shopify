import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  // You could use a URL here instead of the massive schema.json file.
  schema: "src/graphql/schema.json",
  documents: ["src/graphql/**/*.gql"],
  generates: {
    "src/graphql/_generated/types.ts": {
      plugins: ["typescript"],
      config: {
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: true,
          defaultValue: true,
        },
        declarationKind: "interface",
      },
    },
    "src/graphql/_generated/operations.ts": {
      preset: "import-types",
      plugins: ["typescript-operations", "typed-document-node"],
      presetConfig: {
        typesPath: "./types",
      },
      config: {
        avoidOptionals: true,
      },
    },
  },
};

export default config;
