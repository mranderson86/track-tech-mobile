import React from "react";
import color from "color";
import { useSafeArea } from "react-native-safe-area-context";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useTheme, Portal, FAB } from "react-native-paper";
import { useIsFocused, RouteProp } from "@react-navigation/native";

import Technologies from "../pages/private/Technologies";
import TechnologiesUsers from "../pages/private/TechnologiesUsers";
import UsersTechnologies from "../pages/private/UsersTechnologies";

const Tab = createMaterialBottomTabNavigator();

const BottomTabs = props => {
  const routeName = props.route.state
    ? props.route.state.routes[props.route.state.index].name
    : "Tecnologia";

  const theme = useTheme();

  const tabBarColor = theme.colors.surface;

  return (
    <Tab.Navigator
      barStyle={{
        backgroundColor: "#FFF"
      }}
      initialRouteName="Technology"
      backBehavior="initialRoute"
      shifting={true}
      activeColor={theme.colors.primary}
      inactiveColor={color(theme.colors.text)
        .alpha(0.6)
        .rgb()
        .string()}
      sceneAnimationEnabled={false}
    >
      <Tab.Screen
        name="Tecnologia"
        component={Technologies}
        options={{ tabBarIcon: "remote-desktop" }}
      />

      <Tab.Screen
        name="Usuarios Por Tecnologia"
        component={UsersTechnologies}
        options={{
          tabBarIcon: "map-marker-distance"
        }}
      />
      <Tab.Screen
        name="Tecnologias Por Usuário"
        component={TechnologiesUsers}
        options={{
          tabBarIcon: "lock-pattern"
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
