import React from "react";
import { connect } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

function MainNavigator(props) {
  const { userLogin } = props;
  const { authenticate } = userLogin;
  // const authenticate = false;

  return (
    <NavigationContainer>
      {authenticate ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const mapStateToProps = state => {
  const { userLogin } = state;
  return { userLogin };
};

export default connect(mapStateToProps)(MainNavigator);
// export default MainNavigator;
