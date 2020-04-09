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

import gql from "graphql-tag";
import { createClientApollo } from "../../../services/Apollo";

import { UserAction } from "../../../store/Users/userAction";
import Result from "../../../components/Result/Result";
import ButtonConfirm from "../../../components/Button/ButtonConfirm";
import AuthRender from "../AuthRender";

const TRACKING_MUTATION = gql`
  mutation createTracking($technologies: [Tracking!]) {
    createTracking(technologies: $technologies) {
      id
    }
  }
`;

const TECHNOLOGIES_QUERY = gql`
  {
    allTechnologies {
      id
      technology
    }
  }
`;

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
function Technologies(props) {
  const { userLogin, navigation, route } = props;
  const { token, user } = userLogin;

  // const { reload } = route.params;

  const [technologies, setTechnologies] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  // carrega a lista das etapas
  useEffect(() => {
    Load();
  }, []);

  // consulta a lista de tecnologias
  async function Load() {
    try {
      setShow(true);

      const client = createClientApollo(token);

      // consulta tecnologias ()
      const response = await client.query({
        query: TECHNOLOGIES_QUERY
      });

      const { allTechnologies } = response.data;

      if (allTechnologies) {
        const techs = allTechnologies.map(tech => {
          return {
            ...tech,
            technology_id: tech.id,
            value: false
          };
        });

        setTechnologies(techs);
      } else {
        setTechnologies([]);
      }

      setShow(false);
    } catch (err) {
      alert(err);
    }
  }

  function handleCheck(tech) {
    const techs = technologies.map(t => {
      if (t.technology_id === tech.technology_id) {
        return {
          ...t,
          value: tech.value
        };
      }

      return { ...t };
    });

    // atualiza lista de tecnologias
    setTechnologies([...techs]);
  }

  async function handleSubmit() {
    try {
      setShow(true);

      const data = technologies
        .filter(({ value }) => value === true)
        .map(({ technology_id }) => {
          return { technology_id };
        });

      if (data.length !== 0) {
        const client = createClientApollo(token);
        const response = await client.mutate({
          mutation: TRACKING_MUTATION,
          variables: {
            technologies: data
          }
        });

        console.log(response);
      }

      setShow(false);
    } catch (err) {
      alert(err);
      setError(true);
    }
  }

  if (show && error) {
    return <Result type="error" />;
  }

  if (show && !error) {
    return <Result type="await" />;
  }

  // Mostrar botão confirmar
  let showSubmit = false;

  technologies.map(e => {
    if (e.value) showSubmit = true;
  });

  //  Renderiza lista de tecnologias
  return (
    <View style={styles.container}>
      <FlatList
        data={technologies}
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

export default connect(mapStateToProps, mapDispatchToProps)(Technologies);
