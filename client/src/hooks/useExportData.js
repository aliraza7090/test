import {useQuery} from "react-query";
import {toast} from "react-toastify";

import {apis} from "services";
import {showToastError} from "utils";

const useExportData = () => {
    const {isLoading: isExporting, refetch: exportData} = useQuery(['export_data'], apis.exportData, {
        enabled: false,
        onError: error => showToastError(error),
        onSuccess: ({data}) => {
            window.open(data)
            toast.success('Data Exported');
        }
    });

    return {exportData, isExporting}
};

export default useExportData