import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    Image,
    Pressable,
    SafeAreaView,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import avatarImg4 from "../images/avatarImg4.png";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomSheet } from "react-native-btr";
import { CheckBox, Icon } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import api from "../services/api";

let win = Dimensions.get("window");
function ManageUserScreen({ navigation, route }) {
    const { memberName, memberEmail, memberRole } = route.params;
    console.log("this is route params ", memberName, memberEmail, memberRole);
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(false);
    const [check4, setCheck4] = useState(false);
    const [text, setText] = useState("");
    const [text2, setText2] = useState("");
    const [userRole, setUserRole] = useState("Admin");
    const [userName, setUserName] = useState("Dealership Name");
    const [userEmail, setUserEmail] = useState("xyz@xyz.com");
    const [isLoading, setIsLoading] = useState(false);
    const [allUserData, setAllUserData] = useState([]);
    const [text3, setText3] = useState("");
    const [visible, setVisible] = useState(false);
    const [editForUser, setEditForUser] = useState([]);
    // const [memberData, setMemberData] = useState([]);

    ///////////////////////////////////
    let [selectedImage, setSelectedImage] = React.useState(null);

    const getUserData = async () => {
        const user = JSON.parse(await AsyncStorage.getItem("userData"));
        console.log("fffffffgfgfg", user.Dealership.subuser, "dsqssswsdddddddd");

        setAllUserData(user.Dealership.subuser);

        console.log("subuserdata ", user.Dealership.subuser);
    };

    // if (selectedImage !== null) {
    //   setProPic(selectedImage)
    // return (
    //   <View style={styles.container}>
    //     <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
    //   </View>
    //    null
    //    );
    // }
    ////////////////////////////////////

    const toggleBottomNavigationView = () => {
        setVisible(!visible);
    };
    useEffect(() => {
        getUserData();
    }, []);
    let openImagePickerAsync = async () => {
        try {
            let permissionResult = await ImagePicker.ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                alert("Permission to access camera roll is required!");
                return;
            }
        } catch (err) {}
        try {
            let pickerResult = await ImagePicker.launchImageLibraryAsync();
            if (pickerResult.cancelled === true) {
                return;
            }
            setSelectedImage({ localUri: pickerResult.uri });
        } catch (err) {}

        // setSelectedImage({ localUri: pickerResult.uri });
    };

    function handleCheckbox(val) {
        // if (val === "check1") {
        //   setUserRole("Admin");
        //   setCheck1(true);
        //   setCheck2(false);
        //   setCheck3(false);
        //   setCheck4(false);
        // }
        if (val === "check2") {
            setUserRole("Manager");
            setCheck1(false);
            setCheck2(true);
            setCheck3(false);
            setCheck4(false);
        }
        if (val === "check3") {
            setUserRole("Sales");
            setCheck1(false);
            setCheck2(false);
            setCheck3(true);
            setCheck4(false);
        }
        if (val === "check4") {
            setUserRole("Finance");
            setCheck1(false);
            setCheck2(false);
            setCheck3(false);
            setCheck4(true);
        }
    }

    const editUser = async () => {
        setIsLoading(true);
        toggleBottomNavigationView();

        try {
            const user = JSON.parse(await AsyncStorage.getItem("userData"));

            const bodyForUser = {
                user: {
                    name: userName,
                    type: userRole,
                    zip: user.zip,
                    manufacturers: user.manufacturers,
                    email: user.email,
                },
            };

            const bodyForManufacturer = {
                user: {
                    manufacturers: user.manufacturers,
                    email: user.email,
                },
            };

            const res = await api.post("/users/editUser", bodyForUser);
            // const data = await res.json();

            if (res) {
                const res = await api.post("/users/editManu", bodyForManufacturer);
                console.log("editUser manufacturer res.data >>>>>>>>", res.data);
                setIsLoading(false);

                getUserData();
            }
        } catch (error) {
            console.log("editUser catch error >>>>>>>>>", error);
        }
    };

    const deleteSubUser = async () => {
        setIsLoading(true);

        try {
            const body = {
                user: {
                    email: editForUser.email,
                },
            };

            const res = await api.post("/users/deleteSubUser", body);

            console.log("delete sub user res >>>>>", res.data);

            if (res) {
                setIsLoading(false);
                toggleBottomNavigationView();
                getUserData();
            }
        } catch (error) {
            console.log("deleteSubUser error", error);
        }
    };

    return (
        <View style={styles.containers}>
            <View style={styles.headingWrap}>
                {/* <Image style={styles.imgIcon}/> */}
                <FontAwesome5 name="user-cog" size={win.height / 25} color="#0F3749" />
                <Text style={styles.headingText}>Manage User</Text>
            </View>

            <View style={styles.formWrap}>
                <ScrollView style={styles.manageUserData}>
                    {allUserData.length > 0 ? (
                        allUserData.map((item, index) => {
                            console.log("item >>>>>>>>.", item);
                            // editForUser(item);
                            return (
                                <View key={index} style={styles.innerWrap}>
                                    <View style={styles.innWrap}>
                                        {/* {selectedImage !== null ? (
                <Image
                  source={{ uri: selectedImage.localUri }}
                  style={styles.imgStyle}
                />
              ) : (
                <Image source={avatarImg4} style={styles.imgStyle} />
              )} */}
                                        <View style={styles.nameWrap}>
                                            <Text style={styles.nameInfo}>{item.name}</Text>
                                            <Text style={styles.nameInfo}>{item.email}</Text>
                                        </View>
                                    </View>
                                    <Pressable style={styles.innWrap} onPress={toggleBottomNavigationView}>
                                        <Text style={styles.role}>{item.role}</Text>
                                        <FontAwesome name="pencil-square-o" size={win.height / 30} color="#1F9DD9" />
                                    </Pressable>
                                </View>
                            );
                        })
                    ) : (
                        <View>
                            <Text>No Subuser Added</Text>
                        </View>
                    )}
                </ScrollView>
                <View>
                    <Pressable style={styles.btn} onPress={() => navigation.navigate("AddMemberScreen")}>
                        <Text style={styles.btnText}>Add Team Member</Text>
                        {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
                    </Pressable>
                    {/* <ActivityIndicator /> */}
                    {/* <Pressable style={styles.btnEdit} >
                    <Text style={styles.btnTextEdit}>Edit User</Text>
                </Pressable> */}
                </View>
            </View>

            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <BottomSheet
                        visible={visible}
                        onBackButtonPress={toggleBottomNavigationView}
                        onBackdropPress={toggleBottomNavigationView}
                    >
                        {/*Bottom Sheet inner View*/}
                        <ScrollView style={styles.bottomNavigationView}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "column",
                                    justifyContent: "space-around",

                                    // alignItems:"center",
                                    // backgroundColor:"crimson",
                                }}
                            >
                                <View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            marginVertical: win.height / 45,
                                            marginTop: win.height / 25,
                                            paddingHorizontal: win.width / 10,

                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View style={{ flexDirection: "row" }}>
                                            <FontAwesome5 name="user-edit" size={win.height / 25} color="#0F3749" />
                                            <Text
                                                style={{
                                                    marginLeft: 10,
                                                    color: "#0F3749",
                                                    fontWeight: "bold",
                                                    fontSize: win.height / 30,
                                                }}
                                            >
                                                Edit User
                                            </Text>
                                        </View>
                                        <Pressable onPress={() => toggleBottomNavigationView()}>
                                            <Text
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: win.height / 40,
                                                }}
                                            >
                                                X
                                            </Text>
                                        </Pressable>
                                    </View>
                                    <View></View>
                                </View>
                                <View style={{ paddingHorizontal: win.width / 10 }}>
                                    {editForUser}
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                //   textAlign: 'center',
                                                paddingTop: win.height / 70,
                                                paddingBottom: win.height / 120,
                                                fontSize: win.height / 45,
                                                color: "#0F3749",
                                            }}
                                        >
                                            User's Name
                                        </Text>
                                        <Text></Text>
                                    </View>
                                    <TextInput
                                        placeholder="User's Name"
                                        style={styles.sheetInput}
                                        onChangeText={setUserName}
                                        value={editForUser.name}
                                    />
                                </View>
                                <View style={{ paddingHorizontal: win.width / 10 }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        {/* <Text
                      style={{
                        //   textAlign: 'center',
                        paddingTop: win.height / 70,
                        paddingBottom: win.height / 120,
                        fontSize: win.height / 45,
                        color: "#0F3749",
                      }}
                    >
                      Email
                    </Text> */}
                                        {/* <Text></Text> */}
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        paddingHorizontal: win.width / 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            //   textAlign: 'center',
                                            paddingTop: win.height / 40,
                                            fontSize: win.height / 46,
                                            color: "#0F3749",
                                        }}
                                    >
                                        Member Role
                                    </Text>
                                    {/* <Text></Text> */}
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginLeft: win.width / 30,
                                        paddingHorizontal: win.width / 10,
                                    }}
                                >
                                    {/* <Text style={{ fontSize: win.height / 55 }}>Admin</Text>
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
                    // containerStyle={{ borderWidth:0 }}
                    size={win.height / 35}
                    checked={check1}
                    onPress={() => handleCheckbox("check1")}
                  /> */}
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginLeft: win.width / 30,
                                        paddingHorizontal: win.width / 10,
                                    }}
                                >
                                    <Text style={{ fontSize: win.height / 55 }}>Manager</Text>
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
                                        // containerStyle={{ borderWidth: 0, backgroundColor: "white" }}
                                        size={win.height / 35}
                                        // checked={check2}
                                        checked={editForUser.role === "manager" ? checked : null}
                                        onPress={() => handleCheckbox("check2")}
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginLeft: win.width / 30,
                                        paddingHorizontal: win.width / 10,
                                    }}
                                >
                                    <Text style={{ fontSize: win.height / 55 }}>Sales</Text>

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
                                        // containerStyle={{ borderWidth: 0, backgroundColor: "white" }}
                                        size={win.height / 35}
                                        // checked={check3}
                                        checked={editForUser.role === "sales" ? checked : null}
                                        onPress={() => handleCheckbox("check3")}
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginLeft: win.width / 30,
                                        paddingHorizontal: win.width / 10,
                                    }}
                                >
                                    <Text style={{ fontSize: win.height / 55 }}>Finance</Text>
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
                                        // containerStyle={{ borderWidth: 0, backgroundColor: "white" }}
                                        size={win.height / 35}
                                        // checked={check4}
                                        checked={editForUser.role === "finance" ? checked : null}
                                        onPress={() => handleCheckbox("check4")}
                                    />
                                </View>
                                <View style={styles.uploadWrap}>
                                    {/* <Entypo
                    name="upload"
                    size={win.height / 35}
                    color="#0F3749"
                  /> */}
                                    {/* <Text style={styles.uploadText}>Upload profile picture</Text> */}
                                    {/* <TouchableOpacity
                    onPress={openImagePickerAsync}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      Upload your profile picture
                    </Text>
                  </TouchableOpacity> */}
                                </View>
                                <View style={styles.btnCont}>
                                    <Pressable
                                        style={styles.sheetBtn}
                                        // onPress={() => editSubUser()}
                                        onPress={() => editUser()}
                                    >
                                        <Text style={styles.sheetBtnText} onPress={() => editUser()}>
                                            Save Changes
                                        </Text>
                                    </Pressable>
                                    <Pressable style={styles.sheetBtn2} onPress={() => deleteSubUser()}>
                                        <Text style={styles.sheetBtnText} onPress={() => deleteSubUser()}>
                                            Delete
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </ScrollView>
                    </BottomSheet>
                </View>
            </SafeAreaView>

            {/* here end */}
        </View>
    );
}

