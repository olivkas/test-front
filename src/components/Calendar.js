import React, { PureComponent } from 'react';
import moment from 'moment';

import { AppHeader } from './Calendar/AppHeader';
import { SelectDate } from './Calendar/SelectDate';
import { EventForm } from './Calendar/EventForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MonthForm } from './Calendar/MonthForm';
import { WeekForm } from './Calendar/WeekForm/WeekForm';
import { DayForm } from './Calendar/DayForm';

const ROW_HEIGHT = 23;
const EVENT_MAX_WIDTH = 200;

export class Calendar extends PureComponent {
  currentDay = () => {
    return this.props.dateContext.format('D');
  };

  firstDayOfMonth = () => {
    const detaContext = this.props.selectedDay;
    let firstDay = moment(detaContext)
      .startOf('month')
      .format('d');
    return firstDay == 0 ? (firstDay = 6) : (firstDay = firstDay - 1);
  };

  firstDayofWeek = () => {
    moment.updateLocale('en', {
      week: {
        dow: 1
      }
    });
    return moment.weekdays(true);
  };

  getEventCurrentDay = (date, month, year) => {
    const currentDate = moment(this.props.dateContext.toDate()).set({
      y: year,
      M: month - 1,
      D: date
    });
    return this.props.events.filter(event =>
      event.eventDate.isSame(currentDate, 'day')
    );
  };

  daysInMonth = () => {
    return this.props.selectedDay.daysInMonth();
  };

  drawDays = () => {
    const { selectedDay, dateContext, onDayClick } = this.props;
    const blanks = [];

    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(
        <div key={i * 70}>
          <li data-day="" className="emptySlot">
            {''}
          </li>
        </div>
      );
    }

    const daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      const year = selectedDay.format('YYYY');
      const month = selectedDay.format('M');
      const day = selectedDay.format('D');
      const currentDate = moment(dateContext).set({
        y: year,
        M: month - 1,
        D: d
      });
      const className =
        d == this.currentDay() && dateContext.format('M') == month
          ? 'current-day'
          : '';
      const selectedClass = d == day ? ' selected-day ' : '';
      const events = this.getEventCurrentDay(d, month, year);
      const slicedEvents = events.slice(0, 2);

