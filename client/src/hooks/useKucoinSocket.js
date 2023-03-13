import {useEffect} from "react";
import io from "socket.io-client";
import {useDispatch, useSelector} from "react-redux";

import {setBalance, setKucoinsValues} from "redux/slices/kucoin.slice";
import {LIVE_SERVER, LOCAL_SERVER, SOCKET_EVENTS} from "../constants";

const useKucoinSocket = (token = null) => {
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.user)

    useEffect(() => {
        if (token) {
            const _id = user?._id;
            const api = JSON.stringify(user.api);
            const sendKucoinEvent = `${SOCKET_EVENTS.HIT_KUCOIN_API}_${_id}`
            const getKucoinDataEvent = `${SOCKET_EVENTS.SEND_KUCOIN_API_DATA}_${_id}`

            const SERVER = process.env.NODE_ENV === "development"
                ? LOCAL_SERVER
                : LIVE_SERVER;
            const socket = io(SERVER, {auth: {token}, query: `api=${api}`});

            socket.emit(sendKucoinEvent, socket.id);
            socket.on(getKucoinDataEvent,
                (data) => {
                    const {balance, ...restData} = data;
                    dispatch(setKucoinsValues(restData));
                    dispatch(setBalance(balance));
                });

            const id = setInterval(() => {
                socket.emit(sendKucoinEvent, socket.id);
                socket.on(getKucoinDataEvent,
                    (data) => {
                        const {balance, ...restData} = data;
                        dispatch(setKucoinsValues(restData));
                        dispatch(setBalance(balance));
                    });
            }, 5000);

            return () => {
                clearInterval(id)
            }
        }
    }, [dispatch, token]);
};

export default useKucoinSocket