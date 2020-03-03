import React, { memo } from 'react';
import './DayForm.css';

export const DayForm = memo(({ drawOneDay }) => (
    <div className='day-wrapper'>
       {drawOneDay}
    </div>
));
