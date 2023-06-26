import React from 'react';
import { LineWave } from  'react-loader-spinner'

export default function Loader() {
  return (
    <>
        <div className='popup'>
          <div className="popup-inner">
            <div className="popup-bg">
            </div>
            <div className="loader">
              <LineWave
                  height="100"
                  width="100"
                  color="#000000"
                  wrapperStyle={{ position: "relative", top: "50%", left: "50%", transform: "translate(-32%, -10%)"}}
                />
            </div>
          </div>
        </div>
    </>
  )
}