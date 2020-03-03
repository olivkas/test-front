import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import './EventForm.css';
import 'react-datepicker/dist/react-datepicker.css';

const initialState = {
  eventName: '',
  eventDescription: '',
  eventDate: moment(),
  eventTimeFrom: moment(),
  eventTimeTo: moment(),

  newEventNameError: '',
  newEventDateError: '',
  newEventTimeFromError: '',
  newEventTimeToError: '',
  newEventIsCross: ''
};

export class EventForm extends Component {
  state = initialState;

  newEventName = e => {
    this.setState({ eventName: e.target.value });
  };

  newEventDescription = e => {
    this.setState({ eventDescription: e.target.value });
  };

  newEventDate = e => {
    this.setState({ eventDate: moment(e.target.value) });
  };

  newEventTimeFrom = value => {
    const currentEventTimeFrom = moment(
      moment(value)
        .set({
          y: this.state.eventDate.format('YYYY'),
          M: this.state.eventDate.format('MM') - 1,
          D: this.state.eventDate.format('DD')
        })
        .toDate()
    );
    this.setState({ eventTimeFrom: currentEventTimeFrom });
  };

  newEventTimeto = value => {
    const currentEventTimeTo = moment(
      moment(value)
        .set({
          y: this.state.eventDate.format('YYYY'),
          M: this.state.eventDate.format('MM') - 1,
          D: this.state.eventDate.format('DD')
        })
        .toDate()
    );
    this.setState({ eventTimeTo: currentEventTimeTo });
  };

  validate = isCrosses => {
    let newEventNameError = '';
    let newEventDateError = '';
    let newEventTimeFromError = '';
    let newEventTimeToError = '';
    let newEventIsCross = '';

    if (this.state.eventTimeTo.isSameOrBefore(this.state.eventTimeFrom)) {
      newEventTimeToError = 'wrong time format';
    }
    if (!this.state.eventName) {
      newEventNameError = 'name is empty';
    }
    if (!this.state.eventDate) {
      newEventDateError = 'date is empty';
    }
    if (!this.state.eventTimeFrom) {
      newEventTimeFromError = 'time from is empty';
    }
    if (!this.state.eventTimeTo) {
      newEventTimeToError = 'time to is empty';
    }
    if (isCrosses) {
      newEventIsCross = 'This event crosses with another event';
    }
    if (
      newEventNameError ||
      newEventDateError ||
      newEventTimeFromError ||
      newEventTimeToError ||
      newEventIsCross
    ) {
      this.setState({
        newEventNameError,
        newEventDateError,
        newEventTimeFromError,
        newEventTimeToError,
        newEventIsCross
      });

      return false;
    }

    return true;
  };

  isIntersection = (date, timeFrom, timeTo) => {
    const events = this.props.events.filter(event =>
      event.eventDate.isSame(date, 'day')
    );
    const currentEventsRelatedTimeFrom = events.filter(
      event =>
        event.eventTimeFrom.isSameOrBefore(timeFrom) &&
        event.eventTimeTo.isSameOrAfter(timeFrom)
    );
    const currentEventsRelatedTimeTo = events.filter(
      event =>
        event.eventTimeFrom.isSameOrBefore(timeTo) &&
        event.eventTimeTo.isSameOrAfter(timeTo)
    );
    const currentEventsRelatedEventTimeFrom = events.filter(
      event =>
        timeFrom.isSameOrBefore(event.eventTimeFrom) &&
        timeTo.isSameOrAfter(event.eventTimeFrom)
    );
    const currentEventsRelatedEventTimeTo = events.filter(
      event =>
        timeFrom.isSameOrBefore(event.eventTimeTo) &&
        timeTo.isSameOrAfter(event.eventTimeTo)
    );

    return (
      currentEventsRelatedTimeFrom.length > 0 ||
      currentEventsRelatedTimeTo.length > 0 ||
      currentEventsRelatedEventTimeFrom.length > 0 ||
      currentEventsRelatedEventTimeTo.length > 0
    );
  };

  closeFormEvent = () => {
    this.props.onCancel();
    this.setState(initialState);
  };

  handleEventCreation = () => {
    const {
      eventName,
      eventDate,
      eventDescription,
      eventTimeFrom,
      eventTimeTo
    } = this.state;

    if (
      !eventName &&
      !eventDate &&
      !eventDescription &&
      !eventTimeFrom &&
      !eventTimeTo
    ) {
      return;
    }
    const { onCreateEvent } = this.props;
    const isCrosses = this.isIntersection(
      eventDate,
      eventTimeFrom,
      eventTimeTo
    );
    const isValid = this.validate(isCrosses);

    if (isValid && !isCrosses) {
      onCreateEvent({
        eventName,
        eventDescription,
        eventDate,
        eventTimeFrom,
        eventTimeTo
      });
      this.setState(initialState);
    }

    return isValid && !isCrosses;
  };

  render() {
    const {
      eventName,
      eventDescription,
      eventDate,
      eventTimeFrom,
      eventTimeTo
    } = this.state;
    const { isOpenModal, onSubmit } = this.props;

    return (
      <>
        {isOpenModal && (
          <div className="modal">
            <div className="modalOverlay">
              <div className="modalWindow">
                <div className="modalHeader">
                  <div className="modalTitle">New event</div>
                  <i
                    className="fa fa-times"
                    aria-hidden="true"
                    onClick={this.closeFormEvent}
                  ></i>
                </div>
                <hr />
                <div className="modalBody">
                  <div className="eventName">
                    <label>Name</label>
                    <div className="blockInput">
                      <input
                        type="text"
                        value={eventName}
                        onChange={this.newEventName}
                        maxLength="15"
                      />
                      <div className="formErr">
                        {this.state.newEventNameError}
                      </div>
                    </div>
                  </div>
                  <div className="eventDescription">
                    <label>Description</label>
                    <div className="blockInput">
                      <input
                        type="text"
                        value={eventDescription}
                        onChange={this.newEventDescription}
                      />
                    </div>
                  </div>
                  <div className="eventDate">
                    <label>Date</label>
                    <div className="blockInput">
                      <input
                        type="date"
                        value={eventDate.format('YYYY-MM-DD')}
                        onChange={this.newEventDate}
                      />
                      <div className="formErr">
                        {this.state.newEventDateError}
                      </div>
                    </div>
                  </div>
                  <div className="eventTimeFrom">
                    <label>Time from</label>
                    <div className="blockInput">
                      <DatePicker
                        selected={eventTimeFrom.toDate()}
                        onChange={this.newEventTimeFrom}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                      />
                      <div className="formErr">
                        {this.state.newEventTimeFromError}
                      </div>
                    </div>
                  </div>
                  <div className="eventTimeTo">
                    <label>Time to</label>
                    <div className="blockInput">
                      <DatePicker
                        selected={eventTimeTo.toDate()}
                        onChange={this.newEventTimeto}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                      />
                      <div className="formErr">
                        {this.state.newEventTimeToError}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modalFooter">
                  <button
                    className="btn-create"
                    onClick={e => this.handleEventCreation(e) && onSubmit()}
                  >
                    Create
                  </button>
                  <div className="formErr_btn">
                    {this.state.newEventIsCross}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
