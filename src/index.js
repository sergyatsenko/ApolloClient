import React from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';
//import { GetStaticProps } from 'next'
//import { ApolloClient, InMemoryCache, gql, createHttpLink, ApolloLink, from } from '@apollo/client'

const httpLink = createHttpLink({
    uri: 'https://edge-beta.sitecorecloud.io/api/graphql/v1',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'X-GQL-Token': 'eFFWUWVlTVo2SVIzVCtaNFVFSFFKbXQzcm9IalNaNW1HZFJqa3pPOGVTRT18eGNkZW1vNA=='
    }
  }
});

// const authMiddleware = new ApolloLink((operation, forward) => {
//     // add the authorization to the headers
//     operation.setContext(({ headers = {} }) => ({
//         headers: {
//             ...headers,
//             'X-GQL-Token': 'eFFWUWVlTVo2SVIzVCtaNFVFSFFKbXQzcm9IalNaNW1HZFJqa3pPOGVTRT18eGNkZW1vNA=='
//         }
//     }));

//     return forward(operation);
// });

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default function AuthenticationSample({ contentTypes }) {
    return (
        <div>
            <h1>Playground</h1>
            <p>A page to try things out without interfering with pages being built.</p>
            <p>There are {contentTypes.length} content types in the system.</p>
        </div>
    )
}

export const getStaticProps = async () => {
    const { data } = await client.query({
        query: gql`
        {
            allM_ContentType
            {
              results
              {
                contentType_Label,
                id
              }
            }
          }
        `
    });

    return {
        props: {
            contentTypes: data.allM_ContentType.results
        }
    }
}

function ExchangeRates() {
  const { loading, error, data } = useQuery(gql`
    {
        allM_ContentType
        {
          results
          {
            contentType_Label,
            id
          }
        }
      }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
console.log(data);
  return data.allM_ContentType.results.map(({ contentType_Label, id }) => (
    <div key={id}>
      <p>
        {id}:{contentType_Label['en-US']}
      </p>
    </div>
  ));
}

function App() {
  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      <ExchangeRates />
    </div>
  );
}

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);