      daysInMonth.push(
        <div
          key={d}
          className="weeksday"
          onClick={e => {
            onDayClick(e, currentDate);
          }}
        >
          <li data-day={`${d}`} className={className + selectedClass}>
            {slicedEvents.map((day, i) => (
              <div className="day" key={i * 23}>
                {day.eventName}
              </div>
            ))}
            {events.length > 2 && <div>+{events.length - 2}</div>}
          </li>
        </div>
      );
    }

    const totalSlots = [...blanks, ...daysInMonth];
    const rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        let insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        const insertRow = cells.slice();
        rows.push(insertRow);
      }
    });

    return rows;
  };

  dayForHour = () => {
    const { events, selectedDay } = this.props;
    const hours = [];
    const todayEvents = events.filter(event =>
      event.eventDate.isSame(selectedDay, 'day')
    );

    for (let i = 0, j = 1; i <= 23, j <= 24; i++, j++) {
      const startTime = moment(selectedDay.toDate()).set({ h: i, m: 0, s: 0 });
      const endTime = moment(selectedDay.toDate()).set({ h: j, m: 0, s: 0 });
      const currentEvents = todayEvents.filter(
        event =>
          startTime.isSameOrBefore(event.eventTimeFrom) &&
          event.eventTimeFrom.isBefore(endTime)
      );

      hours.push(
        <>
          <div className="day-time">
            {startTime.format(`HH.mm`)}-{endTime.format('HH.mm')}
          </div>
          <div className="day-strEvent">
            {currentEvents.map(this.renderEvent)}
          </div>
        </>
      );
    }

    return hours;
  };

  drawWeek = () =>
    this.getDaysWeeks().map((d, i) => {
      const { dateContext, selectedDay, onDayClick } = this.props;
      const year = d.format('YYYY');
      const month = d.format('M');
      const day = d.format('D');
      const className =
        day == this.currentDay() &&
        dateContext.format('M') == selectedDay.format('M')
          ? 'current-day'
          : '';
      const selectedClass =
        day == selectedDay.format('D') && month == selectedDay.format('M')
          ? ' selected-day '
          : '';

      return (
        <div
          key={i * 50}
          onClick={e => {
            onDayClick(e, d);
          }}
        >
          <li data-day={day} className={className + selectedClass}>
            {this.getEventCurrentDay(day, month, year).map((day, i) => (
              <div className="event-week" key={i * 23}>{`${
                day.eventName
              }  ${day.eventTimeFrom.format('HH:mm')}-${day.eventTimeTo.format(
                'HH:mm'
              )}`}</div>
            ))}
          </li>
        </div>
      );
    });

  drawOneDay = () =>
    this.dayForHour().map((h, i) => {
      return <div className="day-hour" key={i*101}>{h}</div>;
    });

  getListWeeks = (firstDay, selected) => {
    let oneWeek = [];
    const week = [];
    let strWeek = '';
    const currentDay =
      moment(firstDay).format('d') == 0 ? 7 : moment(firstDay).format('d');
    for (let i = 1; i <= 7; i++) {
      oneWeek.push(
        moment(firstDay)
          .add(i - currentDay, 'days')
          .format('DD.MM.YYYY')
      );
      week.push(
        moment(firstDay)
          .add(i - currentDay, 'days')
          .format('YYYY-MM-DD')
      );
    }
    const isDay =
      selected.isSameOrAfter(moment(week[0]), 'day') &&
      selected.isSameOrBefore(moment(week[6]), 'day');

    oneWeek = oneWeek.filter((day, i) => {
      if (i == 0 || i == 6) return day[i];
    });

    strWeek = `${oneWeek[0]} - ${oneWeek[1]}`;

    return { strWeek, isDay };
  };

  getListMonth = () => {
    const months = moment.months();
    const renderMounts = [];
    for (let i = 0; i < months.length; i++) {
      renderMounts.push(
        <div
          className="month"
          onClick={e => {
            this.props.onClickMonthList(
              e,
              moment()
                .month(months[i])
                .format('M')
            );
          }}
        >
          {months[i]}
        </div>
      );
    }

    return <div className="dateContextMonths">{renderMounts}</div>;
  };

  getDaysWeeks = () => {
    const dayOfWeek = [];
    const currentDay =
      moment(this.props.selectedDay).format('d') == 0
        ? 7
        : moment(this.props.selectedDay).format('d');
    for (let i = 1; i <= 7; i++) {
      dayOfWeek.push(
        moment(this.props.selectedDay).add(i - currentDay, 'days')
      );
    }

    return dayOfWeek;
  };

  renderListWeeks = () => {
    const { selectedDay, onClickWeeksList } = this.props;
    const firstDayMonth = moment(selectedDay.toDate()).startOf('month');
    const rowLenght = this.drawDays().length;
    const listWeeks = Array.from({ length: rowLenght - 1 }).map((_value, i) =>
      this.getListWeeks(moment(firstDayMonth).add(i, 'w'), selectedDay)
    );
    const weekIndex = listWeeks.findIndex(week => week.isDay);

    return (
      <div className="dateContextWeeks">
        {listWeeks.map((week, i) => (
          <div
            className="week"
            onClick={e => {
              onClickWeeksList(e, moment(selectedDay).add(i - weekIndex, 'w'));
            }}
          >
            {week.strWeek}{' '}
          </div>
        ))}
      </div>
    );
  };

  renderCalendar = () => {
    const { selectedDay, onClickCalendarList } = this.props;
    return (
      <div className="dateContextCalendar">
        <DatePicker
          selected={selectedDay && selectedDay.toDate()}
          onChange={onClickCalendarList}
          inline
        />
      </div>
    );
  };

  renderEvent = (event, index) => {
    const minStart = event.eventTimeFrom.format('m');
    const k = minStart / 60;
    const during = moment.duration(
      moment(event.eventTimeTo).diff(moment(event.eventTimeFrom))
    );
    let eventHeight =
      ROW_HEIGHT * during.hours() + (ROW_HEIGHT * during.minutes()) / 60;

    if (eventHeight < 20) {
      eventHeight = 20;
    }
    return (
      <div
        style={{
          height: `${eventHeight}px`,
          top: `${ROW_HEIGHT * k}px`,
          left: EVENT_MAX_WIDTH * index + 6 * (index + 1)
        }}
        className="event"
      >
        {`${event.eventName}  ${event.eventTimeFrom.format(
          'HH:mm'
        )}-${event.eventTimeTo.format('HH:mm')}`}
      </div>
    );
  };

  getListDateComponent = mode => {
    switch (mode) {
      case 1:
        return this.getListMonth();
      case 2:
        return this.renderListWeeks();
      case 3:
        return this.renderCalendar();
    }
  };

  weekdays = this.firstDayofWeek().map(day => {
    return <li key={day}>{day}</li>;
  });

  days = () =>
    this.drawDays().map((d, i) => {
      return (
        <div className={`weeksday ${i}`} key={i * 100}>
          {d}
        </div>
      );
    });

  getComponent = mode => {
    switch (mode) {
      case 1:
        return <MonthForm weekdays={this.weekdays} days={this.days()} />;
      case 2:
        return (
          <WeekForm weekdays={this.weekdays} daysOfWeek={this.drawWeek()} />
        );
      case 3:
        return <DayForm drawOneDay={this.drawOneDay()} />;
    }
  };

  render() {
    const {
      active,
      currentDate,
      mode,
      onclickNext,
      onclickPrev,
      openSelectDateList,
      openModal,
      isMonth,
      isWeek,
      isDay,
      addActiveClass,
      isOpenDateList,
      onclickToday,
      onCreateEvent,
      isOpenModal,
      onCancel,
      onSubmit,
      isIntersection,
      events
    } = this.props;

    return (
      <>
        <AppHeader
          active={active}
          currentDate={currentDate}
          onclickNext={onclickNext}
          onclickPrev={onclickPrev}
          openSelectDateList={openSelectDateList}
          openModal={openModal}
          isMonth={isMonth}
          isWeek={isWeek}
          isDay={isDay}
          addActiveClass={addActiveClass}
        />

        <div className="calendar-wr">
          <div className="calendar-form">
            {this.getComponent(mode)}
            <SelectDate
              isOpenDateList={isOpenDateList}
              onclickToday={onclickToday}
              getListDateComponent={this.getListDateComponent(mode)}
            />
            <EventForm
              events={events}
              onCreateEvent={onCreateEvent}
              isOpenModal={isOpenModal}
              onCancel={onCancel}
              onSubmit={onSubmit}
              isIntersection={isIntersection}
            />
          </div>
        </div>
      </>
    );
  }
}
