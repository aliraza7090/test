import { useEffect , useMemo } from "react";
import { useDispatch , useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';

import { setBinanceValues } from "redux/slices/binance.slice";
import io from "socket.io-client";
import { LIVE_SERVER , LOCAL_SERVER , SOCKET_EVENTS } from "../constants";


const useBinanceSocket = ( token = null ) => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { user } = useSelector( store => store.user );
    const SERVER = useMemo( () => {
        return process.env.NODE_ENV === "development"
            ? LOCAL_SERVER
            : LIVE_SERVER;
    } , [] )


    const api = JSON.stringify( user?.api );

    const socket = useMemo( () => {
        return io( SERVER , { auth : { token } , query : `api=${ api }` } );
    } , [ SERVER , token , api ] );


    useEffect( () => {
        if ( token ) {
            socket.on( SOCKET_EVENTS.GET_BINANCE_STATS , ( data ) => {
                dispatch( setBinanceValues( data ) );
            } );

            return () => {
                if ( socket.readyState === 1 ) { // <-- This is important
                    // socket.close();
                    socket.disconnect();
                }
            }
        }
    } , [ token ] );
};


export default useBinanceSocket
