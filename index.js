import { AppRegistry } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import App from "./App";
import { name as appName } from "./app.json";

export default function Main() {
  return <App />;
}

AppRegistry.registerComponent(appName, () => Main);
