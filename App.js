import React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { ApolloProvider } from "react-apollo";

import { createClientApollo } from "./src/services/Apollo";

import MainNavigator from "./src/routes/MainNavigation";
import userReducer from "./src/store/Users/userReducer";

const token = "";
const client = createClientApollo(token);

// Armazena os estados na store
const store = createStore(
  combineReducers({
    userLogin: userReducer
  })
);

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FF4949" />
      <ApolloProvider client={client}>
        <Provider store={store}>
          <MainNavigator />
        </Provider>
      </ApolloProvider>
    </>
  );
}

export default App;
