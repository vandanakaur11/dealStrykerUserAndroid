import * as React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OfferComp from "../components/OfferComp";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./../services/api";
// import io from "socket.io-client";
import { removeUnread, setBids } from "../slices/handlers";
import { createSocket, sendMessage } from "./../socket.io";
import emptyBox from "./../images/empty.svg";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { userDetail } from "./../slices/userSlice";
import Bids from "../components/Bids";

// const socket = io.connect("https://chassis-staging.herokuapp.com/socket.io");

const win = Dimensions.get("window");
const DATA = [
    { id: "01", name: "Toyota corolla Hybrid", subName: "LE 4dr Sedan Blueprint", year: "2021", offer: "make" },
    { id: "02", name: "V60 Cross Country", subName: "T5 4dr Wagon AWD Fusion Red Mettalic", year: "2021" },
    { id: "03", name: "V60 Cross Country", subName: "T5 4dr Wagon AWD Fusion Red Mettalic", year: "2021" },
    { id: "04", name: "Toyota corolla Hybrid", subName: "LE 4dr Sedan Blueprint", year: "2021", offer: "make" },
    { id: "05", name: "V60 Cross Country", subName: "T5 4dr Wagon AWD Fusion Red Mettalic", year: "2021", offer: "make" },
    { id: "06", name: "V60 Cross Country", subName: "T5 4dr Wagon AWD Fusion Red Mettalic", year: "2021" },
];
function OffersScreen({ navigation }) {
    const [isData, setIsData] = React.useState(false);
    const dispatch = useDispatch();
    const userObject = useSelector((state) => state.user.value);
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!", userObject);
    // const renderItem = ({ item }) => <Pressable>{/* <OfferComp check={item} navigation={navigation} /> */}</Pressable>;

    const getUserData = async () => {
        try {
            const { email, token, id: userId } = JSON.parse(await AsyncStorage.getItem("user"));

            const body = {
                email,
            };

            const headers = {
                Authorization: `Token ${token}`,
            };

            var userData;

            const res = await api.post("/users/getUserData", body, { headers });
            if (res) {
                setIsData(true);
                await AsyncStorage.setItem("userAllData", JSON.stringify(res.data));

                userData = JSON.parse(await AsyncStorage.getItem("userAllData"));
                // console.log("userData", userData.unreadLiveBids[1]);

                const {
                    user: { bids: bidsArr },
                } = userData;
                dispatch(userDetail(res.data.user));
                createSocket(userId, false, setBids);
            } else {
                setIsData(false);
            }

            console.log("getUserData res.data >>>>>>>>>>", res.data);

            await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));
        } catch (error) {
            console.log("getUserData error >>>>>>>>>>>>>", error);
        }
    };
    // async function getOfferData() {
    //     const { _id } = JSON.parse(await AsyncStorage.getItem("user"));
    //     console.log(
    //         `socket.emit("MARK_AS_READ", { userId: _id, id: socket.user.id }); >>>>>>>>>>`,
    //         socket.emit("MARK_AS_READ", { userId: _id, id: "62e9430e7d731600040a3664" }),
    //     );

    //     console.log("id >>>>>>>>", id);
    //     console.log('socket.emit("USER_CONNECT", id)', socket.emit("USER_CONNECT", id));
    // }
    React.useEffect(() => {
        getUserData();
        // getOfferData();
    }, []);

    //////////////////// For MARK_AS_READ  ////////////////

    return (
        <View style={styles.main}>
            <View style={styles.headingWrap}>
                <Text style={styles.heading}>Offers</Text>
            </View>
            {isData ? (
                <View style={styles.wrap}>
                    {/* <FlatList numColumns={1} data={DATA} renderItem={renderItem} keyExtractor={(item) => item.id} /> */}
                    <Bids />
                </View>
            ) : (
                <View style={styles.emptyTextWrap}>
                    <AntDesign name="inbox" size={win.width / 5} color="lightgray" />
                    <Text style={styles.emptyText}>Sorry no leads are available right now, please check back later!</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        width: "100%",
        height: "100%",
        flex: 1,
        paddingBottom: win.height / 10,
    },
    heading: {
        fontSize: win.height / 30,
        color: "#0F3749",
    },
    wrap: {
        marginHorizontal: win.width / 20,
    },
    headingWrap: {
        height: win.height / 15,
        justifyContent: "center",
        paddingHorizontal: win.width / 25,
    },
    emptyTextWrap: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: win.height / 1.3,
        width: win.width,
    },
    emptyText: {
        color: "#0F3749",
        fontSize: win.width / 30,
        paddingHorizontal: win.width / 10,
        textAlign: "center",
    },
    emptyStyle: {
        height: win.width / 4,
        borderWidth: 1,
    },
});

export default OffersScreen;
