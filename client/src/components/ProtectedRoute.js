import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ADMIN_ROUTES, SUB_ADMIN_ROUTES, USER_ROUTES } from "../constants";


const ProtectedRoute = () => {
    const location = useLocation()
    const { user } = useSelector( ( store ) => store.user );

    if ( user?.role === 'ADMIN' && ADMIN_ROUTES.includes( location.pathname ) )
        return <Outlet />
    else if ( user?.role === 'USER' && USER_ROUTES.includes( location.pathname ) )
        return <Outlet />
    else if ( user?.role === 'SUB_ADMIN' && SUB_ADMIN_ROUTES.includes( location.pathname ) )
        return <Outlet />
    else
        return <Navigate to = { '/login' } state = { { from :location.pathname } } />
}

export default ProtectedRoute
