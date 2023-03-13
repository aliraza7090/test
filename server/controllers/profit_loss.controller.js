import { RISKS } from '#constants/index';
import asyncHandlerMiddleware from "#middlewares/asyncHandler.middleware";

import { Bot } from "#models/bot.model";
import assignProfit from "#utils/common/assignProfit";
import {
    calculateTotalProfit,
    calculateTotalRunningAssets,
    round3Precision,
    sumProfit
} from "#utils/common/calculations";
import dailyProfitChartAggregate from "#utils/profit_loss/aggergates/dailyProfitChartAggregate";
import todayProfit from "#utils/profit_loss/aggergates/todayProfit";
import totalProfitChartAggregate from "#utils/profit_loss/aggergates/totalProfitChartAggregate";
import getBills from "#utils/profit_loss/getBills";
import getProfitDistribution from "#utils/profit_loss/getProfitDistribution";
import getWinrate from "#utils/profit_loss/getWinrate";
import _ from "lodash";
import mongoose from "mongoose";


/**
 @desc     Profit Loss Account
 @route    GET /api/profit_loss/account
 @access   Private
 */

const getProfitLossAccountDetails = asyncHandlerMiddleware( async ( req, res ) => {
    const filter = {};
    const { _id :id, role } = req?.user || {};
    const { currency, coin_type } = req?.query || {};

    if ( currency ) filter[ "coin" ] = currency;
    if ( coin_type ) filter[ "coin_type" ] = coin_type;
    if ( id && role === "USER" ) filter[ "user" ] = mongoose.Types.ObjectId( id );

    const bots = await Bot.find( filter, { createdAt :1, profit :1, setting :1, investment :1, coin :1 } );
    const runningOrders = await Bot.countDocuments( { ...filter, isActive :true } );
    const _bots = await assignProfit( bots );

    //  NOTE::  Winrate Calculation Portion
    const winrateData = getWinrate( _bots ) //NOTE::Winrate

    //  NOTE::  Profit Distribution Calculation
    const { profitDistributionData } = getProfitDistribution( bots, currency );

    //  NOTE::  Total Profit Price Calculation
    const totalProfitPrice = _bots.reduce( calculateTotalProfit, 0 );
    const totalRunningAssets = _bots.reduce( calculateTotalRunningAssets, 0 )

    /*******    NOTE::      TOTAL PROFIT CHART      *********/
    const week = await totalProfitChartAggregate( 7, filter ) //NOTE:: Week Chart Data
    const fortnight = await totalProfitChartAggregate( 15, filter ) //NOTE:: Fortnight Chart Data
    const month = await totalProfitChartAggregate( 30, filter ) //NOTE::One Month Calculation

    const weekTotalPrice = sumProfit( week )
    const fortnightTotalPrice = sumProfit( fortnight )
    const monthTotalPrice = sumProfit( month )

    /*******    NOTE::      Daily PROFIT CHART      *********/
    const _week = await dailyProfitChartAggregate( 7, filter ); //  NOTE::Week Calculation
    const _fortnight = await dailyProfitChartAggregate( 15, filter ); //  NOTE::Fortnight Calculation
    const _month = await dailyProfitChartAggregate( 30, filter ); //   NOTE::One Month Calculation

    const _weekTotalPrice = await todayProfit( { ...filter, risk :RISKS[ 0 ] } )
    const _fortnightTotalPrice = await todayProfit( { ...filter, risk :RISKS[ 1 ] } )
    const _monthTotalPrice = await todayProfit( { ...filter, risk :RISKS[ 2 ] } )
    const todayProfitPrice = await todayProfit( filter )



    const data = {
        runningOrders,
        runningAssets :totalRunningAssets,
        todayProfitPrice :_.round( todayProfitPrice, 3 ),
        totalProfitPrice :_.round( totalProfitPrice, 3 ),
        totalProfitChart :{
            7 :round3Precision( weekTotalPrice ),
            15 :round3Precision( fortnightTotalPrice ),
            30 :round3Precision( monthTotalPrice )
        },
        totalProfit :{
            7 :week,
            15 :fortnight,
            30 :month
        },
        dailyProfitChart :{
            7 :round3Precision( _weekTotalPrice ),
            15 :round3Precision( _fortnightTotalPrice ),
            30 :round3Precision( _monthTotalPrice )
        },
        dailyProfit :{
            7 :_week,
            15 :_fortnight,
            30 :_month
        },
        profitDistribution :profitDistributionData,
        winrate :winrateData
    };

    res.status( 200 ).send( data );
} );

