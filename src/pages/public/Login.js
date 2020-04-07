import React, { useState, useEffect } from "react";
import {
  Text,
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

import Icon from "@expo/vector-icons/MaterialIcons";
import { Input, Button } from "react-native-elements";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Formik } from "formik";
import * as Yup from "yup";
import { Query, Mutation } from "react-apollo";
import { useMutation, useQuery } from "react-apollo";
import gql from "graphql-tag";

import Result from "../../components/Result/Result";

import api from "../../services/Api";
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

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      // const response = await client.query({
      //   query: gql`
      //     {
      //       allUsers {
      //         id
      //         username
      //         email
      //       }
      //     }
      //   `
      // });

      console.log(response);
    }

    // load();
  }, []);

  // Envia usuário e senha para autenticação
  async function submitLogin({ values, setSubmitting }) {
    try {
      if (error) setError(false);

      const { email, password } = values;

      const { data } = await loginMutation({
        variables: values
      });

      if (data) {
        const token = data.login;
        const authenticate = true;

        const client = createClientApollo(token);

        // consulta usuário (?)
        // const user = await useQuery(USER_QUERY);
        const response = await client.query({
          query: USER_QUERY
        });

        const { currentUser } = response.data;

        if (currentUser) {
          const user = currentUser;

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

      // const response = await client.mutate({
      //   mutation: gql`
      //     mutation($email: String!, $password: String!) {
      //       login(objects: [{ email: $email, password: $password }])
      //     }
      //   `,
      //   variables: {
      //     email,
      //     password
      //   }
      // });

      //const { token } = response.data;
      // if (token) {
      //   try {
      //     const res = await api.get(`users/profile`, {
      //       headers: {
      //         authorization: `Bearer ${token}`
      //       }
      //     });

      //     const user = res.data;

      //     // altera o estado do usuário
      //     UserAction({
      //       authenticate: true,
      //       token,
      //       user
      //     });
      //   } catch (err) {
      //     alert(err);
      //   }
      // } else {
      //   setShow(false);
      // }
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
          enabled={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Input
                name="email"
                label="E-mail"
                textContentType="emailAddress"
                leftIcon={<Icon name="email" size={24} color="#999" />}
                value={props.values.email}
                onBlur={props.handleBlur("email")}
                onChangeText={props.handleChange("email")}
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
                onBlur={props.handleBlur("password")}
                onChangeText={props.handleChange("password")}
                errorStyle={styles.error}
                errorMessage={props.touched.password && props.errors.password}
                inputStyle={{ paddingLeft: 5 }}
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

            {/* <Mutation
              mutation={LOGIN_MUTATION}
              variables={{
                email: props.values.email,
                password: props.values.password
              }}
              onCompleted={response => {
                console.log(response);
              }}
              onError={error => {
                alert(error);
              }}
            >
              {postLogin => (
                <Button
                  containerStyle={styles.buttonLoginContainer}
                  buttonStyle={styles.buttonSave}
                  titleStyle={styles.labelButtonLogin}
                  icon={<Icon name="chevron-right" size={30} color="white" />}
                  iconRight
                  title="Entrar"
                  onPress={postLogin}
                  // **disabled={!props.isValid || props.isSubmitting}
                  loading={props.isSubmitting}
                />
              )}
            </Mutation> */}

            <View style={styles.register}>
              <Text style={styles.labelNoRegister}>Não tem cadastro ?</Text>
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.labelRegister}>Cadastre-se</Text>
              </TouchableWithoutFeedback>
              <Icon name="chevron-right" size={30} color={BgColor} />
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </Formik>
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
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    justifyContent: "space-around"
  },

  labelNoRegister: {
    color: "#666",
    fontSize: 18
  },

  labelRegister: {
    color: BgColor,
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
// export default Login;
