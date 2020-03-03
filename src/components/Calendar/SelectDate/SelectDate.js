import React, { memo } from 'react';
import './SelectDate.css';

export const SelectDate = memo(({isOpenDateList, onclickToday, getListDateComponent}) => (
    isOpenDateList &&(
            <div className="dateListOverlay">
                <div className="dateWindow">
                    <div className="bthToday" onClick={onclickToday}>Today</div>  
                        {getListDateComponent}
                </div>
            </div>
        )
));