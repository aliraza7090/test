import ApexCharts from 'apexcharts'
import { memo, useEffect } from 'react';


function TotalProfit( { data = [], total } ) {


    const series = [ { name :"Profit", data :data } ]

    const options = {
        series,
        chart :{
            id :'area-datetime',
            type :'area',
            height :350,
            zoom :{
                autoScaleYaxis: true
            },
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
        dataLabels :{
            enabled :false
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
            max :total * 2 || undefined,
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
        },
        fill :{
            type :'gradient',
            gradient :{
                // shadeIntensity: 1,
                opacityFrom :0.5,
                opacityTo :0.3
                // stops: [0, 100]
            }
        }
    }


    useEffect( () => {
        const chart = new ApexCharts( document.querySelector( "#total_profit" ), options );
        chart.render();
        return () => chart.destroy();
    }, [ data ] )
    return <div className = 'pie-chart-main'>

    <div className = 'chart-flex'>
      <div id = 'total_profit' style = { { width :'100%' } } className = 'main-pie-chart'>
      </div>

    </div>
  </div>
}

export default memo( TotalProfit )
