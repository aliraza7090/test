import _ from "lodash";
import {useState} from "react"
import {toast} from "react-toastify";
import {useQuery} from "react-query";
import {useDispatch} from "react-redux";
import {Container} from 'react-bootstrap'

import {apis} from "services";
import {Order, Loader, BotModal} from "components"
import {logout} from "redux/slices/user.slice";

function UserStatistics() {
    const dispatch = useDispatch();

    const [tab, setTab] = useState('open');
    const [bot, setBot] = useState({id: null, exchange: '', user_id: null});
    const [modalStatus, setModalStatus] = useState(false);

    const {data, isFetching, refetch: refetchOrders, isLoading} = useQuery([tab], apis.userOrdersBot, {
        onError: ({message, response: {status}}) => {
            toast.error(message)
            if (status === 401) {
                dispatch(logout())
            }

        },
        onSuccess: ({status, data : message}) => {
            // console.log({status, data});
            toast.success(message);
        }
    });

    const loading = isLoading || isFetching;
    // Destructuring
    const orders = _.get(data, 'data', []);

    const toggleBotModal = (params) => {
        if(tab === 'close') return;
        if(params) setBot(params);
        setModalStatus(prevState => !prevState)
    };
    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <Container fluid>
                    <div className="profit-loss-tab mb-5">
                        <ul className="justify-content-start">
                            <li>
                                <a href={'#'} className={tab === "open" ? "active" : ""}
                                   onClick={() => setTab('open')}>Open Orders</a>
                            </li>
                            <li>
                                <a href={'#'} className={tab === "close" ? "active" : ""}
                                   onClick={() => setTab('close')}>Close Orders</a>
                            </li>
                        </ul>
                    </div>
                    <div className='my-2 px-2'> <h4> Total {tab} orders:  ({orders.length}) </h4></div>
                    {
                        loading
                            ? <Loader variant={'light'}/>
                            : orders.length > 0
                                ? orders.map((order, index) => <Order key={index} no={index+1} {...order} stopBot={toggleBotModal} tab={tab}/>)
                                :
                                <div className='d-flex justify-content-center align-items-center' style={{height: '50vh'}}>
                                    <h4>no {tab} orders found</h4>

                                </div>
                    }
                    {/*<Questions type={tab}/>*/}
                </Container>
                <div className="mt-5">
                </div>
            </div>
            <BotModal show={modalStatus} handleClose={toggleBotModal} bot={bot}  refetchOrders={refetchOrders}/>
        </div>
    </>
}

export default UserStatistics
