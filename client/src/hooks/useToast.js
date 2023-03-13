import {useContext} from "react";
import {ToastContext} from "../contexts/Toast";


const useToast = () => {
    const toast =  useContext(ToastContext);

    return toast;
};

export default useToast
