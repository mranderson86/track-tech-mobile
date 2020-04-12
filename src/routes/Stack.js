import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Appbar, Avatar, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import BottomTabs from "./BottomTab";
import Users from "../pages/private/Users";

const Header = ({ scene, previous, navigation }) => {
  const theme = useTheme();

  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  return (
    <Appbar.Header theme={{ colors: { primary: theme.colors.surface } }}>
      {previous ? (
        <Appbar.BackAction
          onPress={navigation.goBack}
          color={theme.colors.primary}
        />
      ) : (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <Avatar.Icon
            size={40}
            icon="menu"
            color={theme.colors.primary}
            style={{ backgroundColor: "#fff" }}
          />
        </TouchableOpacity>
      )}
      <Appbar.Content
        title={
          title === "Tecnologia" ? (
            <MaterialCommunityIcons
              style={{ marginRight: 10 }}
              name="react"
              size={40}
              color={theme.colors.primary}
            />
          ) : (
            title
          )
        }
        titleStyle={{
          fontSize: 18,
          fontWeight: "bold",
          color: theme.colors.primary
        }}
      />
    </Appbar.Header>
  );
};

const Stack = createStackNavigator();

export const StackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="Tecnologias"
      headerMode="screen"
      screenOptions={{
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        )
      }}
    >
      <Stack.Screen
        name="Tecnologias"
        component={BottomTabs}
        options={({ route }) => {
          // console.log("!@# options", { route });
          const routeName = route.state
            ? route.state.routes[route.state.index].name
            : "Tecnologias";
          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen
        name="Users"
        component={Users}
        options={{ headerTitle: "Usuários" }}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;
