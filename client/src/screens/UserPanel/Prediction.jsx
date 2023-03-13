import _ from "lodash";
import moment from "moment";
import {apis} from "services";
import {useState} from "react"
import {Loader} from "components";
import {useQuery} from "react-query";
import {toast} from "react-toastify";
import {COINS} from "../../constants";

function Prediction() {
    const [tab, setTab] = useState(COINS.btc);
    const {data, isLoading} = useQuery(['getPredictions', tab], apis.getPredictions, {
        onError: ({message}) => toast.error(message),
        onSuccess: (data) => {
            // console.log(data, '###############');
        }
    });

    //Destructuring
    const predictions = _.get(data, 'data', []);
    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <div className="bot-tabs ">
                    <ul className="justify-content-start">
                        {
                            Object.values(COINS).map((currency, index) =>
                                <li key={index}>
                                    <a className={`${tab === currency ? 'active' : ''}`}
                                       onClick={() => setTab(currency)}
                                       href="#">{currency}
                                    </a>
                                </li>)
                        }
                    </ul>
                </div>
                <div className="normal-text-main">
                    <p>
                        {tab} Price Forecast For Tomorrow and Next Week Based on The Last 30 Days

                    </p>
                </div>
                {
                    isLoading
                        ? <Loader variant='light'/>
                        : <table className="table table1">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Price</th>
                                <th>Change</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                predictions.length > 0 && predictions.map(({date, price, change}) => (
                                    <tr>
                                        <td>
                                            <div className="td-bg letf-radius">
                                                {moment(date).format('lll')}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="td-bg">{price}</div>
                                        </td>
                                        <td>
                                            <div className={`td-bg  text-${change > 0 ? 'green' : 'red'}`}>{change}%</div>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                }

                {(predictions.length === 0 && !isLoading && ( <div className="text-center mt-3">No Data found</div> ))}
                {predictions.length !== 0 && (<div className="text-center mt-3">
                    <button className="custom-btn primary-btn round-btn">Show More</button>
                </div>)}
            </div>
        </div>
    </>
}

export default Prediction