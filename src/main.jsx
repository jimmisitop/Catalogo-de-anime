import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

import * as ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://graphql.anilist.co" }),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
