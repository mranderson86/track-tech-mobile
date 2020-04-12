import React from "react";
import { connect } from "react-redux";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from "@react-navigation/native";
import { useTheme } from "react-native-paper";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

function MainNavigator(props) {
  const theme = useTheme();

  const { userLogin } = props;
  const { authenticate } = userLogin;

  return (
    <NavigationContainer theme={theme}>
      {authenticate ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const mapStateToProps = state => {
  const { userLogin } = state;
  return { userLogin };
};

export default connect(mapStateToProps)(MainNavigator);
