import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { UserAction } from "../../store/Users/userAction";

function DrawerContent(props) {
  const { UserAction, userLogin } = props;
  const { user } = userLogin;

  return (
    <DrawerContentScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          {/* <Avatar.Image
            source={{
              uri:
                "https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg"
            }}
            size={50}
          /> */}
          <Avatar.Text size={50} label={user.username[0]} />
          <Title style={styles.title}>{user.username}</Title>
          <Caption style={styles.caption}>{user.email}</Caption>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Cadastro"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="logout" color={color} size={size} />
            )}
            label="Sair"
            onPress={() => {
              UserAction({
                authenticate: false,
                user: {},
                token: ""
              });
            }}
          />
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1
  },
  userInfoSection: {
    padding: 20
  },
  title: {
    marginTop: 20,
    fontWeight: "bold"
  },
  caption: {
    fontSize: 14,
    lineHeight: 14
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3
  },
  drawerSection: {
    marginTop: 15
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16
  }
});

// State em props
const mapStateToProps = state => {
  const { userLogin } = state;
  return { userLogin };
};

// Action em props
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      UserAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
