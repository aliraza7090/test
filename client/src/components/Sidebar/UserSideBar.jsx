import {useState} from 'react'

import {useQuery} from "react-query";
import {useDispatch} from "react-redux";
import {Link, NavLink, useLocation} from 'react-router-dom'

import '../../assets/css/sidebar.css'

import {apis} from "services";
import {imageURL} from 'hooks'
import CustomDropdown from '../CustomDropdown'
import {logout} from "redux/slices/user.slice";
import {clearKucoinsValues} from "redux/slices/kucoin.slice";
import {clearBinanceValues} from "redux/slices/binance.slice";

function UserSideBar() {
    const dispatch = useDispatch();
    const [isShow, setIsShow] = useState(true);
    const location = useLocation();

    const { refetch } = useQuery(['logout'], apis.logout, {enabled: false})

    const handleLogout = async (e) => {
        e.stopPropagation();
        await refetch();
        await dispatch(logout())
        await dispatch(clearBinanceValues())
    }

    return <>
        <aside className={'custom-sidebar ' + (isShow ? 'side-show' : 'side-hide')}>
            <div className="sidebar-close" onClick={() => setIsShow(prevIsShow => !prevIsShow)}>
                {
                    isShow ?
                        <i className="fa-solid fa-chevron-left"></i>
                        :
                        <i className="fa-solid fa-chevron-right"></i>
                }

            </div>
            <div className="logo-section">
                <Link to={'/user/dashboard'}>
                    <img src={imageURL('logo.png')} alt="Logo" className='logo'/>
                </Link>
            </div>
            <div className="side-main custom-scroll">
                <ul className="side-list">

                    <li className="side-link">
                        <NavLink to={"/user/dashboard"}>Dashboard</NavLink>
                    </li>
                    <li className="side-link">
                        <NavLink to={"/user/bot-config"}>Add Bot</NavLink>
                    </li>
                    <li className='side-link'>
                        <CustomDropdown title={'Detail'}>
                            <ul>
                                <li>
                                    <NavLink to={"/user/satistics"}>Statistics</NavLink>
                                </li>
                                <li>
                                    <NavLink to={"/user/market"}>Market</NavLink>
                                </li>
                                <li>
                                    <NavLink to={"/user/pl-account"}
                                             className={location.pathname == "/user/paid-history" && "active"}>PL
                                        Account</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/user/api-setting'}>Apis Setting</NavLink>
                                </li>
                                {/*<li >
                                <NavLink to={"/user/prediction"}>Prediction</NavLink>
                            </li>*/}
                            </ul>
                        </CustomDropdown>
                    </li>
                    <li className="side-link">
                        <NavLink to={"/user/profile"}>Profile</NavLink>
                    </li>
                    <li className="side-link">
                        <NavLink onClick={handleLogout} to={'#'}>Logout</NavLink>
                    </li>

                </ul>
            </div>
        </aside>
    </>
}

export default UserSideBar
