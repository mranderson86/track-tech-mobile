/* eslint-disable prettier/prettier */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../pages/private/Home";

import UsersTechnologies from "../pages/private/UsersTechnologies";
import TechnologiesUsers from "../pages/private/TechnologiesUsers";
import Technologies from "../pages/private/Technologies";
import Users from "../pages/private/Users";

const AppStack = createStackNavigator();

// Rota de navigação Entre Home - Projetos - Etapas
function AppNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#FFFFFF",
        headerStyle: {
          backgroundColor: "#FF4949"
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
        name="Technologies"
        component={Technologies}
        options={{
          title: "Tecnologias Disponíveis"
        }}
      />

      <AppStack.Screen
        name="UsersTechnologies"
        component={UsersTechnologies}
        options={{
          title: "Usuários Por Tecnologia"
        }}
      />

      <AppStack.Screen
        name="TechnologiesUsers"
        component={TechnologiesUsers}
        options={{
          title: "Tecnologias Por Usuário"
        }}
      />

      <AppStack.Screen
        name="Users"
        component={Users}
        options={{
          title: "Usuários"
        }}
      />
    </AppStack.Navigator>
  );
}

export default AppNavigator;
