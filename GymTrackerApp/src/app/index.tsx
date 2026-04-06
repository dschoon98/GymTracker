import { Redirect } from "expo-router";

export default function Index() {
  if (!__DEV__) {
    console.log = () => { };
    console.debug = () => { };
    console.warn = () => { };
    console.error = () => { };
  }
  return <Redirect href="/(tabs)/home" />;
}