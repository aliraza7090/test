import ApexCharts from 'apexcharts'
import {useEffect} from 'react';

const ProfitDistribution = ({data = []}) => {
    const labels = ['Profit', 'Loss'];
    const options = {
        series: [{data}],
        colors: ['#E06161'],
        fillColor: '#FEB019',
        chart: {
            height: 200,
            type: 'rangeBar'
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        dataLabels: {
            enabled: true
          },
    };

    useEffect(() => {

        const chart = new ApexCharts(document.querySelector("#profit_distribution"), options);
        chart.render().then();

        return () => {
            chart.destroy()
        }
    }, [data])
    return <div className='pie-chart-main'>

        <div className='chart-flex'>
            <div id="profit_distribution" style={{width: '100%'}} className='main-pie-chart'>
            </div>
        </div>
    </div>
}

export default ProfitDistribution