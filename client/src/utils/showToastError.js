import {toast} from "react-toastify";

const showToastError = (response) => {
    if ('message' in response && typeof response.message === 'string')
        return toast.error(response?.message)
    else if (response.isAxiosError) {
        const data = response.response.data;
        if ('err' in data) {
            toast.error(data?.err?.msg)
        } else if (typeof data === 'string') {
            toast.error(data)
        } else if (typeof data.message === 'string')
            toast.error(data.message)
        else
            toast.error('Something went wrong')
    } else {
        toast.error('Something went wrong')
    }
};

export default showToastError;