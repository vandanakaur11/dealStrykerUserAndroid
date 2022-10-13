import * as React from "react";
import { Text, View } from "react-native";

import { useSelector } from "react-redux";
import { setBids } from "../slices/handlers";
import { sendMessage } from "../socket.io";

const Bids = ({ navigation }) => {
    const userObject = useSelector((state) => state.user.value);

    console.clear();

    const userId = userObject.Dealership?._id;
    const unreadLiveBids = userObject.Dealership?.unreadLiveBids;
    const bids = userObject.Dealership?.bids;

    // let unreadLiveBidsArr = [];
    // let bidsArr = [];

    // for (let value of userObject.Dealership?.unreadLiveBids) {
    //     unreadLiveBidsArr.push(value);
    // }

    // for (let value of userObject.Dealership?.bids) {
    //     bidsArr.push(value);
    // }

    console.log("id >>>>>>>>>>>", userId);
    console.log("bidsArr >>>>>>>>>>>", bids);
    console.log("unreadLiveBidsArr >>>>>>>>>>>", unreadLiveBids);
    /////////////////////////////////////////////////
    if (userId !== undefined && bids !== undefined && unreadLiveBids !== undefined) {
        console.log("sssssssssssssssssss >>>>>>>>>>>>>>>>");

        sendMessage("MARK_AS_READ", { userId, id: unreadLiveBids }, (res) => {
            if (res === true) {
                removeUnread({ id: unreadLiveBids });
            }

            console.log("res >???>?>?>>?>", res);
        });
    }
    /////////////////////////////////////////////

    /////////////////////////////////////////
    const newBids = [...bids];

    sendMessage("OFFER_CREATED", requestData, (code, offer) => {
        if (code === 200 && offer) {
            // message.success("Offer Was Sent!");
            let bidIndex;
            if (offer.parentBidId) {
                bidIndex = newBids.findIndex((bid) => offer.parentBidId === bid._id);
                if (bidIndex >= 0) {
                    newBids[bidIndex].responses = [...newBids[bidIndex].responses, offer];
                    setBids([...newBids]);
                }
            }
        } else if (code === 201 && offer) console.log("Offer Was Updated!");
        else console.log(`Offer already made by your dealership ${code}`);
    });
    //////////////////////////////////////////

    //////////////////////////////////////

    const onClickDealer = (requestId) => {
        // const { userId, bids, actions, userData, history } = this.props;

        const foundedBid = bids && bids.find((bid) => bid._id === requestId);
        // console.log(userData);
        if (foundedBid && foundedBid.responses) {
            const foundedOwnOffer = foundedBid.responses.find((offer) => offer.members.includes(userId) || offer.dealerId === userId);
            if (foundedOwnOffer) {
                navigation.navigate("MakeOfferStack", { bid: requestId._id });
                if (foundedOwnOffer.isAccepted) {
                    return actions.setRecipient({ offerId: foundedOwnOffer._id });
                } else return this.setState({ visible: true, requestId });
            }
        }

        return this.setState({ visible: true, requestId });
    };

    /////////////////////////////////////

    return (
        <View>
            {userObject.Dealership.bids.map((bid) => {
                <View onPress={() => onClickDealer(bid)}>
                    <Text>Make Offer</Text>
                </View>;
            })}
        </View>
    );
};

export default Bids;
