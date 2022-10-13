import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Pressable,
    FlatList,
    Dimensions,
    Animated,
    KeyboardAvoidingView,
    ActivityIndicator,
    Input,
    Picker,
    TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

import { Entypo } from "@expo/vector-icons";

const win = Dimensions.get("window");

function LoginComp({ setScreenToShow, navigation, setDisplayMsg, setVisible, goto }) {
    const [text, onChangeText] = useState("ceriyo1201@offsala.com "); // ceriyo1201@offsala.com
    const [password, onChangePass] = useState("Ceriyo1201@"); // Ceriyo1201@
    const [checkAnime, setCheckAnime] = useState(false);
    const [forSign, setForSign] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function loginDealer() {
        if (text !== "" && password !== "") {
            console.log(text, password);
            var checkPattern = "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$";
            setIsLoading(true);
            try {
                var bodyLog = {
                    user: {
                        email: text.trim().toLowerCase().toString(),
                        password: password.trim().toString(),
                    },
                };

                let res = await api.post(`/users/login`, bodyLog);

                await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
                // let token = JSON.stringify(res?.data?.user?.token);
                // await AsyncStorage.setItem("token", token);
                // const dealerData = JSON.stringify(res?.data?.user);
                // await AsyncStorage.setItem("data", dealerData);
                console.log("boooooooooooooom", res.data.user.role);
                if (res) {
                    setIsLoading(false);
                    goto();
                } else {
                    setDisplayMsg("Dealer account not found");
                    setIsLoading(false);
                }
            } catch (err) {
                console.log(err);
                setIsLoading(false);
                setVisible(true);
                setDisplayMsg(err.message);
            }
        } else {
            setVisible(true);
            setDisplayMsg("Please fill all feilds");
        }
    }
    return (
        <View style={styles.logForm}>
            <View style={styles.inputWrap}>
                <TextInput onChangeText={onChangeText} value={text} style={styles.input} placeholder="Enter Email" />

                <MaterialIcons name="email" size={win.width / 18} color="#0F3749" />
            </View>

            {showPassword ? (
                <View style={styles.inputWrap}>
                    <TextInput onChangeText={onChangePass} placeholder="Password" value={password} style={styles.input} />
                    <TouchableOpacity onPress={() => setShowPassword(false)}>
                        <Entypo name="eye-with-line" size={win.width / 18} color="#0F3749" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.inputWrap}>
                    <TextInput
                        onChangeText={onChangePass}
                        placeholder="Password"
                        value={password}
                        style={styles.input}
                        secureTextEntry={true}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(true)}>
                        <Entypo name="eye" size={win.width / 18} color="#0F3749" />
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.inpHeading}>
                <Text></Text>
                <Pressable onPress={() => setScreenToShow("forgetPassword")}>
                    <Text style={styles.forgetText}>Forgot Password?</Text>
                </Pressable>
            </View>
            <View style={styles.loginBtn}>
                <Pressable onPress={() => loginDealer()}>
                    {isLoading === false && <Text style={styles.loginText}>Login</Text>}
                    {isLoading && <ActivityIndicator size="small" color="white" style={{ marginLeft: win.width / 50 }} />}
                </Pressable>

                {/* <Pressable onPress={signupDealer}>
            <Text style={styles.loginText}>Signup</Text>
          </Pressable> */}
            </View>
            <Pressable onPress={() => setScreenToShow("signup")}>
                <Text style={styles.createAcc}>
                    Dont Have an Account? <Text style={styles.createAccInner}>Sign up</Text>
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    loginBtn: {
        backgroundColor: "rgba(31, 157, 217, 1)",
        width: "85%",
        height: win.height / 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    loginText: {
        color: "white",
        fontSize: win.height / 55,
    },
    loginTextFb: {
        marginLeft: 5,
        color: "white",
        fontSize: win.height / 58,
    },
    loginTextGo: {
        marginLeft: 5,
        color: "gray",
        fontSize: win.height / 58,
    },
    forgetText: {
        color: "rgba(31, 157, 217, 1)",
        fontSize: win.height / 62,
    },
    loginBtnFb: {
        backgroundColor: "rgba(80, 112, 169, 1)",
        width: "85%",
        height: "10%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderRadius: 10,
    },
    logForm: {
        // flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        // position: "absolute",
        // top: "20%",
        height: win.height / 2.5,
        width: "80%",
        backgroundColor: "white",
        opacity: 1,
        borderRadius: 10,
        zIndex: 1000,
        marginBottom: win.height / 8,
    },
    inpHeading: {
        display: "flex",
        justifyContent: "space-between",

        width: "85%",
        flexDirection: "row",
    },

    loginBtnGoogle: {
        backgroundColor: "white",
        width: "85%",
        height: "10%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderRadius: 10,
        // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: "lightgray",
    },
    inputWrapF: {
        display: "flex",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
        alignItems: "center",
    },
    inputF: {
        height: 40,
        width: win.width / 1.5,
        fontSize: win.height / 50,
        color: "lightgray",
        // backgroundColor: "blue",
    },
    input: {
        // backgroundColor: "blue",
        height: 40,
        width: "90%",
        fontSize: win.height / 50,
        color: "gray",
    },
    inputWrap: {
        display: "flex",
        flexDirection: "row",
        height: "10%",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(205, 205, 205, 1)",

        justifyContent: "space-between",
        width: "85%",
        // backgroundColor: "pink",
    },
    createAcc: {
        color: "gray",
        fontSize: win.height / 60,
    },
    createAccInner: {
        color: "#1F9DD9",
        fontWeight: "bold",
    },
});
export default LoginComp;
