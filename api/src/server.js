import path from 'path'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { importSchema } from 'graphql-import'

import resolvers from './resolvers'

const resolve = file => path.resolve(__dirname, '..', file)

const app = express()
const apolloServer = new ApolloServer({
  typeDefs: importSchema(resolve('src/schema.graphql')),
  resolvers,
  context: request => ({ request })
})

apolloServer.applyMiddleware({ app, path: '/graphql' })

export { app as default }