/* eslint-disable prettier/prettier */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

const AuthStack = createStackNavigator();

// Rota de navigação login / cadastro
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#FFF"
        }
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false
        }}
      />

      <AuthStack.Screen
        name="Register"
        component={Register}
        options={{
          title: "Cadastre-se"
        }}
      />
    </AuthStack.Navigator>
  );
}

export default AuthNavigator;
