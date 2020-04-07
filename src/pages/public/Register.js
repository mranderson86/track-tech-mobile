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

import { Input, Button } from "react-native-elements";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Formik } from "formik";
import * as Yup from "yup";

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

// Tela de Login / Autenticação do usuário
function Register(props) {
  const { UserAction } = props;

  const [state, setState] = useState({ enabledKeyboard: false });

  // Envia usuário e senha para autenticação
  async function submitRegister({ values, setSubmitting }) {
    try {
      const { username, email, password } = values;

      const user = {
        username,
        email,
        password
      };

      const response = await api.post("/users", user);

      const { data } = response;

      if (data) {
        try {
          const login = { email, password };
          const authentication = await api.post("/sessions", login);
          const { token } = authentication.data;

          if (token) {
            UserAction({
              authenticate: true,
              user,
              token
            });
          }
        } catch (err) {
          alert(`Token fail ! ${err}`);
        }
      } else {
        alert("Register not found");
      }
    } catch (err) {
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
          keyboardVerticalOffset={100}
          enabled={state.enabledKeyboard}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Input
                  name="username"
                  label="Nome"
                  textContentType="username"
                  leftIcon={<Icon name="user" size={24} color="#999" />}
                  value={props.values.username}
                  onChangeText={props.handleChange("username")}
                  onBlur={props.handleBlur("username")}
                  onFocus={() => setState({ ...state, enabledKeyboard: false })}
                  errorStyle={styles.error}
                  errorMessage={props.touched.username && props.errors.username}
                  inputStyle={{ paddingLeft: 5 }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  name="email"
                  label="E-mail"
                  textContentType="emailAddress"
                  leftIcon={<Icon name="mail" size={24} color="#999" />}
                  value={props.values.email}
                  onChangeText={props.handleChange("email")}
                  onBlur={props.handleBlur("email")}
                  onFocus={() => setState({ ...state, enabledKeyboard: false })}
                  errorStyle={styles.error}
                  errorMessage={props.touched.email && props.errors.email}
                  inputStyle={{ paddingLeft: 5 }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  name="password"
                  label="Senha"
                  secureTextEntry
                  textContentType="password"
                  leftIcon={<Icon name="lock" size={24} color="#999" />}
                  value={props.values.password}
                  onChangeText={props.handleChange("password")}
                  onBlur={props.handleBlur("password")}
                  onFocus={() => setState({ ...state, enabledKeyboard: true })}
                  errorStyle={styles.error}
                  errorMessage={props.touched.password && props.errors.password}
                  inputStyle={{ paddingLeft: 5 }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  name="repassword"
                  label="Confirmar Senha"
                  secureTextEntry
                  textContentType="password"
                  leftIcon={<Icon name="lock" size={24} color="#999" />}
                  value={props.values.repassword}
                  onChangeText={props.handleChange("repassword")}
                  onBlur={props.handleBlur("repassword")}
                  onFocus={() => setState({ ...state, enabledKeyboard: true })}
                  errorStyle={styles.error}
                  errorMessage={
                    props.touched.repassword && props.errors.repassword
                  }
                  inputStyle={{ paddingLeft: 5 }}
                />
              </View>

              <Button
                containerStyle={styles.buttonLoginContainer}
                buttonStyle={styles.buttonSave}
                titleStyle={styles.labelButtonLogin}
                icon={<Icon name="chevron-right" size={30} color="white" />}
                iconRight
                title="Cadastrar"
                onPress={props.handleSubmit}
                // disabled={!props.isValid || props.isSubmitting}
                loading={props.isSubmitting}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

const BgColor = "#FF4949";

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

export default connect(null, mapDispatchToProps)(Register);
