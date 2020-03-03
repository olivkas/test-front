import React, { memo } from 'react';
import './AppHeader.css';

export const AppHeader = memo(({
  openModal,
  openSelectDateList,
  isMonth,
  isWeek,
  isDay,
  currentDate,
  onclickNext,
  onclickPrev,
  addActiveClass,
  active
}) => (
  <div className="primaryHeader">
    <div className="header_wrapper">
      <nav className="menu">
        <ul className="menuForm">
          <li
            className={`form${active === 'isMonth' ? 'Active' : ''}`}
            id="isMonth"
            onClick={e => {
              isMonth();
              addActiveClass(e);
            }}
          >
            Month
          </li>
          <li
            className={`form${active === 'isWeek' ? 'Active' : ''}`}
            id="isWeek"
            onClick={e => {
              isWeek();
              addActiveClass(e);
            }}
          >
            Week
          </li>
          <li
            className={`form${active === 'isDay' ? 'Active' : ''}`}
            id="isDay"
            onClick={e => {
              isDay();
              addActiveClass(e);
            }}
          >
            Day
          </li>
        </ul>
      </nav>
      <div className="currentDate">
        <i
          className="fa fa-caret-left curPrev"
          aria-hidden="true"
          onClick={onclickPrev}
        ></i>
        <div className="curDate-data" onClick={openSelectDateList}>
          {currentDate}
        </div>
        <i
          className="fa fa-caret-right curNext"
          aria-hidden="true"
          onClick={onclickNext}
        ></i>
      </div>
      <div className="newEvent" onClick={openModal}>
        <i className={`fa fa-plus addBtn`} aria-hidden="true" />
        Add new
      </div>
    </div>
  </div>
));
