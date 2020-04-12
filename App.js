import React from "react";
import { StatusBar } from "react-native";
import { Provider as StoreProvider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { ApolloProvider } from "react-apollo";

import { createClientApollo } from "./src/services/Apollo";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
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

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0099FF"
  }
};

function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="#999" />
        <MainNavigator />
      </PaperProvider>
    </StoreProvider>
  );
}

export default App;
