import {createContext, useContext, useRef, useState} from 'react'
import Toast from "../components/Toast";

export const ToastContext = createContext('test');

const ToastProvider = ({children}) => {

    const [count, setCount] = useState(0);

    const ref = useRef(null)

    const showToast = () => {
        console.log(ref);
    }



    return <>
        <ToastContext.Provider value={showToast}>
        <Toast ref={ref}/>
            {children}
        </ToastContext.Provider>
    </>
}
export {ToastProvider}
