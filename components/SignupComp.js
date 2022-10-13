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
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { BottomSheet } from "react-native-btr";

import { CheckBox, Icon } from "react-native-elements";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";

const win = Dimensions.get("window");

function SignupComp({ navigation, setScreenToShow, setDisplayMsg, setVisible, goto }) {
    const [text, onChangeText] = useState("");
    const [password, onChangePass] = useState("");
    const [street, onChangeStreet] = useState("");
    const [check1, setCheck1] = useState(false);
    const [zipC, onChangeZipC] = useState("");
    const [emailSign, onChangeEmailSign] = useState("");
    const [passSign, onChangePassSign] = useState("");
    const [cpassSign, onChangeCPassSign] = useState("");
    const [dName, onChangeDname] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [manuData, setManuData] = useState([]);
    const [handleCheck, setHandleCheck] = useState(false);
    const [checkData, setCheckData] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    console.log(checkData);
    useEffect(async () => {
        if ((await AsyncStorage.getItem("user")) !== null || undefined) {
            goto();
        }
        getManuData();
        console.log(await AsyncStorage.getItem("user"));
    }, []);
    const toggleBottomNavigationView3 = () => {
        // toggleBottomNavigationView()
        setVisible3(!visible3);
    };
    const getManuData = async () => {
        await axios.get("https://www.dealstryker.com/manu").then((res) => {
            for (let name of res.data) {
                let dataInObj = Object.assign({ name });
                manuData.push(dataInObj);
            }
            setManuData(manuData);
            console.clear();
        });
    };
    function handleCheckboxmanu(item, i) {
        // const newVal = [];
        // newVal.push(item);

        // setCheckData([...checkData, newVal]);
        const newVal = [];
        newVal.push(item);

        setCheckData([...checkData, item]);
        // toggleBottomNavigationView3();
        // if (checkData.includes(item, i)) {
        //     setHandleCheck(!handleCheck);
        // } else {
        //     setHandleCheck(handleCheck);
        // }
        // setHandleCheck(!handleCheck);
    }
    function handleCheckbox(val) {
        setCheck1(!check1);
    }
    const renderItem2 = ({ item, i }) => (
        <View style={styles.addUserWrap}>
            <View style={styles.userWrapInn}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "row" }}>
                        <CheckBox
                            title=""
                            center
                            textStyle={{
                                color: "gray",
                                fontWeight: "normal",
                                fontSize: win.width / 38,
                            }}
                            containerStyle={{ borderWidth: 0, backgroundColor: "white" }}
                            size={win.height / 40}
                            checked={handleCheck}
                            onPress={() => handleCheckboxmanu(item.name, i)}
                        />
                    </View>
                    {/* <Image source={avatarImg2} /> */}
                    <View style={{ justifyContent: "center", marginLeft: win.width / 40 }}>
                        <Text style={{ fontSize: win.height / 50, color: "#0F3749" }}>{item.name}</Text>
                        <Text style={{ fontSize: win.height / 50, color: "lightgray" }}>{item.role}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
    async function signupDealer() {
        const bodySign = {
            user: {
                email: emailSign.trim().toLowerCase().toString(),
                password: passSign.trim().toString(),
                role: "dealer",
                name: dName.toUpperCase(),
                zip: zipC.toString(),
                manufacturers: checkData,
            },
        };
        console.log("body signup", bodySign);
        setIsLoading(true);
        if (emailSign !== "" && passSign !== "" && dName !== "" && zipC !== "" && checkData.length !== 0 && check1) {
            try {
                let token;
                let dealerData;

                await axios.post(`${"https://app.dealstryker.com/api/users/registerDealer"}`, bodySign).then((res) => {
                    console.log("start----------------", res, "----------------end");

                    token = JSON.stringify(res?.data?.user?.token);
                    dealerData = JSON.stringify(res?.data);
                    setIsLoading(false);
                });

                await AsyncStorage.setItem("token", token);
                await AsyncStorage.setItem("data", dealerData);
                goto();
            } catch (err) {
                console.log(err);
                setIsLoading(false);
                setVisible(true);
                setDisplayMsg(err.message);
            }
        } else {
            setDisplayMsg("Fill all feilds");
        }
    }
    return (
        <View style={styles.signForm}>
            <View style={styles.inputWrap}>
                <TextInput onChangeText={onChangeDname} placeholder="Dealership Name" value={dName} style={styles.input} />
                <FontAwesome name="building" size={win.width / 18} color="#0F3749" />
            </View>

            <View style={styles.inputWrap}>
                <Pressable
                    onPress={() => setVisible3(!visible3)}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <Text style={{ fontSize: win.height / 50, color: "grey" }}>{` ${checkData.join(", ")}  `}</Text>

                    <MaterialCommunityIcons name="car-sports" size={win.width / 16} color="#0F3749" />
                </Pressable>
            </View>

            <View style={styles.inputWrap}>
                <TextInput onChangeText={onChangeStreet} placeholder="Street Address" value={street} style={styles.input} />
                <Entypo name="address" size={win.width / 18} color="#0F3749" />
            </View>

            <View style={styles.inputWrap}>
                <TextInput onChangeText={onChangeZipC} placeholder="Zip Code" value={zipC} style={styles.input} />
                <Entypo name="location-pin" size={win.width / 18} color="#0F3749" />
            </View>

            <View style={styles.inputWrap}>
                <TextInput onChangeText={onChangeEmailSign} placeholder="Email" value={emailSign} style={styles.input} />

                <MaterialIcons name="email" size={win.width / 18} color="#0F3749" />
            </View>

            <View style={styles.inputWrap}>
                {showPassword ? (
                    <>
                        <TextInput onChangeText={onChangePassSign} placeholder="Password" value={passSign} style={styles.input} />
                        <TouchableOpacity onPress={() => setShowPassword(false)}>
                            <Entypo name="eye-with-line" size={win.width / 18} color="#0F3749" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TextInput
                            onChangeText={onChangePassSign}
                            placeholder="Password"
                            value={passSign}
                            style={styles.input}
                            secureTextEntry={true}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(true)}>
                            <Entypo name="eye" size={win.width / 18} color="#0F3749" />
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <View style={styles.inputWrap}>
                {showPassword ? (
                    <>
                        <TextInput onChangeText={onChangeCPassSign} placeholder="Confirm password" value={cpassSign} style={styles.input} />
                        <TouchableOpacity onPress={() => setShowPassword(false)}>
                            <Entypo name="eye-with-line" size={win.width / 18} color="#0F3749" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TextInput
                            onChangeText={onChangeCPassSign}
                            placeholder="Confirm password"
                            value={cpassSign}
                            style={styles.input}
                            secureTextEntry={true}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(true)}>
                            <Entypo name="eye" size={win.width / 18} color="#0F3749" />
                        </TouchableOpacity>
                    </>
                )}
            </View>
            <View style={styles.agreeBox}>
                <CheckBox
                    title="By signing up, i agree that i have read and accepted the Terms and Services to login now"
                    center
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    textStyle={{
                        color: "gray",
                        fontWeight: "normal",
                        fontSize: win.width / 38,
                    }}
                    containerStyle={{ borderWidth: 0, backgroundColor: "white" }}
                    size={win.height / 40}
                    checked={check1}
                    onPress={() => handleCheckbox("check1")}
                />
            </View>
            <Pressable style={styles.loginBtn} onPress={signupDealer}>
                {isLoading === false && <Text style={styles.loginText}>Signup</Text>}
                {isLoading && <ActivityIndicator size="small" color="white" style={{ marginLeft: win.width / 50 }} />}
            </Pressable>
            <Pressable onPress={() => setScreenToShow("login")} style={styles.already}>
                <Text style={styles.createAcc}>
                    Already Have an Account? <Text style={styles.createAccInner}>Login</Text>
                </Text>
            </Pressable>
            <View style={styles.container3}>
                <BottomSheet
                    visible={visible3}
                    onBackButtonPress={toggleBottomNavigationView3}
                    onBackdropPress={toggleBottomNavigationView3}
                >
                    <View style={styles.bottomNavigationView3}>
                        <View
                            style={{
                                flex: 1,

                                width: win.width,
                            }}
                        >
                            <View style={styles.userListWrap}>
                                <FlatList numColumns={1} data={manuData} renderItem={renderItem2} keyExtractor={(item, i) => i} />
                            </View>
                        </View>
                    </View>
                </BottomSheet>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    signForm: {
        // flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        // position: "absolute",
        // top: "20%",
        height: win.height / 1.5,
        width: "80%",
        backgroundColor: "white",
        opacity: 1,
        borderRadius: 10,
        zIndex: 1000,
        // marginBottom: win.height / 200,
        marginTop: win.height / 20,
        paddingVertical: win.height / 80,
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

    agreeBox: {
        // backgroundColor:"crimson",
        paddingHorizontal: win.width / 50,
    },
    createAcc: {
        color: "gray",
        fontSize: win.height / 60,
    },

    createAccInner: {
        color: "#1F9DD9",
        fontWeight: "bold",
    },
    container3: {
        flex: 1,
        margin: 2,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    bottomNavigationView3: {
        backgroundColor: "white",
        width: "100%",
        height: win.height / 2.3,
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: "white",
    },
    addUserWrap: {
        marginHorizontal: win.width / 20,
        marginVertical: win.height / 40,
    },
    already: {
        marginTop: win.height / 80,
    },
});

export default SignupComp;
