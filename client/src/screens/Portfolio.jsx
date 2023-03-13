import PortfolioTableRow from 'components/table/PortfolioTableRow';
import TableRow from 'components/table/TableRow';
import { useState } from "react"
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { BotModal } from "components";
import { apis } from "services";
import { imageURL, useDeleteBot, useExportData, useFetchUserOrders } from "hooks"
import { PortfolioDetails } from "components/admin";
import { AddUser, Loader, PortfolioTab } from "components"
import { showToastError } from 'utils';


function Portfolio() {
    const navigate = useNavigate();
    const [ users, setUsers ] = useState( [] );
    const { isLoading, refetch :refetchOrders } = useQuery( 'activity', apis.activityRecords, {
        onError :( error ) => showToastError( error ),
        onSuccess :( { data } ) => setUsers( data )
    } );
    const [ bot, setBot ] = useState( { id :null, exchange :'', user_id :null } );
    const [ modalStatus, setModalStatus ] = useState( false );
    const [ tab, setTab ] = useState( 'open' );
    
    // const {userOrders: bots, isFetchingBots, refetchOrders} = useFetchUserOrders('allBots');
    const { deleteBot } = useDeleteBot( refetchOrders )
    const { isExporting, exportData } = useExportData();
    const { mutateAsync } = useMutation( [ 'updateBotStatus' ], apis.updateBot, {
        onSuccess :async () => {
            await refetchOrders();
            toast.info( 'Bot Status Changed' )
        }
    } );
    const toggleBotModal = ( params ) => {
        if ( params ) {
            setBot( params );
        }
        
        setModalStatus( prevState => !prevState )
    };
    const [ show, setShow ] = useState( false );
    
    const handleClose = () => setShow( false );
    const handleShow = () => setShow( true );
    
    const handleAPIConfiguration = ( id ) => navigate( '/api-configuration', { state :{ userId :id } } )
    const updateBotStatus = async ( { isActive, _id } ) => await mutateAsync( { _id, body :{ isActive : !isActive } } )
    
    return <>
        <div className = 'dashboard-main custom-scroll'>
            <div className = 'section'>
                <PortfolioTab />
                <div className = 'head-main'>
                    <div className = 'head-section'>
                        <div className = 'w-100 text-end'>
                            <button
                                className = 'custom-btn secondary-btn' onClick = { exportData }
                                disabled = { isExporting }>
                                { isExporting ? 'Exporting' : 'Export' }
                            </button>
                        </div>
                        {/*<div className="balance-section">
                         <span>Total Balance</span>
                         <div className="coin-detail">
                         <img src={imageURL('binance.png')} alt="Binance"/>
                         <h3>{balance}</h3>
                         </div>
                         </div>*/ }
                    </div>
                </div>
                <div className = 'table-responsive custom-scroll mt-5 min-vh-50'>
                    {
                        isLoading
                            ? <Loader variant = 'light' style = { { minHeight :'50vh' } } />
                            : <table className = 'table custom-table'>
                                <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>User Name</th>
                                    <th>Bot Status</th>
                                    <th>Exchange</th>
                                    <th>Symbol</th>
                                    <th>Total Investment</th>
                                    <th>Available Balance</th>
                                    <th>RSI</th>
                                    <th>Trailing</th>
                                    <th>In Bucket</th>
                                    <th>Stage Selected</th>
                                    <th>No. of Days</th>
                                    <th>Stop Loser</th>
                                    <th>User Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                               { users.map( ( user, index ) =>
                                   <PortfolioTableRow
                                       counter = { index + 1 }
                                       key = { index } tab = { tab } deleteBot = { deleteBot }
                                       handleAPIConfiguration = { handleAPIConfiguration }
                                       updateBotStatus = { updateBotStatus }
                                       toggleBotModal = { toggleBotModal }
                                       { ...user }
                                   /> ) }
                               `{/*{
                                bots.map((user, index) =>
                                <PortfolioDetails key={index} {...user} id={index + 1}
                                stopBot={toggleBotModal} tab={tab}
                                inputAPIHandler={handleAPIConfiguration}
                                updateBotStatus={updateBotStatus}
                                deleteBot={deleteBot}
                                />)
                                }*/ }`
                                </tbody>
                            </table>
                    }
                </div>
            </div>

            <AddUser show = { show } handleClose = { handleClose } />
            <BotModal
                show = { modalStatus } handleClose = { toggleBotModal } bot = { bot }
                refetchOrders = { refetchOrders } />
  
        </div>
    </>
}

export default Portfolio
