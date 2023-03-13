import { EXCHANGES, RISKS } from "#constants/index";
import asyncHandlerMiddleware from "#middlewares/asyncHandler.middleware";

import { Bot } from "#models/bot.model";
import assignProfit from "#utils/common/assignProfit";
import {
    calculateProfitLoss,
    calculateTotalProfit,
    calculateTotalRunningAssets,
    round3Precision,
    sumProfit
} from "#utils/common/calculations";
import dailyProfitChartAggregate from "#utils/profit_loss/aggergates/dailyProfitChartAggregate";
import profitLoss from "#utils/profit_loss/aggergates/profitLoss";
import todayProfit from "#utils/profit_loss/aggergates/todayProfit";
import totalProfitChartAggregate from "#utils/profit_loss/aggergates/totalProfitChartAggregate";
import getBills from "#utils/profit_loss/getBills";
import getProfitDistribution from "#utils/profit_loss/getProfitDistribution";
import getWinrate from "#utils/profit_loss/getWinrate";
import _ from "lodash";


const getUsersPortfolio = asyncHandlerMiddleware( async ( req, res ) => {
    const bots = await Bot.find().populate( 'user', [ 'name', 'active', 'isAdminApprove' ] );
    res.status( 200 ).send( bots )
} );

/**
 @desc     Profit Loss Admin Dashboard
 @route    GET /api/admin/profit_loss/dashboard
 @access   Private
 */
const getProfitLossDashboard = asyncHandlerMiddleware( async ( req, res ) => {
    const filter = { exchange :EXCHANGES[ 0 ] }
    const exchange = req?.query?.exchange;

    if ( exchange )
        filter[ 'exchange' ] = _.toUpper( exchange );

    const bots = await Bot.find( filter );
    const runningBots = await Bot.countDocuments( { ...filter, isActive :true } )
    const _bots = await assignProfit( bots );

    const winrateData = getWinrate( _bots ) //NOTE::Winrate

    //  NOTE::  Profit Distribution && Asset Allocation Calculation
    const { profitDistributionData, assetAllocationData } = getProfitDistribution( _bots ) // TODO:: May be pass bots

    const totalProfitPrice = _bots.reduce( calculateTotalProfit, 0 ) //NOTE::Total Profit Price
    const totalRunningAssets = _bots.reduce( calculateTotalRunningAssets, 0 ) //NOTE::Total Running Assets
    const { billsData } = await getBills() //NOTE:: Bills Stats

    /*******    NOTE::      TOTAL PROFIT CHART      *********/

    const week = await totalProfitChartAggregate( 7, filter ) //NOTE:: Week Chart Data
    const fortnight = await totalProfitChartAggregate( 15, filter ) //NOTE:: Fortnight Chart Data
    const month = await totalProfitChartAggregate( 30, filter ) //NOTE::One Month Calculation

    const weekTotalPrice = sumProfit( week )
    const fortnightTotalPrice = sumProfit( fortnight )
    const monthTotalPrice = sumProfit( month );


    /*******    NOTE::      Daily PROFIT CHART      *********/

    const _week = await dailyProfitChartAggregate( 7, filter ); //  NOTE::Week Calculation
    const _fortnight = await dailyProfitChartAggregate( 15, filter ); //  NOTE::Fortnight Calculation
    const _month = await dailyProfitChartAggregate( 30, filter ); //   NOTE::One Month Calculation

    const _weekTotalPrice = await todayProfit( { risk :RISKS[ 0 ] } )
    const _fortnightTotalPrice = await todayProfit( { risk :RISKS[ 1 ] } )
    const _monthTotalPrice = await todayProfit( { risk :RISKS[ 2 ] } )
    const todayProfitPrice = await todayProfit( filter );

    const data = {
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
        winrate :winrateData,
        assetAllocation :assetAllocationData,
        botProfit :billsData,
        totalRunningBots :runningBots
    };

    res.status( 200 ).send( data );
} )

/**
 @desc     Profit Loss Admin Statistics
 @route    GET /api/admin/profit_loss/statistics
 @access   Private
 */
const getProfitLossStatistics = asyncHandlerMiddleware( async ( req, res ) => {
    const bots = await Bot.find();
    const _bots = await assignProfit( bots );

    console.log(_bots);

    //  NOTE::  Total Profit Price Calculation
    const totalProfitPrice = _bots.reduce( calculateTotalProfit, 0 );

//  NOTE::  Calculating Total Running Assets
    const totalRunningAssets = _bots.reduce( calculateTotalRunningAssets, 0 )

    const todayProfitPrice = await todayProfit();

    const data = {
        running :{
            totalProfitUSDT :_.round( totalProfitPrice, 3 ),
            assetsUSDT :totalRunningAssets,
            today :_.round( todayProfitPrice, 3 )
        },
        history :{
            total :_.round( totalProfitPrice, 3 ),
            today :_.round( todayProfitPrice, 3 )
        },
        totalProfit :_.round( totalProfitPrice, 3 )
    }

    res.status( 200 ).send( data );
} )

const getProfitLoss = asyncHandlerMiddleware( async ( req, res ) => {
    const month = await profitLoss( 30 );
    const monthStats = month.reduce( calculateProfitLoss, { profit :0, loss :0 } )
    const fortnight = await profitLoss( 15 );
    const fortnightStats = fortnight.reduce( calculateProfitLoss, { profit :0, loss :0 } )
    const week = await profitLoss( 7 );
    const weekStats = week.reduce( calculateProfitLoss, { profit :0, loss :0 } )

    const data = {
        // Daily: {profit: 0, loss: 0},
        7 :weekStats,
        15 :fortnightStats,
        30 :monthStats
    }

    res.status( 200 ).send( data )
} )

export { getUsersPortfolio, getProfitLossDashboard, getProfitLossStatistics, getProfitLoss }
