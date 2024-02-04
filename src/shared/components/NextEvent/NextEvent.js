import React, { useState, useEffect, useContext } from 'react';

import Moment from 'moment';

import { AuthContext } from '../../../shared/context/auth-context';
import { useHttpClient } from '../../../shared/hooks/http-hook';

import Input from '../../../shared/components/FormElements/Input';
import Button from '../../../shared/components/FormElements/Button';
import ErrorModal from '../../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE, VALIDATOR_PAST_DATE } from '../../../shared/util/validators';
import { useForm } from '../../../shared/hooks/form-hook';

import './NextEvent.scss';

const NextEvent = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
          name: {
            value: '',
            isValid: false
          },
          date: {
            value: '',
            isValid: false
          },
          time: {
            value: '',
            isValid: false
          },
        },
        false
      );

    const [ nextEventInfo, setNextEventInfo ] = useState();
    const [ fullTimeString, setFullTimeString ] = useState();
    const [ viewNextEventInfo, setViewNextEventInfo ] = useState((auth?.isLoggedIn && auth?.isManager) ? false : true);
    const [ timeStringColor, setTimeStringColor ] = useState();
    
    useEffect(() => {
        const fetchNextEventInfo = async () => {
          try {
            const responseData = await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/next_event`
            );
            setNextEventInfo(responseData.nextEvent || {});
          } catch (err) {}
        };
        fetchNextEventInfo();
      }, [sendRequest]);

    const getTimeString = (value, name) => {
        if (value > 1) {
            return name + 's';
        }

        return name;
    }

    const getTimestringToEvent = eventDate => {
        const currentDate = new Date();
        const diffInMilliseconds = eventDate.getTime() - currentDate.getTime();
        
        const diffInSeconds = Math.floor(diffInMilliseconds/1000);

        const day = Math.floor(diffInSeconds/(24*60*60));
        const hour = Math.floor(diffInSeconds/(60*60)) - day*24;
        const minute = Math.floor(diffInSeconds/60) - day*24*60 - hour*60;
        const second = diffInSeconds - day*24*60*60 - hour*60*60 - minute*60;

        const dayString = getTimeString(day, Object.keys({day}));
        const hourString = getTimeString(hour, Object.keys({hour}));
        const minuteString = getTimeString(minute, Object.keys({minute}));
        const secondString = getTimeString(second, Object.keys({second}));

        const generatedFullTimeString = `${day > 0 ? (day + ' ' + dayString + ' : ') : ''}
                                        ${day > 0 || hour > 0 ? (hour + ' ' + hourString + ' : ') : ''}
                                        ${day > 0 || hour > 0 || minute > 0 ? (minute + ' ' + minuteString + ' : ') : ''}
                                        ${day > 0 || hour > 0 || minute > 0 || second > 0 ? (second + ' ' + secondString) : ''}`;
        
        if (eventDate > currentDate) {
            setFullTimeString(generatedFullTimeString);
        } else {
            setFullTimeString();
        }

        if (day >= 7) {
            setTimeStringColor("yellow");
        } else if (day >= 1) {
            setTimeStringColor("orange");
        } else {
            setTimeStringColor("red");
        }
    };

    useEffect(() => {
        if (nextEventInfo?._id) {
            const intervalId = setInterval(() => getTimestringToEvent(new Date(nextEventInfo.dateTime)), 1000);
            
            return () => intervalId ? clearInterval(intervalId) : null;
        }
    });

    const nextEventSubmitHandler = async event => {
        event.preventDefault();
        try {
            const name = formState.inputs.name.value;
            const date = formState.inputs.date.value;
            const time = formState.inputs.time.value;
            const dateTime = new Date(date);

            dateTime.setHours(+time.substr(0,2));// - Math.floor(dateTime.getTimezoneOffset() / 60));
            dateTime.setMinutes(+time.substr(3,2));// - dateTime.getTimezoneOffset() % 60);

            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/next_event`, 'POST',
            JSON.stringify({
                name,
                dateTime
            }),
            {
                Authorization: 'Bearer ' + auth.token,
                'Content-Type': 'application/json'
            });
        } catch (err) {}
    }

    return (
        <>
            <div className="next-event-container">
                {(fullTimeString || (auth?.isLoggedIn && auth?.isManager)) && (
                    <div className="show-more toggle-next-event-info" onClick={() => setViewNextEventInfo(!viewNextEventInfo)}>
                        {viewNextEventInfo ? 'Hide Next Event Info' : 'Show Next Event Info'}
                    </div>
                )}
                {fullTimeString && !auth?.isLoggedIn && viewNextEventInfo && (
                    <div>
                        <div className="time-to-next-event-label">Time To Next Event</div>
                        <div className={`remaining-time--${timeStringColor}`} /*style={{color: timeStringColor}}*/>{fullTimeString}</div>
                        <div className="next-event-name">{nextEventInfo.name}</div>
                        <div>{Moment(nextEventInfo.dateTime).format('DD MMM YYYY, HH:mm')}</div>
                    </div>
                )}
                {auth?.isLoggedIn && auth?.isManager && viewNextEventInfo && !!nextEventInfo && (
                    <div>
                        <ErrorModal error={error} onClear={clearError} />
                        <form onSubmit={nextEventSubmitHandler}>
                            {isLoading && <LoadingSpinner asOverlay="center" />}
                            <Input
                                id="name"
                                element="input"
                                type="text"
                                label="Next Event Name"
                                validators={[VALIDATOR_REQUIRE()]}
                                initialValue={nextEventInfo.name}
                                errorText="Please enter a valid event name."
                                onInput={inputHandler}
                            />
                            <Input
                                id="date"
                                element="input"
                                type="date"
                                label="Next Event Date"
                                validators={[VALIDATOR_REQUIRE(), VALIDATOR_PAST_DATE()]}
                                initialValue={Moment(nextEventInfo.dateTime).utc(true)?.toJSON().substring(0,10)}
                                errorText="Please enter a valid event date."
                                onInput={inputHandler}
                            />
                            <Input
                                id="time"
                                element="input"
                                type="time"
                                label="Next Event Time"
                                validators={[VALIDATOR_REQUIRE()]}
                                initialValue={Moment(nextEventInfo.dateTime).utc(true)?.toJSON().substring(11,16)}
                                errorText="Please enter a valid event date."
                                onInput={inputHandler}
                            />
                            <Button type="submit">
                                ADD NEXT EVENT
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default NextEvent;