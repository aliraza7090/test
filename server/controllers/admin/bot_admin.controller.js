import { EXCHANGES } from "#constants/index";
import asyncHandlerMiddleware from "#middlewares/asyncHandler.middleware";
import { Bot } from "#models/bot.model";
import { Profit } from '#models/profit.model';
import { subAdminUsers } from '#models/sub_admin_users';
import { UserModel } from '#models/user.model';
import binanceApi from '#services/binance';
import binanceCloseOrder from "#utils/binance/binanceCloseOrder";
import getBinanceParams from '#utils/binance/getBinanceParams';
import assignProfit from '#utils/common/assignProfit';
import extractApiKeys from '#utils/common/extractApiKeys';
import kucoinCloseOrder from "#utils/kucoin/kucoinCloseOrder";

import _ from "lodash"


/**
 @desc     Delete User Bot
 @route    DELETE /api/admin/bot/:id
 @access   Private (Admin)
 */
const deleteBot = asyncHandlerMiddleware( async ( req, res ) => {
    const id = req.params.id;
    
    const bot = await Bot.findById( id, {
        setting :1,
        exchange :1,
        user :1
    } ).populate( 'setting', 'investment low up isActive hasPurchasedCoins profit' );
    
    if ( !bot )
        return res.status( 200 ).send( `No Record Found` );
    
    const { exchange, user } = bot || {};
    
    exchange === EXCHANGES[ 0 ]
        ? await binanceCloseOrder( { bot_id :id, user_id :user } ) //  BINANCE EXCHANGE
        : await kucoinCloseOrder( { bot_id :id, user_id :user } ) //  KUCOIN EXCHANGE
    
    await Bot.findByIdAndUpdate( id, { $set :{ isDeleted :true } } );
    await Profit.deleteMany( { bot :id } )
    res.status( 200 ).send( 'Bot Successfully Deleted' )
} )

/**
 @desc     Activity Record Bots
 @route    GET /api/admin/activity
 @access   Private (Admin)
 */
const botsActivity = asyncHandlerMiddleware( async ( req, res ) => {
    const filter = {};
    
    const users = await UserModel.find( { role :"USER" }, [ 'name', 'email', 'api', 'role' ] ).lean();
    
    const updatedRecord = await Promise.all( users.map( async user => {
                const { _id, role } = user;
                const balances = {};
                
                if ( role === 'SUB_ADMIN' ) {
                    const subAdmin = await subAdminUsers.findOne( { sub_admin :_id } );
                    filter[ 'user' ] = { $in :subAdmin?.users };
                }
                const bots = await Bot.find( filter ).populate( "user" ).populate( 'setting', 'risk investment operation low up takeProfit indicator isActive time stats' );
                const _bots = await assignProfit( bots );
                
                try {
                    const { apiKey, secret } = extractApiKeys( user?.api );
                    const params = getBinanceParams( undefined, secret );
                    const { data, status } = await binanceApi.accountInformation( params, apiKey );
                    
                    for ( let balance of data?.balances ) {
                        switch ( balance?.asset ) {
                            case 'BTC':
                                balances[ 'btc' ] = _.round( balance?.free, 2 );
                                break;
                            case 'ETH':
                                balances[ 'eth' ] = _.round( balance?.free, 2 );
                                break;
                            case 'USDT':
                                balances[ 'usdt' ] = _.round( balance?.free, 2 );
                                break;
                            default:
                        }
                        if ( Object?.keys( balances )?.length === 3 )
                            break;
                    }
                    
                } catch
                    ( e ) {
                    const error = e.response?.data || e;
                    console.log( { error } );
                    balances[ 'usdt' ] = 0;
                    balances[ 'btc' ] = 0;
                    balances[ 'eth' ] = 0;
                }
                
                return ( { ...user, ...balances, bots :_bots } );
            } )
        )
    ;
    
    
    res.send( updatedRecord )
} )

export { deleteBot, botsActivity }
