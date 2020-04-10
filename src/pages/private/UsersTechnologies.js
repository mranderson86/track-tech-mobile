/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import gql from "graphql-tag";
import { createClientApollo } from "../../services/Apollo";

import Result from "../../components/Result/Result";

const USERS_TECHNOLOGIES_QUERY = gql`
  {
    allTechnologies {
      id
      technology
      users {
        id
        username
      }
    }
  }
`;

// Renderiza cada tecnologia
function CardItem(props) {
  const { item, navigation } = props;
  const { users } = item;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.cardContainer}
      onPress={() => {
        navigation.navigate("Users", { users });
      }}
    >
      <View style={styles.technologyContainer}>
        <View style={styles.technology}>
          <Text style={styles.title}>{item.technology}</Text>
          <Text style={styles.couter}>{users.length || 0} Usuários</Text>
        </View>
        <Feather name="chevron-right" size={30} color="#1FB6FF" />
      </View>
    </TouchableOpacity>
  );
}

// Tela Lista de Projetos
function UsersTechnologies(props) {
  const { userLogin } = props;
  const { token, user } = userLogin;

  const navigation = useNavigation();

  const [state, setState] = useState({
    data: [],
    show: true,
    error: false
  });

  // carrega a lista das etapas
  useEffect(() => {
    Load();
  }, []);

  // consulta a lista de projetos
  async function Load() {
    try {
      const client = createClientApollo(token);

      // consulta tecnologias ()
      const response = await client.query({
        query: USERS_TECHNOLOGIES_QUERY
      });

      const { allTechnologies } = response.data;

      if (allTechnologies) {
        setState({
          ...state,
          show: false,
          data: allTechnologies.filter(({ users }) => users.length !== 0)
        });
      } else {
        setState({ ...state, show: false, data: [] });
      }
    } catch (err) {
      setState({ ...state, show: false });

      alert(err);
    }
  }

  if (state.show && state.error) {
    return <Result type="error" />;
  }

  if (state.show && !state.error) {
    return <Result type="await" />;
  }

  //  Renderiza lista de projetos
  return (
    <View style={styles.container}>
      <FlatList
        data={state.data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CardItem item={item} navigation={navigation} />
        )}
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
  },

  couter: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888"
  }
});

// State em props
const mapStateToProps = state => {
  const { userLogin } = state;
  return { userLogin };
};

export default connect(mapStateToProps)(UsersTechnologies);
