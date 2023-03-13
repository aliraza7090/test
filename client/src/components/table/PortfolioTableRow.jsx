import { useState } from 'react';
import Row from 'components/table/Row';
import { ActivityRecord, PortfolioDetails } from 'components/admin';


export default function PortfolioTableRow( {
    name,
    eth,
    usdt,
    btc,
    bots,
    deleteBot,
    tab,
    toggleBotModal,
    updateBotStatus,
    handleAPIConfiguration,
    counter,
    ...props
} ) {
    const [ expanded, setExpanded ] = useState( false );
    
    const handleExpand = () => {
        setExpanded( !expanded );
    }
    
    return (
        <>
            <Row expanded = { expanded } handleExpand = { handleExpand } data = { { eth, usdt, btc, name } } colSpan={14} />
            { expanded && bots.map( ( bot, i ) =>
                <PortfolioDetails
                    key={i}
                    id={i + 1}
                    stopBot={toggleBotModal}
                    tab={tab}
                    inputAPIHandler={handleAPIConfiguration}
                    updateBotStatus={updateBotStatus}
                    deleteBot={deleteBot}
                    {...bot}
                /> ) }
        </>
    )
}
