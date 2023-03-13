import { DOMAIN, STAGES } from "#constants/index";
import asyncHandlerMiddleware from "#middlewares/asyncHandler.middleware";
import { Bot } from "#models/bot.model";
import assignProfit from "#utils/common/assignProfit";
import * as fs from "fs";
import json2xls from 'json2xls';
import path, { dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

/**
 @desc     Export Bot Data
 @route    GET /api/admin/export/bot
 @access   Private (Admin)
 */

const exportBotData = asyncHandlerMiddleware( async ( req, res ) => {
    const records = [];
    let incrementer = 1
    const bots = await Bot.find(
        { isDeleted :false },
        {
            exchange :1,
            coin :1,
            investment :1,
            risk :1,
            day :1,
            profit :1,
            user :1,
            setting :1
        }
    ).populate( 'user', 'name' ).populate( 'setting' );
    const _bots = await assignProfit( bots );


    const _d = _bots.map( ( bot, index ) => {
        let profit = 0;


        for ( let k in bot?.setting ) {
            const setting = bot[ 'setting' ][ k ];

            const record = {
                "ID" :incrementer,
                'USER' :bot[ 'user' ][ 'name' ],
                'SYMBOL' :bot[ 'coin' ],
                'EXCHANGE' :bot[ 'exchange' ],
                'INVESTMENT' :bot[ 'investment' ],
                'RISK' :STAGES[ bot[ 'risk' ] ],
                'DAY' :bot[ 'day' ],
                'BOT_ID' :index + 1,
                'STRATEGY' :setting[ 'indicator' ] || "Manual",
                'BUY/SELL' :formatStats( setting[ 'stats' ] ),
                'PROFIT' :setting[ 'profit' ]
            }

            records.push( record );
            incrementer++
        }
    } );

    const xls = json2xls( records );
    const folder = path.resolve( '' ) + '/server/data/';
    const filename = `${ Date.now() }.xlsx`
    const fullPath = folder + filename
    const downloadPath = DOMAIN + `data/${ filename }`

    // console.log({folder,filename, fullPath,downloadPath})

    fs.writeFileSync( fullPath, xls, 'binary' );

    res.status( 200 ).send( downloadPath );
} );


export { exportBotData }

function formatStats( stats ) {
    return stats?.buy?.reduce( ( data, value, index ) => {
        const buy = stats[ 'buy' ]?.[ index ] || 0;
        const sell = stats[ 'sell' ]?.[ index ] || 0;
        data += `(${ buy }/${ sell }),`;
        return data;
    }, '' );
}
