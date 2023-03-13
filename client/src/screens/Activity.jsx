import { BotModal, Loader } from "components";
import { ActivityRecord } from "components/admin";
import TableRow from 'components/table/TableRow';
import { useDeleteBot, useExportData, useFetchUserOrders } from "hooks";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { apis } from "services"
import { showToastError } from 'utils';
import { isAdmin } from "../utils/user";


function Activity() {
    
    const [ tab, setTab ] = useState( 'open' );
    const [ bot, setBot ] = useState( { id :null, exchange :'', user_id :null } );
    const [ modalStatus, setModalStatus ] = useState( false );
    
    
    const navigate = useNavigate();
    const [ users, setUsers ] = useState( [] );
    const { isLoading, refetch } = useQuery( 'activity', apis.activityRecords, {
        onError :( error ) => showToastError( error ),
        onSuccess :( { data } ) => setUsers( data )
    } );
    // const { userOrders :bots, refetchOrders, isFetchingBots } = useFetchUserOrders( 'allBots' );
    const { isExporting, exportData } = useExportData();
    const { mutateAsync } = useMutation( [ 'updateBotStatus' ], apis.updateBot, {
        onSuccess :async () => {
            setModalStatus( true )
            await refetch();
            toast.info( 'Bot Status Changed' )
        }
    } );
    
    const { deleteBot } = useDeleteBot( refetch );
    
    
    const toggleBotModal = ( params ) => {
        if ( params ) {
            setBot( params );
        }
        
        setModalStatus( prevState => !prevState )
    };
    
    const handleSetupBot = ( data ) => {
        isAdmin() ? navigate( '/auto-rsi', { state :data } ) : navigate( '/sub_admin/auto-rsi', { state :data } )
        
    }
    const updateBotStatus = async ( { isActive, _id } ) => await mutateAsync( { _id, body :{ isActive : !isActive } } )
    return <>

        <div className = 'dashboard-main custom-scroll'>
            <div className = 'section text-end'>
                <button className = 'custom-btn secondary-btn' onClick = { exportData } disabled = { isExporting }>
                    { isExporting ? 'Exporting' : 'Export' }
                </button>
            </div>
            { isLoading ? <Loader variant = 'light' style = { { minHeight :'100vh' } } /> : users?.length > 0 ? <div
                className = 'section'>
                            <table className = 'table table1'>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>Bot ID</th>
                                    {/*<th>User Name</th>*/ }
                                    <th>Investment</th>
                                    <th>Symbol</th>
                                    <th>Exchange</th>
                                    <th>Profit</th>
                                    <th>Loss</th>
                                    <th>Bot Status</th>
                                    <th>Configuration</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    users.map( ( user, index ) =>
                                        <TableRow
                                            counter = { index + 1 }
                                            key = { index }
                                            handleSetupBot = { handleSetupBot }
                                            updateStatusHandler = { updateBotStatus }
                                            stopBot = { toggleBotModal }
                                            tab = { tab }
                                            deleteBot = { deleteBot }
                                            { ...user }
                                        /> )
                                }
                                {/*{
                                 bots.map( ( bot, i ) =>
                                 <ActivityRecord
                                 key = { i } id = { i + 1 } handleSetupBot = { handleSetupBot }
                                 updateStatusHandler = { updateBotStatus } { ...bot }
                                 stopBot = { toggleBotModal } tab = { tab }
                                 deleteBot = { deleteBot }
                                 /> )
                                 }*/ }
                                </tbody>
                            </table>
                        </div> : <div className = 'custom-user'><p> No User Bot Activity found.</p></div> }
        </div>

        <BotModal
            show = { modalStatus } handleClose = { toggleBotModal } bot = { bot } refetchOrders = { refetch } />
    </>
}

export default Activity
