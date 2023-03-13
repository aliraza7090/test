import React, {useEffect, useState} from "react"

import _ from 'lodash';
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {useMutation} from "react-query";
import {useLocation, useNavigate} from "react-router-dom";

import {apis} from "services";
import {isBotStopped} from "utils";
import {useFetchRSI} from "hooks";
import {AutoTabs} from "components";
import Manual from "screens/SetupBot/Manual";
import getRSIFormatTime from "utils/getRSIFormat";
import Automatic from "screens/SetupBot/Automatic";
import setupBotValidation from "validations/setupBot";
import {ExchangePrices, Step3Buying} from "components/admin";
import {INDICATORS, OPERATIONS, RISKS} from "../../constants";

const INITIAL_BOT_SETTING = {
    manual: {low: 0, up: 0, investment: 0, isActive: false},
    trailing: {low: 0, up: 0, investment: 0, isActive: false},
    rsi: {low: 0, up: 0, investment: 0, time: 0, isActive: false},
};

const INITIAL_STATS = {buy: [], sell: []};

const getInitialState = ({setting, user, isActive, coin, availableBalance, investment, exchange}, data) => {
    if (setting) {
        return {...data, availableBalance, investment, coin, exchange}
    }
}

function SetupBot() {
    const {state} = useLocation();
    const navigate = useNavigate();


    const {user} = useSelector(store => store.user);
    const {data: coins} = useSelector(store => store.binance)
    const {data: kucoins} = useSelector(store => store.kucoin)

    const [botSetting, setBotSetting] = useState(INITIAL_BOT_SETTING);
    const [selectedBotId, setSelectedBotId] = useState(null);
    const [stats, setStats] = useState(INITIAL_STATS);
    const [data, setData] = useState({
        coin: '',
        risk: RISKS[0],
        indicator: INDICATORS.rsi,
        operation: OPERATIONS.auto,
        configured_by: user?.name,
    });
    const [routeState, setRouteState] = useState(null);

    const {rsiValue, refetchRSIValue, fetchingRSIValue} = useFetchRSI({
        coin: data?.coin,
        time: botSetting?.rsi?.time,
        exchange: routeState?.exchange
    })


    /************** ***  UseEffects   **********************/
    // NOTE:: Set Default BotSetting from router state
    useEffect(() => {
        if (routeState) {
            const setting = _.get(routeState, 'setting', {INITIAL_BOT_SETTING})
            setBotSetting(setting);
        }
    }, [routeState]);

    useEffect(() => {
        if (data?.indicator && routeState) {
            if (data?.operation === OPERATIONS.manual) {
                const stats = _.get(routeState, `setting.manual.stats`, INITIAL_STATS);
                setStats(stats);
            } else {
                const indicator = _.lowerCase(data?.indicator);
                const stats = _.get(routeState, `setting.${indicator}.stats`, INITIAL_STATS)
                setStats(stats);
            }
        }
    }, [data.indicator, routeState, data.operation]);


    useEffect(() => {
        if (state)
            setRouteState(state);
    }, [state]);

    useEffect(() => {
        if (routeState && user) {
            setData(getInitialState(
                {...routeState}, data))
        }
    }, [routeState])

    useEffect(() => {
        if (!state) {
            toast.warn('Access denied.')
            navigate('/activity')
        }
    }, []);

    useEffect(() => {
        (async () => {
            const conditionFetchRSI = data?.indicator === INDICATORS.rsi && (botSetting?.rsi?.time && data.coin);
            // console.log({i: data?.indicator, t: botSetting?.rsi?.time, c: data?.coin});
            if (conditionFetchRSI)
                await refetchRSIValue()
        })()
    }, [data.indicator, botSetting?.rsi?.time, data.coin, refetchRSIValue]);

    useEffect(() => {

        if(data?.operation === OPERATIONS?.auto) {
            if (data?.indicator === INDICATORS.rsi){
                setSelectedBotId(botSetting?.rsi?._id)
                // console.log(botSetting?.rsi?._id,'_______#######');
            }
            else if (data?.indicator === INDICATORS.trailing){
                setSelectedBotId(botSetting.trailing?._id)
                // console.log(botSetting.trailing?._id,'_______#######')
            }
        }else if(data?.operation === OPERATIONS?.manual) {
            setSelectedBotId(botSetting?.manual?._id);
            // console.log(botSetting.manual?._id,'_______#######')
        }

    },[data?.indicator, data?.operation, botSetting])

    const {mutate: setupBot, isLoading} = useMutation('saveBotSettings', apis.configureBotSetting, {
        onError: ({message}) => toast.error(message),
        onSuccess: ({data, status}) => {
            if (status === 200) {
                toast.success(data);
                navigate('/activity')
                setData(getInitialState(user))
            }
            // console.log({data, status});
        }
    });

    const onTypeHandler = (key, value) => setData(prevState => ({...prevState, [key]: value}));
    const handleTimeSelect = (time) => setData(prevState => ({
        ...prevState,
        ['time']: getRSIFormatTime(time, routeState?.exchange)
    }));

    const onChangeBotSettingHandler = (event) => {
        const {name, value} = event.target;
        const type = data?.indicator === INDICATORS.rsi ? 'rsi' : 'trailing';
        if (name === 'botStatus') /* Handling bot switch */ {
            setBotSetting(prevState => ({
                ...prevState,
                [type]: {...prevState[type], isActive: !prevState[type]['isActive']}
            }))
        } else if (name === 'time') /* Handling RSI values */ {
            setBotSetting(prevState => ({
                ...prevState,
                [type]: {...prevState[type], time: getRSIFormatTime(value, routeState?.exchange)}
            }));
        } else {
            setBotSetting(prevState => ({...prevState, [type]: {...prevState[type], [name]: value}}))
        }
    }

    const onSubmitHandler = (e) => {
        const botId = routeState?._id
        const {coin, risk, indicator, operation, availableBalance, ...bot} = data;
        const body = {bot: bot, botSetting, user_id: routeState?.user?._id};

        const {error} = setupBotValidation(body);
        if (error) return toast.error(error.details[0].message);

        const investment1 = Number(botSetting['rsi']['investment']);
        const investment2 = Number(botSetting['manual']['investment']);
        const investment3 = Number(botSetting['trailing']['investment']);

        const total = investment1 + investment2 + investment3;

        if (availableBalance > bot.investment) {
            if (total > availableBalance) {
                toast.warn(`Investment (${total}) is greater than available balance (${availableBalance})`);
                return;
            }
        } else {
            if (total > bot.investment) {
                toast.warn(`Investment(${total}) is greater than Total investment (${bot.investment})`);
                return;
            }
        }
        const hasToCloseOrder = isBotStopped(routeState['setting'], botSetting);

        setupBot({id: botId, body: {...body, hasToCloseOrder}});
    }

    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <h3 className="section-title">SETUP BOT</h3>
                <div className='d-flex justify-content-between'>
                    <ExchangePrices
                        data={data}
                        rsiValue={rsiValue}
                        exchange={routeState?.exchange}
                        kucoins={kucoins}
                        coins={coins}
                        loading={fetchingRSIValue}
                    />
                    <div className='align-self-center'>
                        <AutoTabs indicator={data.indicator} operation={data.operation} setData={setData}/>
                    </div>
                    <div/>
                </div>
                {
                    data.operation === OPERATIONS.auto
                        ? <Automatic
                            data={data}
                            onTypeHandler={onTypeHandler}
                            onSubmitHandler={onSubmitHandler}
                            handleTimeSelect={handleTimeSelect}
                            setting={data?.indicator === INDICATORS.rsi ? botSetting.rsi : botSetting.trailing}
                            setBotSetting={setBotSetting}
                            onChangeBotSettingHandler={onChangeBotSettingHandler}
                        />
                        : <Manual
                            coin={data?.coin || ''}
                            onSubmitHandler={onSubmitHandler}
                            setting={botSetting.manual}
                            setBotSetting={setBotSetting}
                        />
                }
                <div className='text-center mt-5'>
                    <button className='custom-btn primary-btn mt-2 w-50' disabled={isLoading}
                            onClick={onSubmitHandler}>
                        {isLoading ? 'Saving' : 'Save Bot Settings'}
                    </button>

                </div>
                <div className='text-center'>
                    <button className='custom-btn primary-btn mt-2 w-50'
                            style={{background: "#6B6B6B"}}
                            onClick={() => navigate('/activity')}>
                        Go Back
                    </button>
                </div>
            </div>
            <Step3Buying
                risk={routeState?.risk}
                data={stats}
                isManualTab={data?.operation === OPERATIONS.manual}
                setting_id={selectedBotId}
            />
        </div>
    </>
}

export default SetupBot
