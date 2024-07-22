import React from "react";

function GamePart({ val, name, cost, onclick }){
    return (
      <tr>
        <td>
          <button onClick={onclick} className='left'>
              Buy {name}
          </button>
        </td>
        <td className='right'>
          <p>Amount: {val.toLocaleString()}<br /> Cost: {cost.toLocaleString()}</p>
        </td>
      </tr>
    )
}

export default GamePart;