const styles = StyleSheet.create({
    containers: {
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
        height: win.height / 1.4,
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

    manageUserData: {
        // height: win.height / 1.6,
        // borderWidth: 1,
    },

    btn: {
        backgroundColor: "#1F9DD9",
        height: win.height / 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: win.height / 25,
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
        flexDirection: "row",
        justifyContent: "space-between",
        // backgroundColor:"red",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
        paddingVertical: win.height / 80,
    },
    innWrap: {
        flexDirection: "row",

        alignItems: "center",
    },
    imgStyle: {
        width: win.height / 12,
        height: win.height / 12,
        borderRadius: win.width / 2,
    },
    nameWrap: {
        marginLeft: win.width / 50,
    },
    role: {
        marginRight: win.width / 50,
        color: "gray",
        fontSize: win.height / 60,
    },
    nameInfo: {
        color: "#0F3749",
        fontSize: win.height / 50,
    },
    btnTextEdit: {
        color: "white",
        fontSize: win.height / 50,
        textAlign: "center",
        backgroundColor: "crimson",
        padding: win.width / 30,
        borderRadius: 10,
    },
    btnEdit: {
        marginTop: win.height / 100,
        fontWeight: "bold",
    },

    container: {
        flex: 1,
        // margin: 2,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    bottomNavigationView: {
        backgroundColor: "#fff",
        width: "100%",
        height: win.height / 1.3,
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingBottom: win.height / 40,
        borderTopLeftRadius: win.width / 10,
        borderTopRightRadius: win.width / 10,
    },

    sheetInput: {
        borderWidth: 1,
        borderColor: "lightgray",
        width: win.width / 1.25,
        borderRadius: 10,
        paddingLeft: win.width / 20,
        height: win.height / 18,
    },
    uploadWrap: {
        flexDirection: "row",
        paddingBottom: win.height / 70,
        paddingHorizontal: win.width / 10,
    },
    uploadText: {
        fontSize: win.height / 55,
        color: "#0F3749",
        marginLeft: win.width / 60,
    },
    btnCont: {
        // flexDirection:"row",
        alignItems: "center",
        // justifyContent:"space-around",
        marginVertical: win.height / 50,
    },
    sheetBtn: {
        backgroundColor: "#1F9DD9",
        height: win.height / 17,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        width: win.width / 1.3,
        marginVertical: win.height / 90,

        //  marginLeft:win.width/30
    },
    sheetBtn2: {
        backgroundColor: "crimson",
        height: win.height / 17,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        width: win.width / 1.3,
        marginVertical: win.height / 90,
        //    marginLeft:win.width/30,
        //    marginTop:win.height/80
    },
    sheetBtnText: {
        color: "white",
        fontSize: win.height / 55,
    },

    container4: {
        flex: 1,
        backgroundColor: "#fff",
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    logo: {
        width: 305,
        height: 159,
        marginBottom: 20,
    },
    instructions: {
        color: "#888",
        fontSize: 18,
        marginHorizontal: 15,
        marginBottom: 10,
    },
    button: {
        // backgroundColor: 'blue',
        // padding: 20,
        // borderRadius: 5,
    },
    buttonText: {
        color: "#1F9DD9",
        marginLeft: win.width / 35,
        fontSize: win.height / 50,
    },
    thumbnail: {
        width: 300,
        height: 300,
        resizeMode: "contain",
    },
});
export default ManageUserScreen;
