// 1
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";

function createClientApollo(token) {
  const uri = "https://tracking-graphql.herokuapp.com/graphql";

  // Cria url da api
  const httpLink = createHttpLink({
    uri: "https://tracking-graphql.herokuapp.com/graphql"
    //uri: "https://127.0.0.1:3333/graphql"
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });

  // cria client
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
}

export { createClientApollo };
