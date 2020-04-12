import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {
  HelperText,
  TextInput,
  Button,
  Text,
  useTheme,
  withTheme
} from "react-native-paper";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Formik } from "formik";
import * as Yup from "yup";
import gql from "graphql-tag";

import Result from "../../components/Result/Result";
import { createClientApollo } from "../../services/Apollo";
import { UserAction } from "../../store/Users/userAction";

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

const LOGIN_MUTATION = gql`
  mutation postLogin($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const USER_QUERY = gql`
  {
    currentUser {
      id
      username
      email
    }
  }
`;

// Tela de Login / Autenticação do usuário
function Login(props) {
  const { UserAction } = props;
  const navigation = useNavigation();
  const theme = useTheme();

  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  // Envia usuário e senha para autenticação
  async function submitLogin({ values, setSubmitting }) {
    try {
      if (error) setError(false);

      const { email, password } = values;

      const client = createClientApollo();

      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: values
      });

      if (data) {
        const token = data.login;
        const client = createClientApollo(token);

        // consulta usuário (?)
        const response = await client.query({
          query: USER_QUERY
        });

        const { currentUser } = response.data;

        if (currentUser) {
          const authenticate = true;
          const user = currentUser;

          setSubmitting(false);

          // update state user
          UserAction({
            authenticate,
            token,
            user
          });
        }
      } else {
        setSubmitting(false);
        alert("Fail authenticate, try again");
      }
    } catch (err) {
      setSubmitting(false);
      alert(err);
    }
  }

  if (show) {
    return <Result type="await" />;
  }

  //  Renderiza cada etapa da lista de Etapa
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { props, setErrors, setSubmitting }) => {
        submitLogin({ values, setSubmitting });
      }}
    >
      {props => (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "android" ? "height" : "padding"}
          enabled={true}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                theme={theme}
                label="Email"
                value={props.values.email}
                onChangeText={props.handleChange("email")}
              />
              <HelperText type="error" visible={props.touched.email}>
                {props.touched.email && props.errors.email}
              </HelperText>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                theme={theme}
                textContentType="password"
                secureTextEntry
                label="Senha"
                value={props.values.password}
                onChangeText={props.handleChange("password")}
              />
              <HelperText type="error" visible={props.touched.password}>
                {props.touched.password && props.errors.password}
              </HelperText>
            </View>

            <View style={styles.buttonLoginContainer}>
              <Button
                theme={theme}
                contentStyle={{ padding: 25 }}
                style={styles.buttonLogin}
                labelStyle={styles.labelButtonLogin}
                mode="contained"
                onPress={props.handleSubmit}
                loading={props.isSubmitting}
                // disabled={!props.isValid || props.isSubmitting}
              >
                ENTRAR
              </Button>
            </View>

            <View style={styles.register}>
              <Text style={styles.labelNoRegister}>Não tem cadastro ?</Text>
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.labelRegister}>Cadastre-se</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

// const BgColor = "rgb(0, 153, 255)";
const BgColor = "#FFF";

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
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    justifyContent: "space-around"
  },

  labelNoRegister: {
    color: "#666",
    fontSize: 18
  },

  labelRegister: {
    // color: "#1FB6FF",
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
    marginTop: "1%",
    marginBottom: "5%"
  },

  buttonLogin: {
    width: 200,
    height: 40,
    flexDirection: "row",
    alignItems: "center"
  },

  labelButtonLogin: {
    color: "#FFF",
    fontWeight: "bold",
    width: "85%",
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

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Login));
// export default Login;
