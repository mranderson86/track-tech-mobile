/* eslint-disable prettier/prettier */
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { UserAction } from "../../store/Users/userAction";

// Tela Home / Bem Vindo
function Home(props) {
  const { navigation, UserAction } = props;
  const { userLogin } = props;
  const { user } = userLogin;

  // Carrega a tela de cadastro de uma nova etapa
  function ExitApp() {
    UserAction({
      authenticate: false,
      user: {},
      token: ""
    });
  }

  //  Renderiza cada etapa da lista de Etapa
  return (
    <BottomTab />
    // <View style={styles.container}>
    //   <View style={styles.userContainer}>
    //     <View style={styles.cardItems}>
    //       <View style={styles.cardItemsValueLabel}>
    //         <Text style={styles.cardItemLabel}>Bem Vindo,</Text>
    //         <Text style={styles.cardItemValue}>{user.username}</Text>
    //       </View>

    //       <Text style={styles.cardItemLabel}>Sair ? </Text>
    //       <TouchableOpacity style={styles.buttonSave} onPress={() => ExitApp()}>
    //         <Feather name="log-out" size={30} color="#1FB6FF" />
    //       </TouchableOpacity>
    //     </View>
    //   </View>

    //   <TouchableOpacity
    //     activeOpacity={0.9}
    //     style={styles.cardContainer}
    //     onPress={() => {
    //       navigation.navigate("Technologies", { reload: false });
    //     }}
    //   >
    //     <View style={styles.cardItems}>
    //       <View style={styles.cardItemsValueLabel}>
    //         <Text style={styles.cardItemValue}>
    //           Fazer Check-In em Tecnologias
    //         </Text>
    //       </View>

    //       <Feather name="chevron-right" size={30} color="#1FB6FF" />
    //     </View>
    //   </TouchableOpacity>

    //   <TouchableOpacity
    //     activeOpacity={0.9}
    //     style={styles.cardContainer}
    //     onPress={() => {
    //       navigation.navigate("UsersTechnologies", { reload: false });
    //     }}
    //   >
    //     <View style={styles.cardItems}>
    //       <View style={styles.cardItemsValueLabel}>
    //         <Text style={styles.cardItemValue}>Usuários por Tecnologias</Text>
    //       </View>

    //       <Feather name="chevron-right" size={30} color="#1FB6FF" />
    //     </View>
    //   </TouchableOpacity>

    //   <TouchableOpacity
    //     activeOpacity={0.9}
    //     style={styles.cardContainer}
    //     onPress={() => {
    //       navigation.navigate("TechnologiesUsers", { reload: false });
    //     }}
    //   >
    //     <View style={styles.cardItems}>
    //       <View style={styles.cardItemsValueLabel}>
    //         <Text style={styles.cardItemValue}>Tecnologias por Usuário</Text>
    //       </View>

    //       <Feather name="chevron-right" size={30} color="#1FB6FF" />
    //     </View>
    //   </TouchableOpacity>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E5E9F2"
  },

  userContainer: {
    width: "100%",
    height: "20%",
    padding: "5%"
  },

  cardContainer: {
    // alinha no eixo horizontal
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    margin: "1%",
    width: "95%",
    height: "20%",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2
  },

  cardItems: {
    flexDirection: "row",
    width: "95%",
    alignItems: "center"
  },

  cardItemsValueLabel: {
    flexDirection: "column",
    width: "80%"
  },

  cardItemLabel: {
    color: "#888",
    paddingTop: "1%",
    paddingBottom: "1%"
  },

  cardItemValue: {
    paddingLeft: "5%",
    paddingRight: "10%",
    paddingTop: "1%",
    paddingBottom: "1%",
    fontWeight: "bold",
    fontSize: 16
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
