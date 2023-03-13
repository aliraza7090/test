import { ActivityRecord } from 'components/admin';
import Row from 'components/table/Row';
import { useState } from 'react';


export default function TableRow( {
    name,
    eth,
    usdt,
    btc,
    bots,
    deleteBot,
    tab,
    toggleBotModal,
    updateBotStatus,
    handleSetupBot,
    counter,
    ...props
} ) {
    console.log( { props } );
    const [ expanded, setExpanded ] = useState( false );
    
    const handleExpand = () => {
        setExpanded( !expanded );
    }
    
    return (
        <>
        <Row expanded = { expanded } handleExpand = { handleExpand } data = { { eth, usdt, btc, name } } />
            { expanded && bots.map( ( bot, i ) =>
                <ActivityRecord
                    key = { i }
                    id = { i + 1 }
                    handleSetupBot = { handleSetupBot }
                    updateStatusHandler = { updateBotStatus } { ...bot }
                    stopBot = { toggleBotModal }
                    tab = { tab }
                    deleteBot = { deleteBot }
                /> ) }
        </>
    )
}
