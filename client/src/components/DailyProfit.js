import ApexCharts from 'apexcharts'
import _ from "lodash"
import { memo, useEffect, useMemo } from 'react';


const DailyProfit = ( { data = [], total } ) => {

    const max = useMemo( () => {
        const maxArr = _.maxBy( data, ( item ) => item[ 1 ] )
        return ( maxArr?.[ 1 ] ) || 0
    }, [ data ] );

    const options = {
        series :[ { name :'Profit', data :data } ],
        chart :{
            id :'area-datetime',
            type :'bar',
            height :350
        },
        annotations :{
            yaxis :[ {
                y :30
                // borderColor: '#999',
                /*label: {
                 show: true,
                 text: 'Support',
                 style: {
                 color: "#fff",
                 background: '#00E396'
                 }
                 }*/
            } ],
            xaxis :[ {
                // x: new Date('14 Nov 2012').getTime(),
                // borderColor: '#999',
                yAxisIndex :0
                /*label: {
                 show: true,
                 text: 'Rally',
                 style: {
                 color: "#fff",
                 background: '#775DD0'
                 }
                 }*/
            } ]
        },
        markers :{
            size :0,
            style :'hollow'
        },
        xaxis :{
            type :'datetime',
            // min: minDate,
            tickAmount :6,
            labels :{
                style :{
                    colors :'#FFF'
                }
            }
        },
        yaxis :{
            max :max * 2 || undefined,
            labels :{
                style :{
                    colors :'#FFF'
                }
            }
        },
        tooltip :{
            theme :'dark',
            x :{
                format :'dd MMM yyyy'
            }
        }

    };

    useEffect( () => {
        const chart = new ApexCharts( document.querySelector( "#daily_profit" ), options );
        chart.render().then()
        return () => chart.destroy();
    }, [ data ] );
    return <div className = 'pie-chart-main'>

    <div className = 'chart-flex'>
      <div id = 'daily_profit' style = { { width :'100%' } } className = 'main-pie-chart'>
      </div>
    </div>
  </div>
}

export default memo( DailyProfit )
