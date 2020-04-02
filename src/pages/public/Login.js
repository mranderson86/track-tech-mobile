import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import Icon from "@expo/vector-icons/MaterialIcons";
import { Input, Button } from "react-native-elements";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Formik } from "formik";
import * as Yup from "yup";

import Result from "../../components/Result/Result";

import api from "../../services/Api";
import { UserAction } from "../../store/Users/userAction";

// const logo = require('../../assets/gerenciArqui_logo.png');
// Form Validation
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label("E-mail")
    .email("Informe seu e-mail")
    .required("Por favor,Informe um e-mail válido"),
  password: Yup.string()
    .label("Senha")
    .required("Por favor,Informe sua senha")
    .min(3, "Senha deve ter no mínimo 3 digitos")
});

// Tela de Login / Autenticação do usuário
function Login({ UserAction }) {
  // const { navigation, login, UserAction } = props;

  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  // Envia usuário e senha para autenticação
  async function submitLogin(values) {
    try {
      if (error) setError(false);

      // setShow(true);

      const data = {
        email: values.email,
        password: values.password
      };

      const response = await api.post("/sessions", data);

      const { token } = response.data;

      if (token) {
        try {
          const res = await api.get(`users/profile`, {
            headers: {
              authorization: `Bearer ${token}`
            }
          });

          const user = res.data;

          // altera o estado do usuário
          UserAction({
            authenticate: true,
            token,
            user
          });
        } catch (err) {
          alert(err);

          // setShow(false);
          // setError(true);
        }
      } else {
        setShow(false);
      }
    } catch (err) {
      alert(err);

      // setShow(false);
      // setError(true);
    }
  }

  if (show) {
    return <Result type="await" />;
  }

  //  Renderiza cada etapa da lista de Etapa
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={values => {
          submitLogin(values);
        }}
        validationSchema={validationSchema}
      >
        {props => (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Input
                name="email"
                label="Usuário"
                textContentType="emailAddress"
                leftIcon={<Icon name="email" size={24} color="#999" />}
                value={props.values.email}
                placeholder="Digite seu usuário"
                onBlur={props.handleBlur("email")}
                onChangeText={props.handleChange("email")}
                errorStyle={styles.error}
                errorMessage={props.touched.email && props.errors.email}
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
                placeholder="Informe sua Senha"
                onBlur={props.handleBlur("password")}
                onChangeText={props.handleChange("password")}
                errorStyle={styles.error}
                errorMessage={props.touched.password && props.errors.password}
              />
            </View>

            <Button
              containerStyle={styles.buttonLoginContainer}
              buttonStyle={styles.buttonSave}
              titleStyle={styles.labelButtonLogin}
              icon={<Icon name="chevron-right" size={30} color="white" />}
              iconRight
              title="Entrar"
              onPress={props.handleSubmit}
              // **disabled={!props.isValid || props.isSubmitting}
              loading={props.isSubmitting}
            />
          </View>
        )}
      </Formik>

      <View style={styles.register}>
        <Text style={styles.labelNoRegister}>Não tem cadastro ?</Text>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.labelRegister}>Cadastre-se</Text>
        </TouchableWithoutFeedback>
        <Icon name="chevron-right" size={30} color="#333" />
      </View>
    </KeyboardAvoidingView>
  );
}

const BgColor = "#FF4949"; // "#F7F7F7"

const styles = StyleSheet.create({
  error: {
    color: "#FF4949",
    fontSize: 18
  },

  container: {
    flex: 1,
    justifyContent: "center",
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

  register: {
    flexDirection: "row",
    paddingHorizontal: "10%",
    paddingVertical: "2%",
    justifyContent: "space-around"
    //backgroundColor: "#000"
  },

  labelNoRegister: {
    color: "#666",
    fontSize: 18
  },

  labelRegister: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold"
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

// State do usuário em props
const mapStateToProps = state => {
  const login = state;
  return { login };
};

// Action do userReducer em props
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      UserAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Login);
