import {ToastContainer, Toast as CustomToast} from "react-bootstrap";
import {useState, forwardRef} from "react";

const Toast = ({show, animation, onClose, variant='Danger'}) => {
    const [toast, setToast] = useState(false);
    const [title, setTitle] = useState('');

    const closeToast = () => setToast(prevState => !prevState);
    const showToast = (title) => {
        setTitle(title);
        setToast(true);
    } ;


    return(
        <ToastContainer position={'top-center'}>
            <CustomToast onClose={onClose} show={show} animation={animation} autohide delay={3000} bg={variant.toLowerCase()}>
                <CustomToast.Header>
                    <h6 className='me-auto'>{title}</h6>
                </CustomToast.Header>
            </CustomToast>
        </ToastContainer>
    )
};

export default Toast;
