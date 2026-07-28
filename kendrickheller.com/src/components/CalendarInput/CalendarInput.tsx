
import './CalendarInput.css';
import Calendar, { EnumCalendarAlign, EnumCalendarPos } from '../Calendar/Calendar';

interface ICalendarInput {
  value: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
}

const CalendarInput = (props: ICalendarInput) => {

  const { value, onChange, isDisabled } = props;

  return (
    <>
      <div className={`calendar-input`}>
        {isDisabled ? <i className='fas fa-calendar-alt' /> : <Calendar
          align={EnumCalendarAlign.left}
          pos={EnumCalendarPos.bot}
          onChange={onChange}
        />}
        <label>{value}</label>
      </div>
    </>
  );
};

export default CalendarInput;

