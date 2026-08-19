import { ApolloProvider } from "@apollo/client/react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import client from "./lib/apolloClient.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
