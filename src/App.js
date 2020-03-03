import React, { PureComponent } from 'react';
import moment from 'moment';
import './App.css';

import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from './components/Calendar';

export default class App extends PureComponent {
  state = {
    events: [],
    mode: 1,
    isOpenModal: false,
    isOpenDateList: false,
    dateContext: moment(),
    currentDate: moment().format('MMMM YYYY'),
    selectedDay: moment(this.dateContext),
    windowDate: 1,
    weekIndex: 0,
    active: 'isMonth'
  };

  addActiveClass = e => {
    const clicked = e.target.id;
    if (this.state.active === clicked) {
      this.setState({ active: '' });
    } else {
      this.setState({ active: clicked });
    }
  };

  onDayClick = (e, day) => {
    this.setState({ selectedDay: day });
  };

  getDaysWeeksforHeader = selectedDay => {
    let oneWeek = [];
    let strWeek = '';
    let currentDay =
      moment(selectedDay).format('d') == 0
        ? 7
        : moment(selectedDay).format('d');
    for (let i = 1; i <= 7; i++) {
      oneWeek.push(
        moment(selectedDay)
          .add(i - currentDay, 'days')
          .format('D MMMM YYYY')
      );
    }

    oneWeek = oneWeek.filter((day, i) => {
      if (i == 0 || i == 6) return day[i];
    });
    strWeek = `${oneWeek[0]} - ${oneWeek[1]}`;
    return strWeek;
  };

  onclickNext = () => {
    switch (this.state.mode) {
      case 1:
        return this.setState({
          selectedDay: moment(this.state.selectedDay).add(1, 'M'),
          currentDate: moment(this.state.selectedDay)
            .add(1, 'M')
            .format('MMMM YYYY')
        });
      case 2:
        return this.setState({
          selectedDay: moment(this.state.selectedDay).add(1, 'w'),
          currentDate: this.getDaysWeeksforHeader(
            this.state.selectedDay.add(1, 'w')
          )
        });
      case 3:
        return this.setState({
          selectedDay: moment(this.state.selectedDay).add(1, 'd'),
          currentDate: this.state.selectedDay.add(1, 'd').format('D MMMM YYYY')
        });
    }
  };

  onclickPrev = () => {
    switch (this.state.mode) {
      case 1:
        return this.setState({
          selectedDay: moment(this.state.selectedDay).add(-1, 'M'),
          currentDate: moment(this.state.selectedDay)
            .add(-1, 'M')
            .format('MMMM YYYY')
        });
      case 2:
        return this.setState({
          selectedDay: moment(this.state.selectedDay).add(-1, 'w'),
          currentDate: this.getDaysWeeksforHeader(
            this.state.selectedDay.add(-1, 'w')
          )
        });
      case 3:
        return this.setState({
          selectedDay: moment(this.state.selectedDay).add(-1, 'd'),
          currentDate: this.state.selectedDay.add(-1, 'd').format('D MMMM YYYY')
        });
    }
  };

  openModal = () => {
    this.setState({ isOpenModal: true });
  };

  openDateList = () => {
    this.setState({ isOpenDateList: !this.state.isOpenDateList });
  };

  isOpenMonth = () => {
    this.setState({
      mode: 1,
      currentDate: this.state.selectedDay.format('MMMM YYYY')
    });
  };

  isOpenWeek = () => {
    this.setState({
      mode: 2,
      currentDate: this.getDaysWeeksforHeader(this.state.selectedDay)
    });
  };

  isOpenDay = () => {
    this.setState({
      mode: 3,
      currentDate: this.state.selectedDay.format('D MMMM YYYY')
    });
  };

  handleSubmit = () => {
    this.setState({ isOpenModal: false });
  };

  handleCancel = () => {
    this.setState({ isOpenModal: false });
  };

  handleEventCreation = event => {
    this.setState({ events: [...this.state.events, event] });
  };

