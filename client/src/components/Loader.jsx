import {Spinner} from "react-bootstrap";

const Loader = ({variant = 'dark', style = {}}) => {
    return (
        <div className='d-flex justify-content-center align-items-center' style={style}>
            <Spinner animation="border" role="status" variant={variant}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}

export default Loader
