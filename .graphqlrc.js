/** @type {import('graphql-config').IGraphQLConfig} */
module.exports = {
  // You could use a URL here instead of the massive schema.json file.
  schema: 'src/graphql/schema.json',
  documents: 'src/graphql/**/*.gql',
}
