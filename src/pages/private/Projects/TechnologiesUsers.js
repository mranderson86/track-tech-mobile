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
import { FontAwesome } from "@expo/vector-icons";

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
  const { technologies, username } = item;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.technologyContainer}>
        <FontAwesome name="user-circle" size={50} />
        <View style={styles.technology}>
          <Text style={styles.title}>{username}</Text>
          <Text style={styles.couter}>{technologies.length} Check-In</Text>

          <View>
            {technologies.map(tech => (
              <Text key={tech.id} style={styles.couter}>
                {tech.technology}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function TechnologiesUsers(props) {
  const { userLogin, ProjectCurrentAction, navigation, route } = props;
  const { token, user } = userLogin;

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
      const response = await api.get(`/users/technologies`, {
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

export default connect(mapStateToProps, mapDispatchToProps)(TechnologiesUsers);
