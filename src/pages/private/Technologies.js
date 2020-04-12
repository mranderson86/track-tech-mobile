/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { Checkbox, Text, List } from "react-native-paper";

import { useTheme, Portal, FAB } from "react-native-paper";
import { useIsFocused, RouteProp } from "@react-navigation/native";
import { useSafeArea } from "react-native-safe-area-context";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import gql from "graphql-tag";
import { createClientApollo } from "../../services/Apollo";

import Result from "../../components/Result/Result";
import ButtonConfirm from "../../components/Button/ButtonConfirm";

const TRACKING_MUTATION = gql`
  mutation createTracking($technologies: [Tracking!]) {
    createTracking(technologies: $technologies) {
      id
    }
  }
`;

// fetch all technologies
const TECHNOLOGIES_QUERY = gql`
  {
    allTechnologies {
      id
      technology
    }
  }
`;

// fetch only technologies available
const TECHNOLOGIES_AVAILABLE_QUERY = gql`
  {
    fetchTechnologiesAvailable {
      id
      technology
    }
  }
`;

// Renderiza cada tecnologia
function CardItem(props) {
  const theme = useTheme();

  const { item, handleCheck } = props;

  return (
    <List.Item
      style={{
        paddingHorizontal: "20%"
      }}
      title={item.technology}
      titleStyle={styles.title}
      left={props => (
        <Checkbox
          color={theme.colors.primary}
          status={item.value ? "checked" : "unchecked"}
          onPress={() => {
            handleCheck({ ...item, value: !item.value });
          }}
        />
      )}
    />
  );
}

// Tela Lista de Projetos
function Technologies(props) {
  const { userLogin, navigation, route } = props;
  const { token, user } = userLogin;

  // const [technologies, setTechnologies] = useState([]);
  // const [show, setShow] = useState(true);
  // const [error, setError] = useState(false);

  const [state, setState] = useState({
    technologies: [],
    show: true,
    error: false
  });

  const theme = useTheme();
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();

  let icon = "playlist-check";

  // carrega a lista das etapas
  useEffect(() => {
    Load();
  }, []);

  // consulta a lista de tecnologias
  async function Load() {
    try {
      const client = createClientApollo(token);

      // consulta tecnologias ()
      const response = await client.query({
        query: TECHNOLOGIES_AVAILABLE_QUERY
      });

      const { fetchTechnologiesAvailable } = response.data;

      if (fetchTechnologiesAvailable) {
        const techs = fetchTechnologiesAvailable.map(tech => {
          return {
            ...tech,
            technology_id: tech.id,
            value: false
          };
        });

        // setTechnologies(techs);
        setState({ ...state, technologies: techs, show: false });
      } else {
        alert("Não hã tecnologias disponíveis");

        // setTechnologies([]);
        setState({ ...state, technologies: [], show: false });
      }

      // setShow(false);
    } catch (err) {
      alert(err);
    }
  }

  function handleCheck(tech) {
    const techs = state.technologies.map(t => {
      if (t.technology_id === tech.technology_id) {
        return {
          ...t,
          value: tech.value
        };
      }

      return { ...t };
    });

    // atualiza lista de tecnologias
    // setTechnologies([...techs]);
    setState({ ...state, technologies: techs });
  }

  async function handleSubmit() {
    try {
      // setShow(true);
      setState({ ...state, show: true });

      const data = state.technologies
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

        if (response) {
          await Load();

          alert("Tracking Concluído !");
        }
      }

      // setShow(false);
      setState({ ...state, show: false });
    } catch (err) {
      alert(err);

      // setError(true);
      setState({ ...state, error: true });
    }
  }

  if (state.show && state.error) {
    return <Result type="error" />;
  }

  if (state.show && !state.error) {
    return <Result type="await" />;
  }

  // Mostrar botão confirmar
  let showSubmit = false;

  state.technologies.map(e => {
    if (e.value) showSubmit = true;
  });

  //  Renderiza lista de tecnologias
  return (
    <View style={styles.container}>
      <FlatList
        data={state.technologies}
        keyExtractor={item => item.technology_id.toString()}
        renderItem={({ item }) => (
          <CardItem item={item} handleCheck={handleCheck} />
        )}
      />

      <FAB
        disabled={!showSubmit}
        visible={isFocused}
        icon={icon}
        style={{
          position: "absolute",
          bottom: safeArea.bottom + 65,
          right: 16
        }}
        color="white"
        theme={{
          colors: {
            accent: theme.colors.primary
          }
        }}
        onPress={() => handleSubmit()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  cardContainer: {
    // alinha no eixo horizontal
    flexDirection: "row",
    width: "100%",
    borderRadius: 4
  },

  title: {
    fontWeight: "bold"
  },

  buttonSaveContainer: {
    alignItems: "center",
    marginTop: "5%",
    marginBottom: "5%"
  }
});

// State em props
const mapStateToProps = state => {
  const { userLogin } = state;
  return { userLogin };
};

export default connect(mapStateToProps)(Technologies);
