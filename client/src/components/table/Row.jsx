export default function Row( { expanded, handleExpand, data = {}, colSpan = 10 } ) {
    const { name, usdt, eth, btc } = data || {};
    return (
        <tr onClick = { handleExpand } role = 'button' className = { '' }>
          <td colSpan = { colSpan }>
              <div className = 'td-bg bothside-radius'>
                  <div style = { { display :'flex', justifyContent :'space-evenly' } }>
                <div className = 'item'>
                    { expanded ? '▼' : '➤' }
                </div>
                <div className = 'item'>
                    <p>User: </p>
                    <p>{ name }</p>
                </div>
                  <div className = 'item'>
                      <p>USDT: </p>
                      <p>{ usdt }</p>
                  </div>
                  <div className = 'item'>
                      <p>ETH: </p>
                      <p>{ eth }</p>
                  </div>
                  <div className = 'item'>
                      <p>BTC: </p>
                      <p>{ btc }</p>
                  </div>
              </div>
              </div>
          </td>
        </tr>
    )
}
