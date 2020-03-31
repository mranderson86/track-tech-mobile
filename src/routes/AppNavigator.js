/* eslint-disable prettier/prettier */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../pages/private/Home";

import Technologies from "../pages/private/Projects/Technologies";
import Users from "../pages/private/Projects/Users";
import CheckIn from "../pages/private/Projects/CheckIn";

const AppStack = createStackNavigator();

// Rota de navigação Entre Home - Projetos - Etapas
function AppNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#FFFFFF",
        headerStyle: {
          backgroundColor: "#1FB6FF"
        }
      }}
    >
      <AppStack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Tracking de Tecnologias"
        }}
      />

      <AppStack.Screen
        name="CheckIn"
        component={CheckIn}
        options={{
          title: "Tecnologias"
        }}
      />

      <AppStack.Screen
        name="Technologies"
        component={Technologies}
        options={{
          title: "Usuários Por Tecnologia"
        }}
      />

      <AppStack.Screen
        name="Users"
        component={Users}
        options={{
          title: "Tecnologias Por Usuário"
        }}
      />
    </AppStack.Navigator>
  );
}

export default AppNavigator;
