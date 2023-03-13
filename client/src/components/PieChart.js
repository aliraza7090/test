import _ from "lodash"
import ApexCharts from 'apexcharts'
import {memo, useEffect} from 'react';

function PieChart({data = {profit: 0, loss: 0}}) {
    const labels = ['Profit', 'Loss'];
    const options = {
        series: [_.round(data.profit, 3), _.round(data.loss, 3)],
        chart: {
            width: 380,
            type: 'pie',
        },
        fillColor: '#FEB019',
        labels: labels,
        colors: ['#2AB48F', '#E06161'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    useEffect(() => {
        const chart = new ApexCharts(document.querySelector("#pie_chart"), options);
        chart.render();
        return () => chart.destroy();
    }, [data])
    return <div className='pie-chart-main'>
        <div className='chart-flex'>
            <div id="pie_chart" className='main-pie-chart'>

            </div>
            <div className='pie-labels'>
                <div>
                    <span>Profit</span>
                    <h3>{_.round(data.profit, 3)}</h3>
                    <i className="fa-solid fa-caret-up text-green"></i>
                </div>
                <div>
                    <span>Loss</span>
                    <h3>{_.round(data.loss, 3)}</h3>
                    <i className="fa-solid fa-caret-down text-red"></i>
                </div>
            </div>
        </div>
    </div>
}

export default memo(PieChart)
