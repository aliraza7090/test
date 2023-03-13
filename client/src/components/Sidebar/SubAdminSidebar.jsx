import {useState} from "react";
import {useQuery} from "react-query";
import {useDispatch} from "react-redux";

import {apis} from "services";
import {imageURL} from "hooks";
import {logout} from "redux/slices/user.slice";
import {clearBinanceValues} from "redux/slices/binance.slice";
import {clearKucoinsValues} from "redux/slices/kucoin.slice";
import {Link, NavLink} from "react-router-dom";
import CustomDropdown from "../CustomDropdown";

const SubAdminSidebar = () => {
    const dispatch = useDispatch();
    const [isShow, setIsShow] = useState(true);

    const {refetch} = useQuery(['logout'], apis.logout, {enabled: false});

    const handleLogout = async (e) => {
        e.stopPropagation();
        await refetch()
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
                <Link to={'/'}>
                    <img src={imageURL('logo.png')} alt="Logo" className='logo'/>
                </Link>
            </div>
            <div className="side-main custom-scroll">
                <ul className="side-list">
                    <li className='side-link'>
                        <CustomDropdown title={'Dashboard'}>
                            <ul>
                                {/*<li>
                                    <NavLink to='/'>Home</NavLink>
                                </li>*/}
                                <li> <NavLink to={'/sub_admin/activity'}>All Activity</NavLink> </li>
                                <li> <NavLink to={'/sub_admin/portfolio'}>User Portfolio</NavLink> </li>
                                <li> <NavLink to={'/sub_admin/user-management'}>Manage User</NavLink> </li>
                               {/* <li>
                                    <NavLink to={'/coin-market'}>Coin Market</NavLink>
                                </li>*/}
                                {/*<li>
                                    <NavLink to={'/'}>Total Bot</NavLink>
                                </li>*/}
                            </ul>
                        </CustomDropdown>
                    </li>
                    {/*<li className="side-link">
                        <NavLink to={"/market"}>Market</NavLink>
                    </li>*/}
                    {/*<li className='side-link'>
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
                                    </> :
                                    <></>}
                            </ul>
                        </CustomDropdown>
                    </li>*/}

                    {/*<li className='side-link'>
                        <CustomDropdown title={'User Support'}>
                            <ul>
                                 <li>
                                    <NavLink to={'/'}>All Activity</NavLink>
                                </li>
                            </ul>
                        </CustomDropdown>
                    </li>*/}
                    {/*<li className="side-link">
                        <NavLink to={"/satistics"}>Statistics</NavLink>
                    </li>*/}
                    {/*<li className="side-link">
                        <NavLink to={"/pl-account"}>PL Account</NavLink>
                    </li>*/}
                    <li className="side-link">
                        <NavLink to={"/sub_admin/profile"}>Profile</NavLink>
                    </li>
                    <li className="side-link">
                        <NavLink onClick={handleLogout} to='/login'>Logout</NavLink>
                    </li>
                </ul>
            </div>
        </aside>
    </>
}

export default SubAdminSidebar
