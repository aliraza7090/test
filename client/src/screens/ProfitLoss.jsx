import {PieChart, PortfolioTab} from "../components"
import {Q_LIST} from "../constants";
import _ from "lodash";
import {useState} from "react";
import {useSelector} from "react-redux";
import {useQuery} from "react-query";
import {apis} from "../services";
import {showToastError} from "../utils";

function ProfitLoss() {
  const {isLoading, data} = useQuery("profit/loss", apis.getProfitLoss, {
    onError: error => showToastError(error)
  });

  const result = _.get(data, 'data', {})

  const [chartDate, setChartDate] = useState("7");

  return <>
    <div className="dashboard-main custom-scroll">
      <div className="section">
        <PortfolioTab/>
        <div className="mt-5">

          <div>
            <div className="chart-filter">
              <ul className="ul custom-scroll">
                {Object.entries(Q_LIST).map(([key, value], index) => {
                  return (
                    <li key={index} className="mt-5">
                      <a href={'#!'}
                         className={key === chartDate ? 'active' : ''}
                         style={{fontSize: '1.5em'}}
                         onClick={() => setChartDate(key)}
                      >{value}</a>
                    </li>
                  )
                })}
              </ul>
            </div>
            <PieChart data={result?.[chartDate]}/>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default ProfitLoss
