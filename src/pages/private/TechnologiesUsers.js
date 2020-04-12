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

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import gql from "graphql-tag";
import { createClientApollo } from "../../services/Apollo";

import { UserAction } from "../../store/Users/userAction";

import Result from "../../components/Result/Result";
import ButtonConfirm from "../../components/Button/ButtonConfirm";

const TECHNOLOGIES_USERS_QUERY = gql`
  {
    allUsers {
      id
      username
      email
      technologies {
        technology
      }
    }
  }
`;

// Renderiza cada tecnologia
function CardItem(props) {
  const { item, handleCheck } = props;
  const { technologies, username } = item;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.technologyContainer}>
        <View style={styles.technology}>
          <Text style={styles.title}>{username}</Text>
          <Text style={styles.counter}>{technologies.length} Tecnologias</Text>

          <View>
            {technologies.map(({ technology }, id) => (
              <Text key={id} style={styles.counter}>
                {technology}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function TechnologiesUsers(props) {
  const { userLogin, navigation, route } = props;
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
      const client = createClientApollo(token);

      // consulta tecnologias ()
      const response = await client.query({
        query: TECHNOLOGIES_USERS_QUERY
      });

      const { allUsers } = response.data;

      if (allUsers) {
        setState({
          ...state,
          show: false,
          data: allUsers.filter(({ technologies }) => technologies.length !== 0)
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

  counter: {
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

// Action em props
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      UserAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(TechnologiesUsers);
