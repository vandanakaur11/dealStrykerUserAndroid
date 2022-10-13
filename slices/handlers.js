const initialState = {
    bids: [],
    loading: true,
};

export const removeUnread = (state, { payload }) => {
    return {
        ...state,
        unreadLiveBids: state.unreadLiveBids.filter((id) => id !== payload.id),
    };
};

export const setBids = (state, { payload }) => {
    console.clear();
    console.log("state >>>>>>>", state);
    console.log("payload >>>>>>>", payload);

    return {
        ...state,
        bids: payload,
        loading: false,
    };
};

export default initialState;
