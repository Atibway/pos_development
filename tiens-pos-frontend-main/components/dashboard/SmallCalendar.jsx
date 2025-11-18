import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function SmallCalendar() {
  const [value, onChange] = useState(new Date());

  return (
    <div className='md:w-[25vw]'>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}
export default SmallCalendar
