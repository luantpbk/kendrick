import React, { useState, useEffect } from 'react';
import './ChooseDateDetail.css';

interface ICalendar {
  onChange: (...args: any[]) => any;
}

interface IDate {
  date: number;
  month: number;
  year: number;
  inMonth: boolean;
}

enum EnumDay {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 0,
}

const ChooseDateDetail: React.FC<ICalendar> = (props) => {
  //Value
  const NUMBER_OF_MILLISECONDS_IN_ONE_DAY = 86400000;

  //State
  const [selectedDate, setSelectedDate] = useState<IDate>(null);
  const [today, setToday] = useState<IDate>(null);
  const [monthDisplay, setMonthDisplay] = useState(null);
  const [tempmonthDisplay, setTempMonthDisplay] = useState(null);
  const [yearDisplay, setYearDisplay] = useState(null);
  const [tempyearDisplay, setTempYearDisplay] = useState(null);
  const [dateArr, setDateArr] = useState<IDate[][]>(null);

  //Function
  const validateMonth = () => {
    if (tempmonthDisplay > 0 && tempmonthDisplay <= 12) {
      setMonthDisplay(tempmonthDisplay);
    } else {
      setTempMonthDisplay(monthDisplay);
    }
  };

  const validateYear = () => {
    if (tempyearDisplay >= 1970) {
      setYearDisplay(tempyearDisplay);
    } else {
      setTempYearDisplay(yearDisplay);
    }
  };

  const onNavMonth = (next?: boolean) => {
    if (next) {
      if (monthDisplay < 12) {
        setMonthDisplay(monthDisplay + 1);
        setTempMonthDisplay(monthDisplay + 1);
      } else {
        setMonthDisplay(1);
        setTempMonthDisplay(1);
        setYearDisplay(yearDisplay + 1);
        setTempYearDisplay(yearDisplay + 1);
      }
    } else {
      if (monthDisplay > 1) {
        setMonthDisplay(monthDisplay - 1);
        setTempMonthDisplay(monthDisplay - 1);
      } else {
        setMonthDisplay(12);
        setTempMonthDisplay(12);
        setYearDisplay(yearDisplay - 1);
        setTempYearDisplay(yearDisplay - 1);
      }
    }
  };

  const onNavYear = (next?: boolean) => {
    if (next) {
      setYearDisplay(yearDisplay + 1);
      setTempYearDisplay(yearDisplay + 1);
    } else {
      if (yearDisplay > 1970) {
        setYearDisplay(yearDisplay - 1);
        setTempYearDisplay(yearDisplay - 1);
      }
    }
  };

  //useEffect
  useEffect(() => {
    const dateObj = new Date();
    const _monthDisplay = dateObj.getMonth();
    const _yearDisplay = dateObj.getFullYear();
    const _dateDisplay = dateObj.getDate();

    const _tempDate: IDate = {
      date: _dateDisplay,
      month: _monthDisplay + 1,
      year: _yearDisplay,
      inMonth: true,
    };

    setSelectedDate(_tempDate);
    setToday(_tempDate);
    setMonthDisplay(_monthDisplay + 1);
    setTempMonthDisplay(_monthDisplay + 1);
    setYearDisplay(_yearDisplay);
    setTempYearDisplay(_yearDisplay);
  }, []);

  useEffect(() => {
    if (monthDisplay && yearDisplay) {
      const firstDate = new Date();
      const tempDate = new Date();
      const d = new Date(`${yearDisplay}-${monthDisplay}`);
      const millisecondsNow = d.getTime();

      const _dateArr = [];

      switch (d.getDay()) {
        case EnumDay.Monday:
          firstDate.setTime(millisecondsNow);
          break;
        case EnumDay.Tuesday:
          firstDate.setTime(millisecondsNow - NUMBER_OF_MILLISECONDS_IN_ONE_DAY);
          break;
        case EnumDay.Wednesday:
          firstDate.setTime(millisecondsNow - 2 * NUMBER_OF_MILLISECONDS_IN_ONE_DAY);
          break;
        case EnumDay.Thursday:
          firstDate.setTime(millisecondsNow - 3 * NUMBER_OF_MILLISECONDS_IN_ONE_DAY);
          break;
        case EnumDay.Friday:
          firstDate.setTime(millisecondsNow - 4 * NUMBER_OF_MILLISECONDS_IN_ONE_DAY);
          break;
        case EnumDay.Saturday:
          firstDate.setTime(millisecondsNow - 5 * NUMBER_OF_MILLISECONDS_IN_ONE_DAY);
          break;
        case EnumDay.Sunday:
          firstDate.setTime(millisecondsNow - 6 * NUMBER_OF_MILLISECONDS_IN_ONE_DAY);
          break;
      }

      for (let i = 1; i <= 6; i++) {
        const _temp = [];
        for (let j = 1; j <= 7; j++) {
          const _num = (i - 1) * 7 + (j - 1);
          tempDate.setTime(firstDate.getTime() + _num * NUMBER_OF_MILLISECONDS_IN_ONE_DAY);
          const _tempDate: IDate = {
            date: tempDate.getDate(),
            month: tempDate.getMonth() + 1,
            year: tempDate.getFullYear(),
            inMonth: tempDate.getMonth() + 1 == monthDisplay,
          };
          _temp.push(_tempDate);
        }
        _dateArr.push(_temp);
      }
      setDateArr(_dateArr);
    }
  }, [monthDisplay, yearDisplay]);

  //Main
  return (
    <div className="sim-price-calendar-container sim-price">
      <div className={`calendar-main show sim-price`}>
        <div className="calendar-nav">
          <div className="calendar-nav-container">
            <div
              className="calendar-nav-icon"
              title="Năm trước"
              onClick={() => {
                onNavYear();
              }}
            >
              <i className="fas fa-angle-double-left"></i>
            </div>
            <div
              className="calendar-nav-icon"
              title="Tháng trước"
              onClick={() => {
                onNavMonth();
              }}
            >
              <i className="fas fa-angle-left"></i>
            </div>
          </div>
          <div>
            <span>Tháng</span>
            <input
              className="calendar-month-input"
              type="text"
              value={tempmonthDisplay}
              onChange={(event) => {
                if (Number(event.target.value)) {
                  setTempMonthDisplay(Number(event.target.value));
                } else {
                  setTempMonthDisplay(0);
                }
              }}
              onKeyDown={(event) => {
                if (event.keyCode == 13) {
                  validateMonth();
                }
              }}
              onBlur={validateMonth}
            />
            <span>-</span>
            <input
              className="calendar-year-input"
              type="text"
              value={tempyearDisplay}
              onChange={(event) => {
                if (Number(event.target.value)) {
                  setTempYearDisplay(Number(event.target.value));
                } else {
                  setTempYearDisplay(0);
                }
              }}
              onKeyDown={(event) => {
                if (event.keyCode == 13) {
                  validateYear();
                }
              }}
              onBlur={validateYear}
            />
          </div>
          <div className="calendar-nav-container">
            <div
              className="calendar-nav-icon"
              title="Tháng sau"
              onClick={() => {
                onNavMonth(true);
              }}
            >
              <i className="fas fa-angle-right"></i>
            </div>
            <div
              className="calendar-nav-icon"
              title="Năm sau"
              onClick={() => {
                onNavYear(true);
              }}
            >
              <i className="fas fa-angle-double-right"></i>
            </div>
          </div>
        </div>
        <div className="date-line-calendar-component">
          <div className="date-calendar-component no-hover">Thứ 2</div>
          <div className="date-calendar-component no-hover">Thứ 3</div>
          <div className="date-calendar-component no-hover">Thứ 4</div>
          <div className="date-calendar-component no-hover">Thứ 5</div>
          <div className="date-calendar-component no-hover">Thứ 6</div>
          <div className="date-calendar-component no-hover">Thứ 7</div>
          <div className="date-calendar-component red no-hover">CN</div>
        </div>
        {dateArr
          ? dateArr.map((valueLv1: IDate[]) => {
              return (
                <div className="date-line-calendar-component">
                  {valueLv1.map((valueLv2: IDate, index: number) => {
                    return (
                      <div
                        className={`date-calendar-component ${index == 6 ? 'red' : ''} ${
                          valueLv2.inMonth ? '' : 'blur'
                        } ${
                          valueLv2.date == selectedDate.date &&
                          valueLv2.month == selectedDate.month &&
                          valueLv2.year == selectedDate.year
                            ? 'selected'
                            : ''
                        }  ${
                          valueLv2.date == today.date &&
                          valueLv2.month == today.month &&
                          valueLv2.year == today.year
                            ? 'today'
                            : ''
                        }`}
                        onClick={() => {
                          const _tempDate: IDate = {
                            date: valueLv2.date,
                            month: valueLv2.month,
                            year: valueLv2.year,
                            inMonth: true,
                          };
                          setSelectedDate(_tempDate);
                          setYearDisplay(valueLv2.year);
                          setTempYearDisplay(valueLv2.year);
                          setMonthDisplay(valueLv2.month);
                          setTempMonthDisplay(valueLv2.month);
                        }}
                      >
                        {valueLv2.date}
                      </div>
                    );
                  })}
                </div>
              );
            })
          : null}
      </div>
      <div
        className="choose-detail-btn"
        onClick={() => {
          props.onChange(`${selectedDate.date}/${selectedDate.month}/${selectedDate.year}`);
        }}
      >
        Chọn
      </div>
    </div>
  );
};

export default ChooseDateDetail;
