import React, { useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import { makeStyles } from '@material-ui/styles';
import { TextField, Select, IconButton } from '@material-ui/core';
import { ArrowBack, ChevronLeft, ChevronRight, ArrowForward } from '@material-ui/icons';
import './index.css';

const useStyle = makeStyles({
  selectRoot: {
    padding: '6px',
    color: 'rgba(0,0,0,.65)'
  },
  menuItemRoot: {
    lineHeight: '1',
  }
})

const cache = {};
const allWeek = ['日', '一', '二', '三', '四', '五', '六'];
const allMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const allYear = [], allHour = [], allMinute = [];
for (let i = 1970; i <= moment().year() + 5; i++) {
  allYear.push(i);
}
for (let i = 0; i < 24; i++) {
  allHour.push(i);
}
for (let i = 0; i < 60; i++) {
  allMinute.push(i);
}
const daysInMonth = (year) => {
  if (cache[year]) return cache[year]
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  days[1] = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28

  const daysOfYear = days.map((number, index) => {
    let pre = days[index - 1]
    if (index === 0) pre = days[11]
    const thisMonth = []

    let day = new Date(year, index, 1).getDay()

    while (day--) thisMonth.unshift(pre--)
    for (let i = 1; i <= number; i++) thisMonth.push(i)
    let remDay = 42 - thisMonth.length, i = 1;
    while (remDay--) thisMonth.push(i++)

    const result = [];
    for (let i = 0; i < thisMonth.length; i += 7) {
      result.push(thisMonth.slice(i, i + 7));
    }
    return result;
  })

  cache[year] = daysOfYear
  return daysOfYear
}


const DatePicker = (props) => {
  const
    {
      title,
      placeholder,
      value: propsValue,
      format,
      onChange,
    } = props,
    classes = useStyle(),
    pickerRef = useRef(null),
    [open, setOpen] = useState(false),
    [value, setValue] = useState((moment.isMoment(propsValue) && propsValue) || moment()),
    [inputValue, setInputValue] = useState((moment.isMoment(propsValue) && propsValue.format(format)) || ''),
    [currentYear, setCurrentYear] = useState(() => value.year()),
    [currentMonth, setCurrentMonth] = useState(() => value.month()),
    [currentHour, setCurrentHour] = useState(() => value.hour()),
    [currentMinute, setCurrentMinute] = useState(() => value.minute()),
    weeks = daysInMonth(currentYear)[currentMonth];

  const handleClick = useCallback((e) => {
    if (pickerRef.current !== e.target.closest('.picker')) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    }
  }, [handleClick]);

  useEffect(() => {
    if (inputValue && !propsValue) {
      onChange(value, inputValue);
    }
    if (inputValue && propsValue && !value.isSame(propsValue)) {
      onChange(value, inputValue);
    }
  }, [inputValue]);

  const changeValue = useCallback(async (year, month, date, hour, minute) => {
    const newValue = moment([year, month, date, hour || currentHour, minute || currentMinute]);
    await setValue(newValue);
    setInputValue(newValue.format(format));
  }, [onChange, value, currentHour, currentMinute]);
  const selectYear = useCallback((e) => {
    setCurrentYear(Number(e.target.value));
  }, []);
  const selectMonth = useCallback((e) => {
    setCurrentMonth(Number(e.target.value));
  }, []);
  const selectHour = useCallback((e) => {
    setCurrentHour(Number(e.target.value));
    changeValue(currentYear, currentMonth, value.date(), e.target.value, currentMinute);
  }, [currentMinute, currentMonth, currentYear, value]);
  const selectMinute = useCallback((e) => {
    setCurrentMinute(Number(e.target.value));
    changeValue(currentYear, currentMonth, value.date(), currentHour, e.target.value);
  }, [currentHour, currentMonth, currentYear, value]);
  const nextYear = useCallback((date) => {
    setCurrentYear(currentYear + 1);

    console.log('date: ', date);
    console.log('currentYear: ', currentYear);
    if (date && typeof date === 'number') {
      changeValue(currentYear + 1, 0, date);
    }
  }, [currentYear]);
  const prevYear = useCallback((date) => {
    setCurrentYear(currentYear - 1);
    if (date && typeof date === 'number') {
      changeValue(currentYear - 1, 11, date)
    }
  }, [currentYear]);
  const nextMonth = useCallback((date) => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      nextYear(date);
    } else {
      setCurrentMonth(currentMonth + 1);
      if (date && typeof date === 'number') {
        changeValue(currentYear, currentMonth + 1, date, currentHour, currentMinute);
      }
    }
  }, [currentHour, currentMinute, currentMonth, currentYear, nextYear]);
  const preMonth = useCallback((date) => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      prevYear(date);
    } else {
      setCurrentMonth(currentMonth - 1);
      if (date && typeof date === 'number') {
        changeValue(currentYear, currentMonth - 1, date, currentHour, currentMinute);
      }
    }
  }, [currentHour, currentMinute, currentMonth, currentYear, prevYear]);
  const onPick = useCallback((date, whichMonth) => {
    if (whichMonth !== 0) {
      if (whichMonth === 1) {
        nextMonth(date)
      } else {
        preMonth(date)
      }
    } else {
      changeValue(currentYear, currentMonth, date, currentHour, currentMinute);
    }
    setOpen(true);
  }, [currentHour, currentMinute, currentMonth, currentYear, nextMonth, preMonth]);
  return (
    <div ref={pickerRef} className='picker pos-rel'>
      <div
        data-testid='textField'
        className='pos-rel'
        onClick={() => setOpen(true)}
      >
        <TextField
          fullWidth
          label={title}
          placeholder={placeholder}
          variant='outlined'
          value={inputValue}
        />
      </div>
      {
        open ?
          <div
            data-testid="datepicker"
            style={{ maxHeight: open ? '500px' : '0' }}
            className='datepicker'
          >
            <div className='calendar'>
              <div className='top'>
                <div>
                  <IconButton
                    size='small'
                    onClick={prevYear}
                  >
                    <ArrowBack />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={preMonth}
                  >
                    <ChevronLeft />
                  </IconButton>
                </div>
                <div className='select'>
                  <Select
                    data-testid='select-year'
                    native
                    classes={{ root: classes.selectRoot }}
                    value={currentYear}
                    variant='outlined'
                    onChange={selectYear}
                  >
                    {
                      allYear.map((year, index) => {
                        return (
                          <option
                            key={index}
                            value={year}>{year}
                          </option>
                        )
                      })
                    }
                  </Select>
                  <Select
                    data-testid='select-month'
                    native
                    classes={{ root: classes.selectRoot }}
                    value={currentMonth}
                    variant='outlined'
                    onChange={selectMonth}
                  >
                    {
                      allMonth.map((month, index) => {
                        return (
                          <option
                            key={index}
                            value={index}
                          >
                            {month}
                          </option>
                        )
                      })
                    }
                  </Select>
                </div>
                <div>
                  <IconButton
                    size='small'
                    onClick={nextMonth}
                  >
                    <ChevronRight />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={nextYear}
                  >
                    <ArrowForward />
                  </IconButton>
                </div>
              </div>
              <div className='weeks'>
                {
                  allWeek.map((week, index) => {
                    return (
                      <div key={index} className='text-box'>{week}</div>
                    )
                  })
                }
              </div>
              <div className='dates'>
                {
                  weeks.map((week, wIdx) => {
                    return (
                      <div
                        key={wIdx}
                        className='dis-flex'
                      >
                        {
                          week.map((day, dIdx) => {
                            let whichMonth = 0
                            let active = false
                            if (day > 10 && wIdx < 1) whichMonth = -1
                            if (day < 20 && wIdx > 3) whichMonth = 1
                            if (
                              whichMonth === 0 &&
                              value.date() === day &&
                              value.month() === currentMonth &&
                              value.year() === currentYear
                            ) active = true
                            return (
                              <div
                                data-testid={`whichMonth${whichMonth}`}
                                key={dIdx}
                                style={{
                                  color: whichMonth === 0 ? 'rgba(0,0,0,.65)' : 'rgba(0,0,0,.25)'
                                }}
                                className='text-box cur-point'
                                onClick={() => onPick(day, whichMonth)}
                              >
                                <div
                                  style={{
                                    color: active ? 'white' : 'inherit',
                                    backgroundColor: active ? '#108ee9' : ''
                                  }}
                                  className='text'
                                >
                                  {day}
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className='time-picker'>
              <Select
                data-testid='select-hour'
                native
                classes={{ root: classes.selectRoot }}
                value={currentHour}
                variant='outlined'
                onChange={selectHour}
              >
                {
                  allHour.map((hour, index) => {
                    return (
                      <option
                        key={index}
                        value={hour}
                      >
                        {`${hour < 10 ? '0' : ''}${hour}`}
                      </option>
                    )
                  })
                }
              </Select>
              <div className='colon'>:</div>
              <Select
                data-testid='select-minute'
                native
                classes={{ root: classes.selectRoot }}
                value={currentMinute}
                variant='outlined'
                onChange={selectMinute}
              >
                {
                  allMinute.map((minute, index) => {
                    return (
                      <option
                        key={index}
                        value={minute}
                      >
                        {`${minute < 10 ? '0' : ''}${minute}`}
                      </option>
                    )
                  })
                }
              </Select>
            </div>
          </div>
          : null
      }

    </div>
  )
}

DatePicker.propTypes = {
  title: PropTypes.string,
  format: PropTypes.string,
  placeholder: PropTypes.string,
  value: (props, propName, componentName) => {
    if (props[propName] && !moment.isMoment(props[propName])) {
      return new Error(`${propName} props需要 moment()實例`)
    }
  },
  onChange: PropTypes.func,
}

DatePicker.defaultProps = {
  title: '',
  format: 'YYYY/MM/DD HH:mm',
  placeholder: '',
  value: null,
  onChange: () => { },
}

export default DatePicker;