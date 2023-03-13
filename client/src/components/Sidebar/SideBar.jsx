import {useState} from 'react'
import {useQuery} from "react-query";
import {useDispatch} from "react-redux";
import {Link, NavLink} from 'react-router-dom'


import {apis} from "services";
import {imageURL} from 'hooks'
import CustomDropdown from '../CustomDropdown'
import {logout} from "redux/slices/user.slice";
import {clearBinanceValues} from "redux/slices/binance.slice";
import {clearKucoinsValues} from "redux/slices/kucoin.slice";

import '../../assets/css/sidebar.css'
import {toast} from "react-toastify";

function SideBar({role}) {
    const dispatch = useDispatch();
    const [isShow, setIsShow] = useState(true);

    const {refetch} = useQuery(['logout'], apis.logout, {enabled: false});
    const {refetch: clearData} = useQuery('clear_data', apis.clearData, {
        enabled: false,
        onSuccess: async ({data}) => {
            await toast.success(data);
            await dispatch(logout())
            await dispatch(clearBinanceValues())
            window.location.reload()
        }
    })

    const handleLogout = async (e) => {
        e.stopPropagation();
        await refetch()
        await dispatch(logout())
        await dispatch(clearBinanceValues())
    }
    const handleClearData = async (e) => {
        e.preventDefault();
        if(window.confirm('Are you Sure You?')) await clearData()
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
                <Link to={'/'}>
                    <img src={imageURL('logo.png')} alt="Logo" className='logo'/>
                </Link>
            </div>
            <div className="side-main custom-scroll">
                <ul className="side-list">
                    <li className='side-link'>
                        <CustomDropdown title={'Dashboard'}>
                            <ul>
                                <li>
                                    <NavLink to='/'>Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/activity'}>All Activity</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/portfolio'}>User Portfolio</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/coin-market'}>Coin Market</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/'}>Total Bot</NavLink>
                                </li>
                            </ul>
                        </CustomDropdown>
                    </li>
                    <li className="side-link">
                        <NavLink to={"/market"}>Market</NavLink>
                    </li>
                    <li className='side-link'>
                        <CustomDropdown title={'admin Profile'}>
                            <ul>
                                <li>
                                    <NavLink to={'/user-management'}>Manage User</NavLink>
                                </li>
                                {role === "ADMIN" ?
                                    <>
                                        <li>
                                            <NavLink to={'/user-assign-management'}>Sub Admin</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to={'/'} onClick={handleClearData}>Clear Data</NavLink>
                                        </li>
                                    </> :
                                    <></>}
                            </ul>
                        </CustomDropdown>
                    </li>

                    {/*<li className='side-link'>
                        <CustomDropdown title={'User Support'}>
                            <ul>
                                 <li>
                                    <NavLink to={'/'}>All Activity</NavLink>
                                </li>
                            </ul>
                        </CustomDropdown>
                    </li>*/}
                    <li className="side-link">
                        <NavLink to={"/satistics"}>Statistics</NavLink>
                    </li>
                    <li className="side-link">
                        <NavLink to={"/pl-account"}>PL Account</NavLink>
                    </li>
                    <li className="side-link">
                        <NavLink to={"/profile"}>Profile</NavLink>
                    </li>
                    <li className="side-link">
                        <NavLink onClick={handleLogout} to='/login'>Logout</NavLink>
                    </li>
                </ul>
            </div>
        </aside>
    </>
}

export default SideBar
