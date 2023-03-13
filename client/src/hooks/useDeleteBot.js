import {toast} from "react-toastify";
import {useMutation} from "react-query";

import {apis} from "services";
import {showToastError} from "utils";

const useDeleteBot = (refetch) => {
    const {mutateAsync, isLoading} = useMutation(['delete_bots'], apis.deleteBot, {
        onError: (error) => showToastError(error),
        onSuccess: ({data}) => {
            refetch()
            toast.success(data)
        }
    });

    return {deleteBot: mutateAsync, isLoading}
};


export default useDeleteBot