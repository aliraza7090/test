import { NavLink } from "react-router-dom"

export default function PortfolioTab()
{
    return <>
        <div className="profit-loss-tab">
            <ul>
                <li>
                    <NavLink to={'/portfolio'}>Portfolio</NavLink>
                </li>
                <li>
                    <NavLink to={'/profit-loss'}>Profit/Loss</NavLink>
                </li>
            </ul>
        </div>
    </>
}