/**
 @desc     User Dashboard
 @route    GET /api/profit_loss/user_dashboard
 @access   Private
 */
const userDashboard = asyncHandlerMiddleware( async ( req, res ) => {
    const filter = {};
    const id = req?.user?._id;
    const exchange = req.query.exchange;

    if ( id ) {
        filter[ "user" ] = mongoose.Types.ObjectId( id );
    }

    if ( exchange ) {
        filter.exchange = _.toUpper( exchange );
    }

    const bots = await Bot.find( filter, { createdAt :1, profit :1, setting :1, investment :1, coin :1 } );
    const totalRunningBots = await Bot.countDocuments( { ...filter, isActive :true } )
    const _bots = await assignProfit( bots );

    //  NOTE::  Profit Distribution && Asset Allocation Calculation
    const { profitDistributionData, assetAllocationData } = getProfitDistribution( _bots ) // TODO:: May be pass bots

    const winrateData = getWinrate( _bots ) //NOTE::Winrate

    const totalProfitPrice = _bots.reduce( calculateTotalProfit, 0 ) //NOTE::Total Profit Price
    const totalRunningAssets = _bots.reduce( calculateTotalRunningAssets, 0 ) //NOTE::Total Running Assets
    const { billsData } = await getBills( id ) //NOTE:: Bills Stats


    /*******    NOTE::      TOTAL PROFIT CHART      *********/

    const week = await totalProfitChartAggregate( 7, filter ) //NOTE:: Week Chart Data
    const fortnight = await totalProfitChartAggregate( 15, filter ) //NOTE:: Fortnight Chart Data
    const month = await totalProfitChartAggregate( 30, filter ) //NOTE::One Month Calculation

    const weekTotalPrice = sumProfit( week )
    const fortnightTotalPrice = sumProfit( fortnight )
    const monthTotalPrice = sumProfit( month )


    /*******    NOTE::      Daily PROFIT CHART      *********/

    const _week = await dailyProfitChartAggregate( 7, filter ); //  NOTE::Week Calculation
    const _fortnight = await dailyProfitChartAggregate( 15, filter ); //  NOTE::Fortnight Calculation
    const _month = await dailyProfitChartAggregate( 30, filter ); //   NOTE::One Month Calculation

    const _weekTotalPrice = await todayProfit( { ...filter, risk :RISKS[ 0 ] } )
    const _fortnightTotalPrice = await todayProfit( { ...filter, risk :RISKS[ 1 ] } )
    const _monthTotalPrice = await todayProfit( { ...filter, risk :RISKS[ 2 ] } )
    const todayProfitPrice = await todayProfit( filter );


    const data = {
        runningAssets :totalRunningAssets,
        todayProfitPrice :round3Precision( todayProfitPrice ),
        totalProfitPrice :round3Precision( totalProfitPrice ),
        totalProfitChart :{
            7 :round3Precision( weekTotalPrice ),
            15 :round3Precision( fortnightTotalPrice ),
            30 :round3Precision( monthTotalPrice )
        },
        totalProfit :{
            7 :week,
            15 :fortnight,
            30 :month
        },
        dailyProfitChart :{
            7 :round3Precision( _weekTotalPrice ),
            15 :round3Precision( _fortnightTotalPrice ),
            30 :round3Precision( _monthTotalPrice )
        },
        dailyProfit :{
            7 :_week,
            15 :_fortnight,
            30 :_month
        },
        profitDistribution :profitDistributionData,
        winrate :winrateData,
        assetAllocation :assetAllocationData,
        botProfit :billsData,
        totalRunningBots
    };

    res.status( 200 ).send( data );
} );


/**
 @desc     User Paid History
 @route    GET /api/profit_loss/paid_history
 @access   Private
 */

const paidHistory = asyncHandlerMiddleware( async ( req, res ) => {
    const filter = { isActive :false };
    const id = req.user?._id;
    const role = req?.user?.role;
    const coin = req.query.coin;

    const calculateId = role === "ADMIN" ? undefined : id;


    if ( id && role === "USER" ) filter[ "user" ] = id;
    if ( coin ) filter[ "coin" ] = coin;

    const closeOrders = await Bot.countDocuments( { ...filter, isActive :false } );

    //  NOTE::  Billing Calculation & Data Portion
    const { billsData, amountPaid, amountUnpaid } = await getBills( calculateId );

    const data = {
        chart :billsData,
        amountPaid,
        amountUnpaid,
        closeOrders
    };

    res.status( 200 ).send( data );
} );

export { getProfitLossAccountDetails, userDashboard, paidHistory };
