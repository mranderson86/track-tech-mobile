import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import Icon from "@expo/vector-icons/Feather";

import { Input } from "react-native-elements";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Result from "../../components/Result/Result";

import api from "../../services/Api";
import { UserAction } from "../../store/Users/userAction";

// Tela de Login / Autenticação do usuário
function Register({ UserAction }) {
  const [state, setState] = useState({
    data: { username: "", email: "", password: "", repassword: "" },
    show: false,
    error: false
  });

  // Envia usuário e senha para autenticação
  async function submitLogin() {
    try {
      if (state.error) setState({ ...state, error: false });

      console.log(state.data);

      return;

      if (state.data.email === "") {
        return;
      }

      if (state.data.password === "") {
        return;
      }

      setState({ ...state, show: true });

      const { data } = state;

      const response = await api.post("/users", data);

      const { token } = response.data;

      if (token) {
        try {
          UserAction({
            authenticate: true,
            token,
            user
          });
        } catch (err) {
          console.log("login(user) ", err);

          setShow(false);
          setError(true);
        }
      } else {
        setShow(false);
      }
    } catch (err) {
      alert(err);

      setShow(false);
      setError(true);
    }
  }

  if (state.show) {
    return <Result type="await" />;
  }

  //  Renderiza cada etapa da lista de Etapa
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Input
            label="Nome"
            textContentType="emailAddress"
            leftIcon={<Icon name="user" size={24} color="#999" />}
            value={state.username}
            placeholder="Digite seu nome"
            onChangeText={val => setState({ ...state, username: val })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="E-mail"
            textContentType="emailAddress"
            leftIcon={<Icon name="mail" size={24} color="#999" />}
            value={state.email}
            placeholder="Digite seu usuário"
            onChangeText={val => setState({ ...state, email: val })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Senha"
            secureTextEntry
            textContentType="password"
            leftIcon={<Icon name="lock" size={24} color="#999" />}
            value={state.password}
            placeholder="Informe sua Senha"
            onChangeText={val => setState({ ...state, password: val })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Confirmar Senha"
            secureTextEntry
            textContentType="password"
            leftIcon={<Icon name="lock" size={24} color="#999" />}
            value={state.password}
            placeholder="Informe sua Senha"
            onChangeText={val => setState({ ...state, repassword: val })}
          />
        </View>

        {state.error && (
          <View>
            <Text style={{ color: "#FF4949", textAlign: "center" }}>
              Usuário e/ou Senha incorreto !
            </Text>
          </View>
        )}

        <View style={styles.buttonLoginContainer}>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={() => submitLogin()}
          >
            <Text style={styles.labelButtonLogin}>Cadastrar</Text>
            <Icon name="chevron-right" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const BgColor = "#FF4949"; // "#F7F7F7"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: BgColor
  },

  formContainer: {
    backgroundColor: "#FFF",
    width: "95%",
    marginTop: "5%",
    borderRadius: 10
  },

  inputContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
    paddingTop: "4%",
    paddingBottom: "4%"
  },

  label: {
    color: "#666"
  },

  input: {
    borderBottomColor: "#888",
    borderBottomWidth: 1,
    height: 40
  },

  buttonLoginContainer: {
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

  labelButtonLogin: {
    color: "#FFF",
    fontWeight: "bold",
    width: "85%",
    paddingLeft: "10%",
    textAlign: "center"
  }
});

// Action do userReducer em props
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      UserAction
    },
    dispatch
  );

export default connect(mapDispatchToProps)(Register);
