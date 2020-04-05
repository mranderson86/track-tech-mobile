import React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { ApolloProvider } from "react-apollo";

import apolloClient from "./src/services/Apollo";
import MainNavigator from "./src/routes/MainNavigation";
import userReducer from "./src/store/Users/userReducer";
import projectReducer from "./src/store/Projects/projectReducer";

// Armazena os estados na store
const store = createStore(
  combineReducers({ userLogin: userReducer, userProjects: projectReducer })
);

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FF4949" />
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    </>
  );
}

export default App;
