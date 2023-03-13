import _ from 'lodash';
import { useMemo } from "react";
import { toast } from "react-toastify";
import { Dropdown, Form } from "react-bootstrap";

import { STAGES } from "../../constants";
import { arrangeSettingsArray } from "utils";


const PortfolioDetails = ( props ) => {
    const {
        coin,
        id,
        updateBotStatus,
        inputAPIHandler,
        stop_at = 0,
        configured_by = '',
        createdAt,
        availableBalance = 0,
        user,
        day,
        profit,
        loss,
        risk,
        exchange,
        isActive,
        investment,
        setting,
        _id,
        stopBot,
        tab,
        deleteBot
    } = props;
    const { name = '', _id :user_id } = user || {};
    
    const botStatusHandler = () => updateBotStatus( { _id, isActive } )
    
    const balances = useMemo( () => arrangeSettingsArray( setting ), [ setting ] );
    
    const handleDelete = ( id ) => {
        if ( window.confirm( 'are you sure?' ) )
            deleteBot( id );
    }
    const handleRestrict = () => { /*alert('Restrict Option Triggered') */
    }
    
    return (
        <tr>
            <td>
                {/*<div className = 'td-bg'>*/ }
                { id }
                {/*</div>*/ }
                </td>
            <td>
                {/*<div className = 'td-bg'>*/ }
                { user?.name }
                {/*</div>*/ }
            </td>
            <td>
                { tab === 'open' && <div>
                    <Form.Check
                        className = 'custom-switch'
                        type = 'switch'
                        id = 'custom-switch'
                        label = ''
                        checked = { isActive }
                        onChange = { () => {
                            if ( isActive ) stopBot( { id :_id, exchange :exchange, user_id } )
                            else toast.warn( 'Bot can be only active from configuration' )
                        } }
                    />
                </div> }
            </td>
            <td>{ _.capitalize( exchange ) }</td>
            <td>{ coin }</td>
            <td>${ investment }</td>
            <td>${ _.round( availableBalance, 3 ) }</td>
            <td>${ balances?.rsi?.investment }</td>
            <td>${ balances?.trailing?.investment }</td>
            <td>${ balances?.manual?.investment }</td>
            <td>{ STAGES[ risk ] }</td>
            <td>{ day }</td>
            <td>{ stop_at }</td>
            <td>
                <Dropdown className = 'boot-custom-dropdown'>
                    <Dropdown.Toggle id = 'dropdown-basic'>
                        <i className = 'fa-solid fa-ellipsis'></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {/*<Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>*/ }
                        <Dropdown.Item onClick = { botStatusHandler }>Restrict</Dropdown.Item>
                        <Dropdown.Item onClick = { () => inputAPIHandler( _id ) }>Input API Credentials</Dropdown.Item>
                        <Dropdown.Item onClick = { () => handleDelete( _id ) }>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </td>
        </tr>
    )
};

export default PortfolioDetails;
