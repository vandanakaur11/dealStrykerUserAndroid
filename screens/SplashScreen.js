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
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import splashBackImg from "../images/splashBackImg.png";
import DealStrykerLogo from "../images/DealStrykerLogo.png";
import carImg from "../images/carImg.png";
// import userIcon from "../images/userIcon.png";
// import eyeIcon from "../images/eyeIcon.png";
import facebookIcon from "../images/facebookIcon.png";
import googleIcon from "../images/googleIcon.png";
// import { TouchableOpacity } from "react-native-web";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { CheckBox, Icon } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomSheet } from "react-native-btr";
import { Snackbar } from "react-native-paper";
import api from "./../services/api";
const win = Dimensions.get("window");
import OtpForm from "../components/OtpForm";
import SignupComp from "../components/SignupComp";
import LoginComp from "../components/LoginComp";
import ResetPasswordComp from "../components/ResetPasswordComp";
import NewPasswordComp from "../components/NewPasswordComp";

function SplashScreen({ navigation }) {
    const [text, onChangeText] = useState("");
    const [password, onChangePass] = useState("");

    const [dName, onChangeDname] = useState("");
    const [manu, onChangeManu] = useState("");
    const [street, onChangeStreet] = useState("");
    const [zipC, onChangeZipC] = useState("");
    const [emailSign, onChangeEmailSign] = useState("");
    const [passSign, onChangePassSign] = useState("");
    const [cpassSign, onChangeCPassSign] = useState("");
    const [number, onChangeNumber] = useState(null);
    const [selectedUser, setSelectedUser] = useState("user");
    const [forSign, setForSign] = useState(true);
    const [forForget, setForForget] = useState(false);
    const [checkAnime, setCheckAnime] = useState(false);
    const [check1, setCheck1] = useState(false);

    const [manuData, setManuData] = useState([]);
    const [newManuData, setNewManuData] = useState([]);
    const [handleManuData, setHandleManuData] = useState(true);
    const [visible3, setVisible3] = useState(false);
    const [handleCheck, setHandleCheck] = useState(false);
    const [checkData, setCheckData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [displayMsg, setDisplayMsg] = useState("");
    const [screenToShow, setScreenToShow] = useState("login");
    const [otpCode, setOtpCode] = useState("");
    const [emailForReset, setEmailForReset] = useState("");

    useEffect(async () => {
        if ((await AsyncStorage.getItem("user")) !== null) {
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

    function goto(val) {
        // navigation.navigate("MainScreen");
        setCheckAnime(true);
        setTimeout(() => {
            navigation.navigate("HomeScreen");
        }, 1500);
        // alert(val);
    }

    const passwordChangedFunc = async () => {
        const bodyChangePass = {
            email: email.toLowerCase().toString(),
            token: await AsyncStorage.getItem("token"),
        };
        console.log(bodyChangePass);
        try {
            let res = await axios.post(`${"https://app.dealstryker.com/api/users/resetPasswordReq"}`, bodyChangePass);

            setForComfirm(true);
            console.log(res, "sdsds");
        } catch (error) {
            // alert(error.message);
            // setVisible(true);
            setDisplayMsg(error.message);
        }
    };

    function handleCheckbox(val) {
        setCheck1(!check1);
    }

    var leftValue = useState(new Animated.Value(win.width))[0];
    var formValue = useState(new Animated.Value(win.width * 2))[0];
    var logoValue = useState(new Animated.Value(win.height / 3))[0];
    function moveCar() {
        Animated.timing(leftValue, {
            toValue: !checkAnime ? win.width / 20 : win.width / 20 - win.width * 2,
            duration: 1500,
            useNativeDriver: false,
        }).start();
    }
    moveCar();
    function moveForm() {
        Animated.timing(formValue, {
            toValue: !checkAnime ? win.width / 90 : win.width / 90 - win.width * 2,
            duration: 1500,
            useNativeDriver: false,
        }).start();
    }
    moveForm();
    function moveLogo() {
        Animated.timing(logoValue, {
            toValue: !checkAnime ? win.height / 17 : win.height / 17 - win.width * 2,
            duration: 2000,
            useNativeDriver: false,
        }).start();
    }
    moveLogo();
    const signupDealer = async () => {
        setIsLoading(true);
        if (emailSign !== "" && passSign !== "" && dName !== "" && zipC !== "" && checkData !== []) {
            try {
                const bodySign = {
                    user: {
                        email: emailSign.trim().toLowerCase().toString(),
                        password: passSign.trim().toString(),
                        role: "dealer",
                        name: dName.trim().toUpperCase(),
                        zip: zipC.trim().toString(),
                        manufacturers: checkData,
                    },
                };
                let token;
                let dealerData;

                await api.post(`${"/users/registerDealer"}`, bodySign).then((res) => {
                    console.log("start----------------", res, "----------------end");

                    // token = JSON.stringify(res?.data?.user?.token);
                    // dealerData = JSON.stringify(res?.data);
                    setIsLoading(false);
                });

                await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
                goto();
            } catch (err) {
                console.log(err);

                setVisible(true);
                setDisplayMsg(err.message);
                setIsLoading(false);
            }
        } else {
            setVisible(true);
            setDisplayMsg("Please fill all feilds");
        }
    };
    async function loginDealer() {
        if (text !== "" && password !== "") {
            var checkPattern = "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$";
            setIsLoading(true);
            try {
                var bodyLog = {
                    user: {
                        email: text.trim().toLowerCase().toString(),
                        password: password.trim().toString(),
                    },
                };

                let res = awaitapi.post(`/users/login`, bodyLog);

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
    function handleCheckboxmanu(item, i) {
        const newVal = [];
        newVal.push(item);

        setCheckData([...checkData, newVal]);
        // if (checkData.includes(item, i)) {
        //     setHandleCheck(!handleCheck);
        // } else {
        //     setHandleCheck(handleCheck);
        // }
        // setHandleCheck(!handleCheck);
    }

    console.log(checkData);
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

    return (
        <View style={styles.container}>
            <Animated.View style={{ position: "absolute", top: logoValue }}>
                <View style={styles.imageMid}>
                    <Image source={DealStrykerLogo} resizeMode="contain" style={styles.imageStyling} />
                </View>
            </Animated.View>
            <Animated.View style={{ width: win.width / 0.99, alignItems: "center", marginLeft: formValue }}>
                {screenToShow === "login" && (
                    <LoginComp setScreenToShow={setScreenToShow} setDisplayMsg={setDisplayMsg} setVisible={setVisible} goto={goto} />
                )}
                {screenToShow === "signup" && (
                    <SignupComp setScreenToShow={setScreenToShow} setDisplayMsg={setDisplayMsg} setVisible={setVisible} goto={goto} />
                )}
                {screenToShow === "forgetPassword" && (
                    <ResetPasswordComp
                        setScreenToShow={setScreenToShow}
                        setDisplayMsg={setDisplayMsg}
                        setVisible={setVisible}
                        setEmailForReset={setEmailForReset}
                    />
                )}
                {screenToShow === "otpScreen" && (
                    <OtpForm
                        setScreenToShow={setScreenToShow}
                        setDisplayMsg={setDisplayMsg}
                        setVisible={setVisible}
                        setOtpCode={setOtpCode}
                        emailForReset={emailForReset}
                    />
                )}
                {screenToShow === "newPassword" && (
                    <NewPasswordComp
                        setScreenToShow={setScreenToShow}
                        setDisplayMsg={setDisplayMsg}
                        setVisible={setVisible}
                        otpCode={otpCode}
                        emailForReset={emailForReset}
                    />
                )}
                {/* {forSign && !forForget && (
                        <View style={styles.inputWrap}>
                            <TextInput onChangeText={onChangeText} value={text} style={styles.input} placeholder="Enter Email" />

                            <MaterialIcons name="email" size={win.width / 18} color="#0F3749" />
                        </View>
                    )}

                    {forSign && !forForget && (
                        <View style={styles.inputWrap}>
                            <TextInput
                                onChangeText={onChangePass}
                                placeholder="Enter your password"
                                value={password}
                                style={styles.input}
                                secureTextEntry={true}
                            />
                            <Entypo name="lock" size={win.width / 18} color="#0F3749" />
                        </View>
                    )}

                    {!forSign && !forForget && (
                        <View style={styles.inputWrap}>
                            <TextInput onChangeText={onChangeDname} placeholder="Dealership Name" value={dName} style={styles.input} />
                            <FontAwesome name="building" size={win.width / 18} color="#0F3749" />
                        </View>
                    )}
                    {!forSign && !forForget && (
                        <View style={styles.inputWrap}>
                            {console.log("manu", manuData.data, "manu")}
                            <Pressable
                                onPress={() => setVisible3(!visible3)}
                                style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}
                            >
                                <Text style={{ fontSize: win.height / 50, color: "gray" }}>Manufacturer</Text>

                                <MaterialCommunityIcons name="car-sports" size={win.width / 16} color="#0F3749" />
                            </Pressable>
                        </View>
                    )}
                    {!forSign && !forForget && (
                        <View style={styles.inputWrap}>
                            <TextInput onChangeText={onChangeStreet} placeholder="Street Address" value={street} style={styles.input} />
                            <Entypo name="address" size={win.width / 18} color="#0F3749" />
                        </View>
                    )}
                    {!forSign && !forForget && (
                        <View style={styles.inputWrap}>
                            <TextInput onChangeText={onChangeZipC} placeholder="Zip Code" value={zipC} style={styles.input} />
                            <Entypo name="location-pin" size={win.width / 18} color="#0F3749" />
                        </View>
                    )}
                    {!forSign && !forForget && (
                        <View style={styles.inputWrap}>
                            <TextInput onChangeText={onChangeEmailSign} placeholder="Email" value={emailSign} style={styles.input} />

                            <MaterialIcons name="email" size={win.width / 18} color="#0F3749" />
                        </View>
                    )}
                    {!forSign && !forForget && (
                        <View style={styles.inputWrap}>
                            <TextInput
                                onChangeText={onChangePassSign}
                                placeholder="Password"
                                secureTextEntry={true}
                                value={passSign}
                                style={styles.input}
                            />
                            <Entypo name="lock" size={win.width / 18} color="#0F3749" />
                        </View>
                    )}
                    {!forSign && !forForget && (
                        <View style={styles.inputWrap}>
                            <TextInput
                                onChangeText={onChangeCPassSign}
                                placeholder="Confirm password"
                                value={cpassSign}
                                style={styles.input}
                                secureTextEntry={true}
                            />
                            <Entypo name="lock" size={win.width / 18} color="#0F3749" />
                        </View>
                    )}
                    {!forSign && !forForget && (
                        <View style={styles.agreeBox}>
                            <CheckBox
                                title="By signing up, i agree that i have read and accepted the Terms and Services to login now"
                                center
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                textStyle={{ color: "gray", fontWeight: "normal", fontSize: win.width / 38 }}
                                containerStyle={{ borderWidth: 0, backgroundColor: "white" }}
                                size={win.height / 40}
                                checked={check1}
                                onPress={() => handleCheckbox("check1")}
                            />
                        </View>
                    )}

                    {forSign && !forForget && (
                        <Pressable style={styles.inpHeading}>
                            <Text></Text>
                            <Pressable onPress={() => setForForget(true)}>
                                <Text style={styles.forgetText}>Forgot Password?</Text>
                            </Pressable>
                        </Pressable>
                    )}

                    {!forForget && (
                        <>
                            {forSign ? (
                                <Pressable style={styles.loginBtn} onPress={() => loginDealer()}>
                                    {isLoading === false && <Text style={styles.loginText}>Login</Text>}
                                    {isLoading && <ActivityIndicator size="small" color="white" style={{ marginLeft: win.width / 50 }} />}
                                </Pressable>
                            ) : (
                                <Pressable style={styles.loginBtn} onPress={signupDealer}>
                                    {isLoading === false && <Text style={styles.loginText}>Signup</Text>}
                                    {isLoading && <ActivityIndicator size="small" color="white" style={{ marginLeft: win.width / 50 }} />}
                                </Pressable>
                            )}
                        </>
                    )}

                    {!forForget && (
                        <View>
                            {forSign ? (
                                <Pressable onPress={() => setForSign(false)}>
                                    <Text style={styles.createAcc}>
                                        Dont Have an Account? <Text style={styles.createAccInner}>SignUp</Text>
                                    </Text>
                                </Pressable>
                            ) : (
                                <Pressable onPress={() => setForSign(true)} style={styles.already}>
                                    <Text style={styles.createAcc}>
                                        Already Have an Account? <Text style={styles.createAccInner}>Login</Text>
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    )}
                    {!forSign && forForget && (
                        <View>
                            <Text style={styles.termN}>Terms and Conditions</Text>
                        </View>
                    )}
                    {forForget && (
                        <View style={styles.forgetFCont}>
                            <View>
                                <Text style={styles.subF1}>Reset Password</Text>
                            </View>
                            <View style={styles.inputWrapF}>
                                <TextInput onChangeText={onChangeText} placeholder="Enter Email" value={text} style={styles.inputF} />

                                <MaterialIcons name="email" size={win.width / 18} color="#0F3749" />
                            </View>
                            <Pressable style={styles.loginBtnF} onPress={passwordChangedFunc}>
                                <Text style={styles.loginText}>Submit</Text>
                            </Pressable>
                        </View>
                    )}

                    {!forSign && (
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
                                            <FlatList
                                                numColumns={1}
                                                data={manuData}
                                                renderItem={renderItem2}
                                                keyExtractor={(item, i) => i}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </BottomSheet>
                        </View>
                    )} */}
                {/* </View> */}
            </Animated.View>
            <Image source={splashBackImg} style={styles.image} resizeMode="contain" />

            <Animated.View style={{ right: leftValue, position: "absolute", bottom: 0 }}>
                <Image source={carImg} style={styles.imageCar} resizeMode="contain" />
            </Animated.View>

            <Snackbar visible={visible} onDismiss={() => setVisible(false)} style={{ backgroundColor: "crimson" }}>
                {displayMsg}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0e3749",
        alignItems: "center",
        justifyContent: "center",
        minHeight: Math.round(win.height),
    },
    image: {
        flex: 1,
        // opacity: 0.5,
        position: "absolute",
        bottom: "0%",
    },
    imageMid: {
        // flex: 1,
        // marginBottom: "40%",
        // position: "absolute",
        // top: win.height / 20,
    },
    imageStyling: {
        width: win.width / 2,
        height: win.height / 7,
    },
    imageCar: {
        flex: 1,

        // position: "absolute",
        // bottom: "0%",
        // right: "20%",
        width: win.width / 0.5,
        height: win.height / 3.2,
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
    userOpt: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "12%",
        // shadowColor: "rgba(0, 0, 0, 0.5);",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 5,
        // borderRadius: 5,
        // elevation: 4,
        width: "85%",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
    },
    userOptInner: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#1F9DD9",
        height: "100%",
        alignItems: "center",
    },
    dealerOptInner: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "lightgray",
        height: "100%",
        alignItems: "center",
    },
    userOptInner2: {
        flexDirection: "row",
        justifyContent: "center",
        color: "#0F3749",
        width: "50%",
        textAlign: "center",
    },
    dealerOptInner2: {
        flexDirection: "row",
        justifyContent: "center",
        color: "#0F3749",
        width: "50%",
        textAlign: "center",
    },
    userOptText: {
        color: "white",
        width: "50%",
        textAlign: "center",
        fontSize: win.height / 60,
    },
    dealerOptText: {
        color: "#0F3749",
        width: "50%",
        textAlign: "center",
        fontSize: win.height / 60,
    },
    userOptText2: {
        color: "#0F3749",
        width: "50%",
        textAlign: "center",
        fontSize: win.height / 60,
    },
    dealerOptText2: {
        color: "white",
        width: "50%",
        textAlign: "center",
        fontSize: win.height / 60,
    },
    userOptTextSel: {
        color: "#0F3749",
        width: "50%",
        textAlign: "center",
    },
    dealerOptTextSel: {
        color: "#0F3749",
        width: "50%",
        textAlign: "center",
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
    input: {
        // backgroundColor: "blue",
        height: 40,
        width: "90%",
        fontSize: win.height / 50,
        color: "lightgray",
    },
    inpHeading: {
        display: "flex",
        justifyContent: "space-between",

        width: "85%",
        flexDirection: "row",
    },

    loginBtn: {
        backgroundColor: "rgba(31, 157, 217, 1)",
        width: "85%",
        height: win.height / 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        flexDirection: "row",
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
    forgetText: {
        color: "rgba(31, 157, 217, 1)",
        fontSize: win.height / 62,
    },
    createAcc: {
        color: "lightgray",
        fontSize: win.height / 60,
    },
    createAccInner: {
        color: "#1F9DD9",
        fontWeight: "bold",
    },
    termN: {
        color: "#1F9DD9",
        fontSize: win.height / 60,
        fontWeight: "bold",
        marginVertical: win.height / 200,
    },

    agreeBox: {
        // backgroundColor:"crimson",
        paddingHorizontal: win.width / 50,
    },
    already: {
        marginTop: win.height / 130,
    },
    container3: {
        flex: 1,
        margin: 2,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    addUserWrap: {
        marginHorizontal: win.width / 20,
        marginVertical: win.height / 40,
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
    subF1: {
        fontSize: win.height / 35,
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: win.height / 90,
        color: "#0F3749",
    },
    loginBtnF: {
        backgroundColor: "rgba(31, 157, 217, 1)",
        width: win.width / 1.5,
        height: win.height / 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    forgetFCont: {
        display: "flex",
        justifyContent: "space-evenly",
        // backgroundColor: "red",
        height: win.height / 2.5,
        alignItems: "center",
    },
});

export default SplashScreen;