  onClickMonthList = (e, month) => {
    const selected = this.state.selectedDay;
    this.setState({
      isOpenDateList: !this.state.isOpenDateList,
      selectedDay: moment(this.state.selectedDay).set({
        y: selected.format('YYYY'),
        M: month - 1
      }),
      currentDate: moment(this.state.selectedDay)
        .set({ y: selected.format('YYYY'), M: month - 1 })
        .format('MMMM YYYY')
    });
  };

  onClickWeeksList = (e, selecte) => {
    this.setState({
      isOpenDateList: !this.state.isOpenDateList,
      selectedDay: moment(this.state.selectedDay).set({
        y: selecte.format('YYYY'),
        M: selecte.format('M') - 1,
        D: selecte.format('D')
      }),
      currentDate: this.getDaysWeeksforHeader(
        moment(this.state.selectedDay).set({
          y: selecte.format('YYYY'),
          M: selecte.format('M') - 1,
          D: selecte.format('D')
        })
      )
    });
  };

  onClickCalendarList = value => {
    this.setState({
      isOpenDateList: !this.state.isOpenDateList,
      selectedDay: moment(this.state.selectedDay).set({
        y: moment(value).format('YYYY'),
        M: moment(value).format('M') - 1,
        D: moment(value).format('D')
      }),
      currentDate: moment(this.state.selectedDay)
        .set({
          y: moment(value).format('YYYY'),
          M: moment(value).format('M') - 1,
          D: moment(value).format('D')
        })
        .format('D MMMM YYYY')
    });
  };

  onclickToday = () => {
    const now = this.state.dateContext;
    switch (this.state.mode) {
      case 1:
        return this.setState({
          isOpenDateList: !this.state.isOpenDateList,
          selectedDay: moment(this.state.selectedDay).set({
            y: now.format('YYYY'),
            M: now.format('M') - 1
          }),
          currentDate: moment(this.state.selectedDay)
            .set({ y: now.format('YYYY'), M: now.format('M') - 1 })
            .format('MMMM YYYY')
        });
      case 2:
        return this.setState({
          isOpenDateList: !this.state.isOpenDateList,
          selectedDay: moment(this.state.selectedDay).set({
            y: now.format('YYYY'),
            M: now.format('M') - 1,
            D: now.format('D')
          }),
          currentDate: this.getDaysWeeksforHeader(
            this.state.selectedDay.set({
              y: now.format('YYYY'),
              M: now.format('M') - 1,
              D: now.format('D')
            })
          )
        });
      case 3:
        return this.setState({
          isOpenDateList: !this.state.isOpenDateList,
          selectedDay: moment(this.state.selectedDay).set({
            y: now.format('YYYY'),
            M: now.format('M') - 1,
            D: now.format('D')
          }),
          currentDate: moment(this.state.selectedDay)
            .set({
              y: now.format('YYYY'),
              M: now.format('M') - 1,
              D: now.format('D')
            })
            .format('D MMMM YYYY')
        });
    }
  };

  render() {
    const {
      active,
      mode,
      isOpenModal,
      currentDate,
      isOpenDateList,
      selectedDay,
      dateContext,
      events
    } = this.state;

    return (
      <Calendar
        dateContext={dateContext}
        selectedDay={selectedDay}
        active={active}
        currentDate={currentDate}
        mode={mode}
        events={events}
        onclickNext={this.onclickNext}
        onclickPrev={this.onclickPrev}
        openSelectDateList={this.openDateList}
        openModal={this.openModal}
        isMonth={this.isOpenMonth}
        isWeek={this.isOpenWeek}
        isDay={this.isOpenDay}
        addActiveClass={this.addActiveClass}
        getComponent={this.getComponent}
        isOpenDateList={isOpenDateList}
        onClickWeeksList={this.onClickWeeksList}
        onClickCalendarList={this.onClickCalendarList}
        onDayClick={this.onDayClick}
        onclickToday={this.onclickToday}
        getListDateComponent={this.getListDateComponent}
        getDaysWeeks={this.getDaysWeeks}
        onCreateEvent={this.handleEventCreation}
        isOpenModal={isOpenModal}
        onCancel={this.handleCancel}
        onSubmit={this.handleSubmit}
        onClickMonthList={this.onClickMonthList}
      />
    );
  }
}
