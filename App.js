import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
// import SplashScreen from "./screens/SplashScreen";
// import LoginScreen from "./screens/LoginScreen";
import AuthStack from "./stacks/AuthStack";
import HomeStack from "./stacks/HomeStack";

const Stack = createNativeStackNavigator();
const StackLogin = createNativeStackNavigator();
import { store } from "./store";
import { Provider } from "react-redux";

function App() {
    const appState = useRef(AppState.currentState);
    const [appStatevisible, setAppStateVisible] = useState(appState.current);
    useEffect(() => {
        AppState.addEventListener("change", handleApp);
        return () => {
            AppState.removeEventListener("change", handleApp);
        };
    }, []);

    const handleApp = (nextAppState) => {
        if (appState.current.match(/inactive|background/) && nextAppState === "active") {
            console.log("app has coe to the foreground");
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        // console.log("App State:", appState.current);
        // disconnect();
    };

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="authstack" component={AuthStack} />
                    <Stack.Screen name="homestack" component={HomeStack} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

export default App;
