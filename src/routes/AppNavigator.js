/* eslint-disable prettier/prettier */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Home from "../pages/private/Home";
import DrawerContent from "../pages/private/Drawer";
import UsersTechnologies from "../pages/private/UsersTechnologies";
import TechnologiesUsers from "../pages/private/TechnologiesUsers";
import Technologies from "../pages/private/Technologies";
import Users from "../pages/private/Users";

import StackScreen from "./Stack";

const AppDrawer = createDrawerNavigator();
const AppStack = createStackNavigator();

// Rota de navigação
function AppNavigator1() {
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

export const AppNavigator = () => {
  return (
    <AppDrawer.Navigator drawerContent={() => <DrawerContent />}>
      <AppDrawer.Screen name="Home" component={StackScreen} />
    </AppDrawer.Navigator>
  );
};

export default AppNavigator;
