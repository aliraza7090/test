import ApexCharts from 'apexcharts'
import { memo , useEffect } from 'react';


const Winrate = ( { data = { loss : 0 , profit : 0 , breakEvent : 0 , series : [ 0 , 0 , 0 ] } } ) => {
    const labels = [ 'Profit' , 'Loss' , 'Break-Even' ];
    const options = {
        series : data.series ,
        chart : {
            type : 'donut'
        } ,
        labels : labels ,
        colors : [ '#2AB48F' , '#E06161' , '#838282' ] ,
        responsive : [ {
            breakpoint : 480 ,
            options : {
                chart : {
                    width : '100%'
                } ,
                legend : {
                    position : 'bottom'
                }
            }
        } ]
    };
    useEffect( () => {
        const chart = new ApexCharts( document.querySelector( "#winrate_chart" ) , options );
        chart.render();

        return () => chart.destroy();

    } , [ data ] )
    return <div className = 'pie-chart-main'>

<div className = 'chart-flex flex-between-chart'>
    <div id = 'winrate_chart' className = 'main-pie-chart'>

    </div>
    <div className = 'paid-labels mobile-none'>
        <div className = 'inner'>
            <i className = 'fa-solid fa-circle green'></i>
            <span>{ labels[ 0 ] }</span>
        </div>
        <div className = 'inner'>
            <i className = 'fa-solid fa-circle red'></i>
            <span>{ labels[ 1 ] }</span>
        </div>
        <div className = 'inner'>
            <i className = 'fa-solid fa-circle gray'></i>
            <span>{ labels[ 2 ] }</span>
        </div>
    </div>
    <div className = 'paid-percent mobile-none'>
        <div className = 'inner'>
            <span>
                { data.profit }%
            </span>
        </div>
        <div className = 'inner'>
            <span>{ data.loss }%</span>
        </div>
        <div className = 'inner'>
            <span>{ data.breakEvent }%</span>
        </div>
    </div>
</div>
</div>
}

export default memo( Winrate )
