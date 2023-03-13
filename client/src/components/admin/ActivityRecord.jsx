import _ from 'lodash'
import {useMemo} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {Form} from "react-bootstrap";

import {arrangeSettingsArray} from "utils";

const ActivityRecord = (props) => {
    const {
        coin,
        id,
        handleSetupBot,
        updateStatusHandler,
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
        tab, deleteBot
    } = props;
    const {name = '', _id: user_id} = user || {};
    const navigate = useNavigate();

    const balances = useMemo(() => arrangeSettingsArray(setting), [setting]);

    const handleDelete = (id) => {
        if (window.confirm('are you sure?'))
            deleteBot(id);
    }

    // const botStatusHandler = () => updateStatusHandler({_id, isActive});

    const setupBotHandler = () => handleSetupBot({
        _id, setting: balances, user, isActive, coin, availableBalance, investment, exchange, risk
    });

    return (
        <tr className={configured_by === 'not configured' ? 'active-row' : 'active-border'}>
            <div className="td-bg"> {' '} </div>
            <td>
                <div className="td-bg">
                    {id}
                </div>
            </td>
            {/*<td>
                <div className="td-bg">{user?.name}</div>
            </td>*/}
            <td>
                <div className="td-bg">{investment}</div>
            </td>
            <td>
                <div className="td-bg">{coin}</div>
            </td>
            <td>
                <div className="td-bg">{_.capitalize(exchange)}</div>
            </td>
            <td>
                <div className="td-bg"><span className="text-green">{profit > 0 ? profit : 0}</span></div>
            </td>
            <td>
                <div className="td-bg"><span className="text-red">{profit < 0 ? Math.abs(profit) : 0}</span></div>
            </td>
            <td>
                <div className="td-bg">
                    {tab === 'open' && <div>
                        <Form.Check
                            className="custom-switch"
                            type="switch"
                            id="custom-switch"
                            label=""
                            checked={isActive}
                            onChange={() => {
                                if (isActive) stopBot({id: _id, exchange: exchange, user_id})
                                else toast.warn('Bot can be only active from configuration')
                            }}
                        />
                    </div>}
                </div>

            </td>
            <td>
                <div className="td-bg">
                    {configured_by}
                </div>
            </td>
            <td>
                <div className="td-bg d-flex justify-content-center align-items-center">
                    <button className="primary-btn" onClick={setupBotHandler}
                            style={{borderRadius: '50px', boxShadow: "none"}}>
                        Setup Bot
                    </button>
                </div>
                {/*<div className="td-bg right-radius">
                    <Dropdown className="boot-custom-dropdown">
                        <Dropdown.Toggle id="dropdown-basic">
                            <i className="fa-solid fa-ellipsis"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={setupBotHandler}>Setup Bot</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(_id)}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>*/}
            </td>
        </tr>
    )
};

export default ActivityRecord
