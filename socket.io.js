import io, { Socket } from "socket.io-client";
import config from "./config";

let callbacks = {
    get_userId: () => {},
    get_isDealer: () => {},
    set_bids: () => {},
    user_connected: () => {},
    offer_request_success: () => {},
    offer_request_created: () => {},
    offer_created: () => {},
    subscribeToChat: () => {},
    get_props: () => {},
};

let socket;

// export const sendMessage = (type, payload) => {};
export const sendMessage = function (type, message, callback) {
    socket.emit(type, message, callback);
};

export const setCallbacks = function (_callbacks) {
    callbacks = { ...callbacks, ..._callbacks };

    // console.log("callbacks >>>>>>>>", callbacks);
};

export const createSocket = function (userId, isDealer, _callback) {
    socket = io(config.ServerAddress);
    _callback && setCallbacks(_callback);

    // if (!isDealer) {
    socket.on("connect", () => {
        socket.emit("USER_CONNECT", userId, (bidsArr) => {
            callbacks.user_connected(bidsArr);
            callbacks.subscribeToChat(bidsArr);
            callbacks.set_bids(bidsArr);

            console.log("bidsArr ? ? ? ? ? ? ? ?", bidsArr.length);
        });
    });

    socket.on("OFFER_REQUEST_CREATED", (offerRequest) => {
        const { bids, actions } = callbacks.get_props();
        actions.setBids([...bids, offerRequest]);
        actions.addUnread({ id: offerRequest._id });
    });

    socket.on("OFFER_CREATED", (offer) => {
        const { bids, actions } = callbacks.get_props();
        const newBids = [...bids];

        const newOfferParentIndex = bids.findIndex((bid) => bid._id === offer.parentBidId);
        if (newOfferParentIndex !== -1 && bids[newOfferParentIndex] && newBids[newOfferParentIndex].responses) {
            newBids[newOfferParentIndex].responses.push(offer);
            actions.setBids(newBids);
            actions.addUnread({ id: offer._id });
        }
        callbacks.offer_created(offer);
    });

    socket.on("OFFER_ACCEPTED", (bidId, offerId) => {
        const { bids, actions } = callbacks.get_props();

        const acceptedOfferParentIndex = bids.findIndex((bid) => bid._id === bidId);
        if (acceptedOfferParentIndex >= 0) {
            const newBidsArr = [...bids];
            let foundedOfferIndex =
                newBidsArr[acceptedOfferParentIndex] &&
                newBidsArr[acceptedOfferParentIndex].responses.findIndex((offer) => offer._id === offerId);
            if (foundedOfferIndex >= 0) {
                newBidsArr[acceptedOfferParentIndex].responses[foundedOfferIndex].isAccepted = true;
                actions.setBids(newBidsArr);
            }
        }
    });

    socket.on("END_CAMPAIGN", (bidId) => {
        const { bids, actions, unreadLiveBids } = callbacks.get_props();
        const newLiveBids = [...bids];

        const bidIndex = newLiveBids.findIndex((bid) => bid._id === bidId);
        if (bidIndex >= 0) {
            newLiveBids[bidIndex].isClosed = true;
            actions.removeUnread({ id: bidId });
            const offersArr = newLiveBids[bidIndex].responses;
            if (offersArr && offersArr.length)
                offersArr.forEach((offer) => {
                    offer.isClosed = true;
                });
        }

        actions.setBids(newLiveBids);
    });

    socket.on("OFFER_UPDATED", (bidId, offerId, { price }) => {
        const { bids, actions, unreadLiveBids } = callbacks.get_props();
        var formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",

            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

        const offerParentIndex = bids.findIndex((bid) => bid._id === bidId);
        if (offerParentIndex !== -1) {
            const newBidsArr = [...bids];
            let foundedOfferIndex =
                newBidsArr[offerParentIndex] && newBidsArr[offerParentIndex].responses.findIndex((offer) => offer._id === offerId);
            if (foundedOfferIndex !== -1 && newBidsArr[offerParentIndex]) {
                newBidsArr[offerParentIndex].responses[foundedOfferIndex].price = formatter.format(price);
                actions.setBids(newBidsArr);
                if (unreadLiveBids && unreadLiveBids.indexOf(offerId) === -1) actions.addUnread({ id: offerId });
            }
        }
    });
    // }
};

export const disconnect = () => {
    if (socket) socket.close();
    console.log("disconnect socket");
};
