import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Icon from "@expo/vector-icons/Feather";

import { Input } from "react-native-elements";
import { HelperText, TextInput, Button } from "react-native-paper";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Formik } from "formik";
import * as Yup from "yup";
import gql from "graphql-tag";
import { createClientApollo } from "../../services/Apollo";

import Result from "../../components/Result/Result";

import api from "../../services/Api";
import { UserAction } from "../../store/Users/userAction";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .label("Nome")
    .required("Por favor,Informe seu nome"),
  email: Yup.string()
    .label("E-mail")
    .email("Informe seu e-mail")
    .required("Por favor, informe seu e-mail"),
  password: Yup.string()
    .label("Senha")
    .required("Por favor,Informe sua senha")
    .min(3, "Senha deve ter no mínimo 3 digitos"),
  repassword: Yup.string()
    .label("Confirmar Senha")
    .min(3, "Senha deve ter no mínimo 3 digitos")
    .oneOf([Yup.ref("password"), null], "Senha não confere")
});

const CREATE_USER_MUTATION = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation postLogin($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

// Tela de Login / Autenticação do usuário
function Register(props) {
  const { UserAction } = props;

  const [state, setState] = useState({ enabledKeyboard: false });

  // Envia usuário e senha para autenticação
  async function submitRegister({ values, setSubmitting }) {
    try {
      const { username, email, password } = values;
      const client = createClientApollo();
      const response = await client.mutate({
        mutation: CREATE_USER_MUTATION,
        variables: {
          username,
          email,
          password
        }
      });

      const { createUser } = response.data;

      if (createUser) {
        try {
          const authentication = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: { email, password }
          });

          const { login } = authentication.data;

          if (login) {
            const token = login;
            const authenticate = true;
            const user = createUser;

            UserAction({
              authenticate,
              user,
              token
            });
          }
        } catch (err) {
          setSubmitting(false);
          alert(`Token fail ! ${err}`);
        }
      } else {
        setSubmitting(false);
        alert("Register not found");
      }
    } catch (err) {
      setSubmitting(false);
      alert(`Register fail ! ${err}`);
    }
  }

  //  Renderiza cadastro
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        username: "",
        email: "",
        password: "",
        repassword: ""
      }}
      onSubmit={(values, { props, setErrors, setSubmitting }) => {
        submitRegister({ values, setSubmitting });
      }}
    >
      {props => (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "android" ? "height" : "padding"}
          // keyboardVerticalOffset={100}
          // enabled={state.enabledKeyboard}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Nome"
                  value={props.values.username}
                  onChangeText={props.handleChange("username")}
                />
                <HelperText type="error" visible={props.touched.username}>
                  {props.touched.username && props.errors.username}
                </HelperText>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  label="E-mail"
                  value={props.values.email}
                  onChangeText={props.handleChange("email")}
                />
                <HelperText type="error" visible={props.touched.email}>
                  {props.touched.email && props.errors.email}
                </HelperText>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  secureTextEntry
                  textContentType="password"
                  label="Senha"
                  value={props.values.password}
                  onChangeText={props.handleChange("password")}
                />
                <HelperText type="error" visible={props.touched.password}>
                  {props.touched.password && props.errors.password}
                </HelperText>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  secureTextEntry
                  textContentType="password"
                  label="Confirmar Senha"
                  value={props.values.repassword}
                  onChangeText={props.handleChange("repassword")}
                />
                <HelperText type="error" visible={props.touched.repassword}>
                  {props.touched.repassword && props.errors.repassword}
                </HelperText>
              </View>

              <View style={styles.buttonLoginContainer}>
                <Button
                  contentStyle={{ padding: 25 }}
                  style={styles.buttonLogin}
                  labelStyle={styles.labelButtonLogin}
                  mode="contained"
                  onPress={props.handleSubmit}
                  loading={props.isSubmitting}
                  // disabled={!props.isValid || props.isSubmitting}
                >
                  Cadastrar
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

// const BgColor = "#FF4949";
const BgColor = "#FFF";

const styles = StyleSheet.create({
  error: {
    color: "#FF4949",
    fontSize: 18
  },

  container: {
    flex: 1,
    backgroundColor: BgColor
  },

  scroll: {
    flex: 1,
    backgroundColor: BgColor,
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center"
  },

  formContainer: {
    backgroundColor: "#FFF",
    width: "95%",
    marginTop: "1%",
    borderRadius: 10
  },

  inputContainer: {
    paddingLeft: "5%",
    paddingRight: "5%",
    paddingTop: "2%",
    paddingBottom: "4%"
  },

  label: {
    color: "#666"
  },

  buttonLoginContainer: {
    alignItems: "center",
    marginTop: "1%",
    marginBottom: "5%"
  },

  buttonLogin: {
    width: 200,
    height: 40,
    // backgroundColor: "#1FB6FF",
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

export default connect(null, mapDispatchToProps)(Register);
