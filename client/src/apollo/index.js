import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'

import defaultState from '@/state'
import resolvers from './resolvers'

Vue.use(VueApollo)

const cache = new InMemoryCache()

const authLink = setContext(async (_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      'user-key': token || ''
    }
  }
})

const httpLink = new HttpLink({
  uri: '/graphql'
})

const link = ApolloLink.from([
  authLink,
  httpLink
])

const apolloClient = new ApolloClient({
  cache,
  link,
  resolvers
})

cache.writeData({
  data: defaultState
})

apolloClient.onResetStore(() => {
  cache.writeData({
    data: defaultState
  })
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

export { apolloProvider as default, apolloClient }