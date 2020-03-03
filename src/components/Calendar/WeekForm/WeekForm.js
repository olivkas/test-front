import React, { memo } from 'react';
import './WeekForm.css';

export const WeekForm = memo(({ weekdays, daysOfWeek } ) => (
  <div className='week-wrapper'>
    <div className='calendar-week-list'>
      <ul className='calendar-week'>
        {weekdays} 
      </ul>
    </div>
    <div className='calendar-days-list'>
      <ul className='calendar-days__week'>
       {daysOfWeek} 
      </ul>
    </div>
  </div>

));