import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import timeGridPlugin from '@fullcalendar/timegrid'
// import scrollGridPlugin from "@fullcalendar/scrollgrid";

function CalendarComp() {
    return (
        <FullCalendar
        plugins={[ dayGridPlugin,bootstrap5Plugin,timeGridPlugin ]}
        initialView="timeGridWeek"
        timeZone ='local'
        slotDuration ='00:15:00'
        slotMinTime = "08:00:00"
        slotMaxTime = "18:00:00"
       
        eventBackgroundColor = '#149A1A'
        eventBorderColor = '#149A1A'
        nowIndicator = 'true'
        scrollTime = 'moment().subtract(50, "minutes").format("HH:mm:ss")'
        events={[
          {
            title: 'All Day Event ',
            start: '2023-04-05'
          },
          {
            title: 'Long Event',
            start: '2023-04-05',
            end: '2023-04-05'
          },
          {
            id: 999,
            title: 'Repeating Event',
            start: '2023-04-05T16:00:00'
          },
          {
            id: 999,
            title: 'Repeating Event',
            start: '2023-04-05T16:00:00'
          },
          {
            title: 'Conference',
            start: '2023-04-05',
            end: '2023-04-05'
          },
          {
            title: 'Meeting',
            start: '2023-04-05T10:30:00',
            end: '2023-04-05T12:30:00'
          },
          {
            title: 'Lunch',
            start: '2023-04-05T12:00:00'
          },
          {
            title: 'Meeting Mr Okello',
            start: '2023-04-05T08:30:00'
          },
          {
            title: 'Happy Hour',
            start: '2023-04-05T17:30:00'
          },
          {
            title: 'Dinner',
            start: '2023-04-05T20:00:00'
          },
          {
            title: 'Birthday Party',
            start: '2023-04-05T07:00:00'
          },
          {
            title: 'Click for Google',
            url: 'http://google.com/',
            start: '2023-04-25'
          }
        ]}
      />
    )
}
export default CalendarComp
