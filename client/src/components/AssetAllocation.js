import ApexCharts from 'apexcharts'
import {memo, useEffect} from 'react';

const AssetAllocation = ({data = {series: [], eth: 0, btc: 0}}) => {
    const labels = ['ETH', 'BTC'];
    const options = {
        series: data?.series,
        chart: {
            type: 'donut',
        },
        labels: labels,
        colors: ['#5688ed', '#2AB48F'],
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
        const chart = new ApexCharts(document.querySelector("#asset_chart"), options);
        chart.render();

        return () => {
            chart.destroy()
        }
    }, [data])
    return <div className='pie-chart-main'>

        <div className='chart-flex flex-between-chart'>
            <div id="asset_chart" className='main-pie-chart'>

            </div>
            <div className='paid-labels mobile-none'>
                <div className='inner'>
                    <i className="fa-solid fa-circle blue"></i>
                    <span>{labels[0]}</span>
                </div>
                <div className='inner'>
                    <i className="fa-solid fa-circle green"></i>
                    <span>{labels[1]}</span>
                </div>

            </div>
            <div className='paid-percent mobile-none'>
                <div className='inner'>
                    <span>{data?.eth}%</span>
                </div>
                <div className='inner'>
                    <span>{data?.btc}%</span>
                </div>

            </div>
        </div>
    </div>
}

export default memo(AssetAllocation)