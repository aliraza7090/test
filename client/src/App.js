import { ProtectedRoute, SideBar, UserSideBar } from 'components';

import { useBinanceSocket } from "hooks";
import React from 'react'
import { useSelector } from "react-redux";
import { Route, Routes } from 'react-router-dom';

import {
    Activity,
    ApiSetting,
    BillManagement,
    BotConfig,
    CoinMarket,
    Dashboard,
    Login,
    Manual,
    Market,
    PaidHistory,
    PLAccount,
    Portfolio,
    Prediction,
    Profile,
    ProfitLoss,
    Satistics,
    SetupBot,
    Trailing,
    UserAssignManagement,
    UserDashboard,
    UserManagement,
    UserProfit,
    UserStatistics
} from 'screens';
import ApiConfiguration from "screens/Admins/ApiConfiguration";
import EditUser from "screens/Admins/EditUser";
import SubAdminSidebar from "./components/Sidebar/SubAdminSidebar";


function App() {
    const { user } = useSelector( ( store ) => store.user );

    useBinanceSocket( user?.token )
    // useKucoinSocket(user?.token)


    return (
        <main className = 'custom-main'>
            { ( () => {
                const role = user?.role;
                if ( role === 'ADMIN' )
                    return <SideBar role = { role } />
                else if ( role === 'SUB_ADMIN' )
                    return <SubAdminSidebar role = { role } />
                else if ( role === 'USER' )
                    return <UserSideBar />
            } )() }

            <Routes>
                <Route path = '/login' element = { <Login /> } />
                {/*<Route path='/registration' element={<Registration/>}/>*/ }
                <Route path = 'bill-management/:id' element = { <BillManagement /> } />

                {/*==========   Admin Routes    ==========*/ }
                <Route exact path = '/' element = { <ProtectedRoute /> }>
                    <Route exact path = '/' element = { <Dashboard /> } />
                    <Route path = 'user-profit' element = { <UserProfit /> } />
                    <Route path = 'activity' element = { <Activity /> } />
                    <Route path = 'portfolio' element = { <Portfolio /> } />
                    <Route path = 'profit-loss' element = { <ProfitLoss /> } />
                    <Route path = 'coin-market' element = { <CoinMarket /> } />
                    <Route path = 'auto-rsi' element = { <SetupBot /> } />
                    <Route path = 'auto-trailing' element = { <Trailing /> } />
                    <Route path = 'manual-bot' element = { <Manual /> } />
                    <Route path = 'user-management' element = { <UserManagement /> } />
                    <Route path = 'satistics' element = { <Satistics /> } />
                    <Route path = 'pl-account' element = { <PLAccount /> } />
                    <Route path = 'user-assign-management' element = { <UserAssignManagement /> } />
                    <Route path = 'market' element = { <Market /> } />
                    <Route path = 'paid-history' element = { <PaidHistory /> } />
                    <Route path = 'api-configuration' element = { <ApiConfiguration /> } />
                    <Route path = 'edit-user' element = { <EditUser /> } />
                    <Route path = 'profile' element = { <Profile /> } />

                </Route>
                {/*==========   User Routes    ==========*/ }
                <Route exact path = 'user' element = { <ProtectedRoute /> }>
                    <Route path = 'bot-config' element = { <BotConfig /> } />
                    <Route path = 'prediction' element = { <Prediction /> } />
                    <Route path = 'satistics' element = { <UserStatistics /> } />
                    <Route path = 'pl-account' element = { <PLAccount isAdmin = { true } /> } />
                    <Route path = 'paid-history' element = { <PaidHistory isAdmin = { true } /> } />
                    <Route path = 'dashboard' element = { <UserDashboard /> } />
                    <Route path = 'api-setting' element = { <ApiSetting /> } />
                    <Route path = 'market' element = { <Market /> } />
                    <Route path = 'profile' element = { <Profile /> } />
                </Route>

                {/*==========   Sub Admin Routes    ==========*/ }
                <Route exact path = 'sub_admin' element = { <ProtectedRoute /> }>
                    <Route path = 'activity' element = { <Activity /> } />
                    <Route path = 'portfolio' element = { <Portfolio /> } />
                    <Route path = 'auto-rsi' element = { <SetupBot /> } />
                    <Route path = 'user-management' element = { <UserManagement /> } />
                    <Route path = 'profile' element = { <Profile /> } />

                </Route>
                <Route path = '*' element = { <div className = 'page_notfound'><h6> 404 Page not found </h6></div> } />
            </Routes>
        </main>
    );
}

export default App;
