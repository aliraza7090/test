import {NavLink} from "react-router-dom"
import {COINS} from "../constants";
import {useSelector} from "react-redux";

export default function PaidHistoryTabs({tab, setTab, isPageHistoryPage}) {
    const {user} = useSelector(store => store.user);
    return <>
        {isPageHistoryPage ? <></> : (
            <div className="bot-tabs mt-3 mb-3">
                <ul>
                    <li>
                        <a className={tab === COINS.eth && "active"} onClick={() => setTab(COINS.eth)}
                           href="#">{COINS.eth}</a>
                    </li>
                    <li>
                        <a className={tab === COINS.btc && "active"} onClick={() => setTab(COINS.btc)}
                           href="#">{COINS.btc}</a>
                    </li>
                </ul>
            </div>
        )}

        <div className="profit-loss-tab mb-5">
            <ul>
            {
                    user?.role === 'USER' &&
                 <>
                    <li>
                    <NavLink to={'/user/pl-account'}>Total Profit</NavLink>
                    </li>
                 <li>
                 <NavLink to={'/user/paid-history'}>Paid History</NavLink>
                </li>
                </>

            }
                {
                 user?.role === 'ADMIN' && <>

                    <li>
                        <NavLink to={'/pl-account'}>Total Profit</NavLink>
                    </li>

                    {/* <li>
                        <NavLink to={'/user-profit'}>Total Profit by Users</NavLink>
                    </li>
     */}
                    <li>
                    <NavLink to={'/paid-history'}>Paid History</NavLink>
                   </li>
                    </>
               }
            </ul>
        </div>
    </>
}
