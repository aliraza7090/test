import {useState} from "react"
import _ from "lodash";
import {apis} from "services";
import {useQuery} from "react-query";
import {Col, Container, Row} from 'react-bootstrap'
import {PaidHistoryPieChart, PaidHistoryTabs} from "components";
import {COINS} from "../../constants";
import UserBills from "components/UserBills";

function PaidHistory({isAdmin}) {
    const [tab, setTab] = useState(COINS.eth);
    const {data: response} = useQuery(['paid_history'], apis.paidHistory, {
        onError: error => console.log(error),
        /*onSuccess: ({data,status}) => {
            console.log({status,data})
        }*/
    })

    const data = _.get(response, 'data', []);

    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <Container fluid>
                    <PaidHistoryTabs tab={tab} setTab={setTab} isPageHistoryPage/>
                    <Row className="gy-3">
                        <Col lg={12}>
                            <div className="normal-box">
                                <PaidHistoryPieChart data={data?.chart} closeOrders={data?.closeOrders}/>
                            </div>
                            <div className="profit-lost-list">
                                <div className="inner">
                                    <h3>{_.round(data?.amountPaid, 2) || 0}</h3>
                                    <span>Amount Paid:</span>
                                </div>
                                <div className="inner">
                                    <h3>{_.round(data?.amountUnpaid, 2) || 0}</h3>
                                    <span>Amount Unpaid:</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {isAdmin && <UserBills/>}
                </Container>
            </div>
        </div>
    </>
}

export default PaidHistory
