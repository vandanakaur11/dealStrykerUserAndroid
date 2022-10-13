import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, Image, Pressable, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import avatarImg4 from "../images/avatarImg4.png";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { CheckBox, Icon } from "react-native-elements";
import api from "./../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

let win = Dimensions.get("window");
function AddMemberScreen({ navigation, route }) {
    const [text, setText] = useState("");
    const [text2, setText2] = useState("");

    const [text3, setText3] = useState("");
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function handleCheckbox(val) {
        if (val === "check1") {
            setUserRole("Manager");
            setCheck1(true);
            setCheck2(false);
            setCheck3(false);
        }
        if (val === "check2") {
            setUserRole("Sales");
            setCheck1(false);
            setCheck2(true);
            setCheck3(false);
        }
        if (val === "check3") {
            setUserRole("Finance");
            setCheck1(false);
            setCheck2(false);
            setCheck3(true);
        }
    }

    const registerSubUser = async () => {
        setIsLoading(true);

        try {
            const user = JSON.parse(await AsyncStorage.getItem("userData"));

            const body = {
                user: {
                    email: userEmail,
                    role: "subuser",
                    name: userName,
                    type: userRole,
                    id: user,
                },
            };

            const res = await api.post("/users/registerSubUser", body);

            if (res) {
                console.log("registerSubUser res.data", res.data);
                console.log("registerSubUser res.data.user", res.data.user);
                setIsLoading(false);
                getUserData();
                navigation.navigate("ManageUserScreen", {
                    memberName: "abc",
                    memberEmail: "abc@gail.com",
                    memberRole: "Manager",
                });
            }

            console.clear();
            console.log("this is daata for subuser", user);
        } catch (error) {
            console.log("registerSubUser error", error);
        }
    };

    const getUserData = async () => {
        try {
            const { email, token } = JSON.parse(await AsyncStorage.getItem("user"));

            const body = {
                email,
            };

            const headers = {
                Authorization: `Token ${token}`,
            };

            const res = await api.post("/users/getUserData", body, { headers });

            console.log("getUserData res.data >>>>>>>>>>", res.data);

            await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));
        } catch (error) {
            console.log("getUserData error >>>>>>>>>>>>>", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headingWrap}>
                {/* <Image style={styles.imgIcon}/> */}
                <AntDesign name="adduser" size={win.height / 25} color="#0F3749" />

                <Text style={styles.headingText}>Add Team Member</Text>
            </View>

            <View style={styles.formWrap}>
                <View style={styles.innerWrap}>
                    <View style={styles.innInner}>
                        <Text style={styles.nameHeading}>User's Name</Text>

                        <TextInput placeholder="Enter User's Name" style={styles.inputStyles} onChangeText={setUserName} />
                    </View>
                    <View style={styles.innInner}>
                        <Text style={styles.nameHeading}>Email</Text>

                        <TextInput placeholder="Enter Email" style={styles.inputStyles} onChangeText={setUserEmail} />
                    </View>
                    <View>
                        <Text style={styles.nameHeading}>User Role</Text>
                    </View>
                    <View style={styles.checkWrap}>
                        <View style={styles.roleWrap}>
                            <Text style={styles.roleText}>Manager</Text>
                        </View>
                        <View style={styles.checkBoxWrap}>
                            <CheckBox
                                title=""
                                center
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                textStyle={{
                                    color: "gray",
                                    fontWeight: "normal",
                                    fontSize: win.width / 38,
                                }}
                                containerStyle={{ borderWidth: 0, backgroundColor: "white" }}
                                checked={check1}
                                onPress={() => handleCheckbox("check1")}
                            />
                        </View>
                    </View>
                    <View style={styles.checkWrap}>
                        <View style={styles.roleWrap}>
                            <Text style={styles.roleText}>Sales</Text>
                        </View>
                        <View style={styles.checkBoxWrap}>
                            <CheckBox
                                title=""
                                center
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                textStyle={{
                                    color: "gray",
                                    fontWeight: "normal",
                                    fontSize: win.width / 38,
                                }}
                                containerStyle={{ borderWidth: 0, backgroundColor: "white" }}
                                checked={check2}
                                onPress={() => handleCheckbox("check2")}
                            />
                        </View>
                    </View>
                    <View style={styles.checkWrap}>
                        <View style={styles.roleWrap}>
                            <Text style={styles.roleText}>Finance</Text>
                        </View>
                        <View style={styles.checkBoxWrap}>
                            <CheckBox
                                title=""
                                center
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                textStyle={{
                                    color: "gray",
                                    fontWeight: "normal",
                                    fontSize: win.width / 38,
                                }}
                                containerStyle={{ borderWidth: 0, backgroundColor: "white" }}
                                checked={check3}
                                onPress={() => handleCheckbox("check3")}
                            />
                        </View>
                    </View>
                </View>

                <Pressable style={styles.btn} onPress={() => registerSubUser()}>
                    {isLoading === false && <Text style={styles.btnText}>Add Team Member</Text>}
                    {isLoading && <ActivityIndicator size="small" color="white" />}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: win.width / 25,
    },
    headingWrap: {
        width: "100%",
        height: win.height / 10,
        //   backgroundColor:'pink',
        alignItems: "center",
        paddingHorizontal: win.width / 50,
        color: "blue",
        flexDirection: "row",
    },
    headingText: {
        fontSize: win.height / 35,
        color: "#0F3749",
        marginLeft: win.width / 50,
    },
    formWrap: {
        //   height:win.height/1.7,
        backgroundColor: "white",
        width: "100%",
        marginTop: win.height / 60,
        paddingHorizontal: win.width / 20,
        paddingVertical: win.height / 50,
        width: "100%",
        borderRadius: 10,
        borderWidth: 0,
        borderColor: "#CDCDCD",
        shadowColor: "#CDCDCD",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        borderRadius: 5,
        elevation: 4,
        justifyContent: "space-between",
    },

    btn: {
        backgroundColor: "#1F9DD9",
        height: win.height / 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: win.height / 60,
    },
    btnText: {
        color: "white",
        fontSize: win.height / 50,
    },
    nameHeading: {
        fontSize: win.height / 55,
        color: "#0F3749",
    },

    innerWrap: {
        //    backgroundColor:"lightgray"
    },
    innInner: {
        marginVertical: win.height / 50,
        // backgroundColor:"lightgray",
        // borderWidth:1,
    },
    nameHeading: {
        fontSize: win.height / 45,
        color: "#0F3749",
        marginVertical: win.width / 80,
    },
    inputStyles: {
        borderWidth: 1,
        height: win.height / 16,
        borderRadius: 10,
        borderColor: "lightgray",
        paddingLeft: win.width / 30,
    },
    checkWrap: {
        // backgroundColor:"red",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: win.height / 12,
    },
    checkBoxWrap: {
        width: win.width / 6,
        justifyContent: "flex-end",
        // backgroundColor:"green",
        alignItems: "center",
    },
    roleWrap: {
        width: win.width / 5,
    },
    roleText: {
        fontSize: win.height / 50,
        color: "#0F3749",
    },
});
export default AddMemberScreen;
