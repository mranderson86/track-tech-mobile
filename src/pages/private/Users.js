/* eslint-disable prettier/prettier */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";

import { useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

// Renderiza cada tecnologia
function CardItem(props) {
  const { item } = props;
  const { username } = item;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.technologyContainer}>
        <FontAwesome name="user-circle" size={50} />
        <View style={styles.technology}>
          <Text style={styles.title}>{username}</Text>
        </View>
      </View>
    </View>
  );
}

function Users() {
  const route = useRoute();
  const { users } = route.params || [];

  //  Renderiza lista de projetos
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <CardItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E9F2"
  },

  cardContainer: {
    // alinha no eixo horizontal
    backgroundColor: "#ffffff",
    marginHorizontal: "2%",
    marginVertical: "1%",
    paddingHorizontal: "2%",
    paddingVertical: "2%",
    borderRadius: 10
  },

  technologyContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  technology: {
    fontSize: 25,
    fontWeight: "bold",
    width: "75%"
  },

  title: {
    fontSize: 25,
    fontWeight: "bold"
  }
});

export default Users;
