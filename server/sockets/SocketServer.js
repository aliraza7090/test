import { SOCKET_EVENTS, USER_ROLES } from "#constants/index";
import { eventEmitter } from "#sockets/CoinStats";
import getBinanceAccountBalance from "#utils/binance/getBinanceAccountBalance";

import { getEnv } from "#utils/common/env";
import jwt from "jsonwebtoken";
import _ from 'lodash'
import { Server } from "socket.io";


class SocketServer {
    constructor( server, config = {} ) {
        const io = new Server( server, config );
        
        // Socket Middleware
        io.use( async ( socket, next ) => {
            try {
                const token = socket.handshake?.auth?.token || ''
                const user = jwt.verify( token, getEnv( 'JWT_SECRET' ) );
                
                // console.log('::::::::   ROLE :::::::::', user.role);
                
                
                if ( [ USER_ROLES[ 0 ], USER_ROLES[ 2 ] ].includes( user.role ) ) // Admin, SubAdmin
                {
                    const privateKeys = {
                        binance :{
                            apiKey :getEnv( 'ADMIN_BINANCE_API_KEY' ),
                            secret :getEnv( 'ADMIN_BINANCE_API_SECRET' )
                        }
                    };
                    
                    socket.handshake.query.api = JSON.stringify( privateKeys )
                }
                
                //Invalid token condition
                if ( !user ) next( new Error( "invalid token" ) );
                
                socket.data.user = user;
                next()
            } catch ( e ) {
                next( new Error( "Unauthorized user" ) );
            }
        } );
        
        this.socket = io.of( '/' ).on( "connection", async socket => {
            const userId = _.get( socket, 'data.user._id', '' );
            const role = _.get( socket, 'data.user.role', '' );
            const api = _.get( socket, 'handshake.query.api', '{"binance":{"apiKey":"","secret":""}' );
            
            /*Binance*/
            const receiveBinanceEvent = `${ SOCKET_EVENTS.hit_binance_api }_${ userId }`;
            const sendBinanceDataEvent = `${ SOCKET_EVENTS.send_binance_api_data }_${ userId }`;
            
            /*Kucoin*/
            const receiveKucoinEvent = `${ SOCKET_EVENTS.HIT_KUCOIN_API }_${ userId }`;
            const sendKucoinDataEvent = `${ SOCKET_EVENTS.SEND_KUCOIN_API_DATA }_${ userId }`;
            
            console.log( `SOCKET ID: ${ socket.id } Connected` )
            
            
            eventEmitter.on( "stats", ( data ) => {
                setTimeout( () => {
                    this.socket.emit( SOCKET_EVENTS.GET_BINANCE_STATS, data );
                }, 200 )
            } )
            
            const {
                binance :binanceApiKeys,
                ku_coin :kucoinApiKeys
            } = [ undefined, 'undefined' ].includes( socket?.handshake?.query?.api )
                ? {
                    binance :{ apiKey :'', secret :'' },
                    ku_coin :{ apiKey :'', secret :'', passphrase :'' }
                } // default
                : JSON.parse( api ); // apis from socket client
            
            const isBinanceKeysValid = ( binanceApiKeys ) => {
                if ( _.isEmpty( binanceApiKeys ) ) {
                    return false
                } else
                    return binanceApiKeys[ 'apiKey' ] !== '' && binanceApiKeys[ 'secret' ] !== '';
            };
            
            if ( isBinanceKeysValid( binanceApiKeys ) ) {
                if ( role === USER_ROLES[ 1 ] ) {
                    const accountBalance = await getBinanceAccountBalance( undefined, binanceApiKeys );
                    socket.emit( SOCKET_EVENTS.GET_BINANCE_ACCOUNT_BALANCE, accountBalance )
                }
            }
            
            socket.on( "disconnect", () => {
                // clearInterval( timerId )
                console.log( `SOCKET ID: ${ socket.id } Disconnected` )
            } )
        } )
    }
};


export default SocketServer
