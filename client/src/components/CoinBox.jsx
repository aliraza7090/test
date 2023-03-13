import {imageURL} from "../hooks";
import {Col} from "react-bootstrap";

const CoinBox = ({
                     id,
                     price,
                     change,
                     onChange,
                     active_class,
                     change_class,
                     symbol = 'eth',
                 }) => {
    return (
        <Col lg={6} md={6}>
            <div className="box-main">
                <img src={imageURL(`${id}.png`)} alt={id} className="img"/>
                <div className={`custom-box pointer ${active_class}`}
                     onClick={() => onChange(symbol.toUpperCase())}>
                    <div className="flex-center">
                        <img src={imageURL(`${symbol.toLowerCase()}.png`)} alt={id}/>
                        <h6>{symbol}</h6>
                        <h3>{price}</h3>
                        <div className="updown">
                            <i className={`fa-solid ${change_class}`}></i>
                            <h5>{change}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
    )
};


export default CoinBox
