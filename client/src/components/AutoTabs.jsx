import {INDICATORS, OPERATIONS} from "../constants";
import {Link} from "react-router-dom";

export default function AutoTabs({indicator, operation, setData}) {

    const handleOperation = (operation) => setData(prevState => ({...prevState, ['operation']: operation}))
    const handleIndicator = (indicator) => setData(prevState => ({...prevState, ['indicator']: indicator}))
    return <>
        <div className="bot-tabs mt-4">
            <ul>
                {Object.values(OPERATIONS).map((_operation, index) => {
                    const activeClass = _operation === operation ? 'active' : '';
                    return <li key={index}>
                        <Link to={''} onClick={() => handleOperation(_operation)}
                           className={activeClass}> {_operation} </Link>
                    </li>
                })}
            </ul>
        </div>
        {
            operation === OPERATIONS.auto &&
            <div className="mt-5">
                <div className="profit-loss-tab">
                    <ul>
                        {Object.values(INDICATORS).map((_indicator, index) => {
                                const activeClass = _indicator === indicator ? 'active' : ''
                                return <li key={index}>
                                    <a className={activeClass} href='#'
                                       onClick={() => handleIndicator(_indicator)}>
                                        {_indicator}
                                    </a>
                                </li>
                            }
                        )}
                    </ul>
                </div>
            </div>
        }

    </>
}
