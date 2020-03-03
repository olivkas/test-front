import React, { memo } from 'react';
import './MonthForm.css';

export const MonthForm = memo(({ weekdays, days }) => (
  <div className="month-wrapper">
    <div className="calendar-week-list">
      <ul className="calendar-week">{weekdays}</ul>
    </div>
    <div className="calendar-days-list">
      <ul className="calendar-days">{days}</ul>
    </div>
  </div>
));
