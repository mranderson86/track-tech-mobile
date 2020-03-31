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
import { CheckBox } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import api from "../../../services/Api";
import { UserAction } from "../../../store/Users/userAction";
import { ProjectCurrentAction } from "../../../store/Projects/projectAction";

import Result from "../../../components/Result/Result";

import ButtonConfirm from "../../../components/Button/ButtonConfirm";

import AuthRender from "../AuthRender";

// Renderiza cada tecnologia
function CardItem(props) {
  const { item, handleCheck } = props;
  const { users } = item;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.technologyContainer}>
        <MaterialCommunityIcons name="react" size={50} />
        <View style={styles.technology}>
          <Text style={styles.title}>{item.technology}</Text>
          <Text style={styles.couter}>{users.length || 0} Usuários</Text>
        </View>
      </View>
    </View>
  );
}

// Tela Lista de Projetos
function Technologies(props) {
  const { userLogin, ProjectCurrentAction, navigation, route } = props;
  const { token, user } = userLogin;

  const { reload } = route.params;

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
      const response = await api.get(`/technologies/users`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      const { data } = response;

      if (data) {
        setState({ ...state, show: false, data });
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
    flexDirection: "row"
  },

  technology: {
    fontSize: 25,
    fontWeight: "bold",
    marginHorizontal: "2%"
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
  const { userLogin, userProjects } = state;
  return { userLogin, userProjects };
};

// Action em props
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      UserAction,
      ProjectCurrentAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Technologies);
