/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import { CheckBox } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

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

  return (
    <CheckBox
      containerStyle={styles.cardContainer}
      title={item.technology}
      checked={item.value}
      onPress={() => {
        handleCheck({ ...item, value: !item.value });
      }}
    />
  );
}

// Tela Lista de Projetos
function ProjectsList(props) {
  const { userLogin, ProjectCurrentAction, navigation, route } = props;
  const { token, user } = userLogin;

  const { reload } = route.params;

  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  // carrega a lista das etapas
  useEffect(() => {
    Load();
  }, [navigation, reload]);

  // consulta a lista de projetos
  async function Load() {
    try {
      setShow(true);

      const response = await api.get(`/technologies`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      const { data } = response;

      if (data) {
        const techs = data.map(tech => {
          return {
            ...tech,
            technology_id: tech.id,
            value: false
          };
        });

        setProjects(techs);
      } else {
        setProjects([]);
      }

      setShow(false);
    } catch (err) {
      console.log("load ", err);
    }
  }

  function handleCheck(tech) {
    const techs = projects.map(t => {
      if (t.technology_id === tech.technology_id) {
        return {
          ...t,
          value: tech.value
        };
      }

      return { ...t };
    });

    // atualiza lista de tecnologias
    setProjects([...techs]);
  }

  async function handleSubmit() {
    try {
      const data = projects.filter(t => t.value === true);

      console.log(data);

      setShow(true);

      if (data.length !== 0) {
        const response = await api.post("/checkins", data, {
          headers: {
            authorization: `Bearer ${token}`
          }
        });
      }

      setShow(false);
    } catch (err) {
      console.log(err);

      setError(true);
    }
  }

  if (show && error) {
    return <Result type="error" />;
  }

  if (show && !error) {
    return <Result type="await" />;
  }

  let showSubmit = false;

  projects.map(e => {
    if (e.value) showSubmit = true;
  });

  //  Renderiza lista de projetos
  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={item => item.technology_id.toString()}
        renderItem={({ item }) => (
          <CardItem item={item} handleCheck={handleCheck} />
        )}
      />

      {showSubmit && (
        <View style={styles.buttonSaveContainer}>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={() => handleSubmit()}
          >
            <MaterialIcons name="check" size={30} color="#FFF" />
            <Text style={styles.labelButtonSave}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E9F2"
    //backgroundColor: "#fff"
  },

  cardContainer: {
    // alinha no eixo horizontal
    backgroundColor: "#fff",
    borderRadius: 4
  },

  buttonSaveContainer: {
    alignItems: "center",
    marginTop: "5%",
    marginBottom: "5%"
  },

  buttonSave: {
    width: 200,
    height: 40,
    backgroundColor: "#1FB6FF",
    flexDirection: "row",
    alignItems: "center"
  },

  labelButtonSave: {
    color: "#FFF",
    fontWeight: "bold",
    width: "80%",
    paddingLeft: "30%"
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsList);
