import { LIVE_SERVER, LOCAL_SERVER, SOCKET_EVENTS } from 'constants';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBalance } from 'redux/slices/binance.slice';
import io from 'socket.io-client';


const useFetchAccountBalance = () => {
    const dispatch = useDispatch();
    const { user } = useSelector( state => state.user );
    const token = user?.token;

    const SOCKET_URL = useMemo( () => {
        return process.env.NODE_ENV === "development"
            ? LOCAL_SERVER
            : LIVE_SERVER;
    }, [] );

    const socket = useMemo( () => {
        const api = JSON.stringify( user?.api );
        const token = user?.token;

        return io( SOCKET_URL, { auth :{ token }, query :`api=${ api }` } );
    }, [ SOCKET_URL, user ] );

    useEffect( () => {
        if ( token ) {
            socket.on( SOCKET_EVENTS.GET_BINANCE_ACCOUNT_BALANCE, ( balance ) => {
                dispatch( setBalance( balance ) );
            } );
            return () => {
                if ( socket.readyState === 1 ) { // <-- This is important
                    // socket.close()
                    socket.disconnect();
                }
            }
        }

    }, [ token,dispatch ] )
};


export default useFetchAccountBalance
