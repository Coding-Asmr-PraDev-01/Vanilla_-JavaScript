// DOM elements ( new Date(year, monthIndex, day) )
const spanDayEle = document.querySelectorAll('.day');
const iconLeftEle = document.querySelector('.fa-chevron-left');
const iconRightEle = document.querySelector('.fa-chevron-right');
const monthEle = document.querySelector('.month');
const yearEle = document.querySelector('.year');
const bottomEle = document.querySelector('.bottomBar');
const selectEle = document.querySelector('.theme-options');
const dateSpansEle = document.querySelectorAll('.date');
const eventContainerEle = document.querySelector('.event-container');
const eventHeadingEle = document.querySelector('.event-heading'); 
const eventInputTimeEle = document.querySelector('.event-input-time');
const eventInputTextEle = document.querySelector('.event-input-text');
const addBtnEle = document.querySelector('.add-btn');
const eventsListEle = document.querySelector('.events-list');

const dateObj = new Date();
let currentYear = dateObj.getFullYear();
let currentDate = dateObj.getDate();

// LIGHT/DARK Theme Logic
selectEle.addEventListener('change', function(){
     if(this.value === 'light'){
          document.body.removeAttribute('data-theme');
          document.body.setAttribute('data-theme', 'light');
     }else{
          document.body.removeAttribute('data-theme');
          document.body.setAttribute('data-theme', 'dark');
     }
});

// Generating Weekday Array
let weekdayArr = Array.from({length: 7}, (ele, ind) => {
     return new Date(2000, 0, ind + 1).toLocaleDateString("en", {weekday: "long"});
});

// Generating Months Array
const monthsArr = Array.from({length: 12}, (ele, ind) => {
     return new Date(null, ind + 1, null).toLocaleDateString("en", {month: "long"});
});

let monthInd = 0;
iconLeftEle.addEventListener('click', () => {
     monthInd = (monthInd - 1 + monthsArr.length) % monthsArr.length;
     monthEle.textContent = monthsArr[monthInd];

     if(monthInd === monthsArr.length - 1){
          currentYear--;
          yearEle.textContent = currentYear;
     }
     renderDays();
});

iconRightEle.addEventListener('click', () => {
     monthInd = (monthInd + 1) % monthsArr.length;
     monthEle.textContent = monthsArr[monthInd];

     if(monthInd === 0){
          currentYear++;
          yearEle.textContent = currentYear;
     }
     renderDays();
});

const renderDays = () => {
     if(monthInd === 0){
          monthEle.textContent = monthsArr[0];
          yearEle.textContent = currentYear;
     }
     bottomEle.innerHTML = "";
     
     let {datesArr, startingDay} = getDatesInMonth(currentYear, monthInd);

     spanDayEle.forEach((span, ind) => {
          // let adjustedInd = (ind + startingDay) % 7; logical error
          return (span.textContent = weekdayArr[ind].slice(0, 3));
     });

     datesArr.map((date, ind) => {
          let span = document.createElement('span');
          span.className = "date date-event";
          const eventId = `${date}_${monthsArr[monthInd]}_${currentYear}`;
          span.dataset.eventId = eventId;
          span.textContent = date;

          if(span.classList.contains('date')){
               span.addEventListener('click', (event) => handleDateClick(eventId)); 
          }

          if(ind <= startingDay){
               span.classList.add('prev-month-date');
          }

          // Check for the current Date
          if(
               currentYear === dateObj.getFullYear() &&
               monthInd === dateObj.getMonth() &&
               date === dateObj.getDate()
          ){
               span.classList.add('current-date');
          }

          bottomEle.appendChild(span);
     });
}

bottomEle.addEventListener('click', (event) => {
     const target = event.target;

     // Check if the clicked element has "date" class
     if(target.classList.contains('date')){
          clickedSpan = target;
          const eventId = target.dataset.eventId;
          handleDateClick(eventId);
     }
});

const getDatesInMonth = (year, month) => {
     const dates = [];
     const lastDate = new Date(year, month + 1, 0).getDate();
     const startingDay = new Date(year, month, 1).getDay(); // from [0 to 6]
     const prevMonthLastDate = new Date(year, month, 0).getDate();
     
     for(let i = startingDay; i >= 0; i--){
          dates.unshift(prevMonthLastDate - i);
     }

     for(let i = 1; i <= lastDate; i++){
          dates.push(i);
     }
     return {datesArr: dates, startingDay: startingDay};
}

const events = JSON.parse(localStorage.getItem('events')) || {};
let clickedSpan;


addBtnEle.addEventListener('click', () => {
     // console.log(events)
     console.log('clicked span : ' , clickedSpan)
     if(clickedSpan){
          console.log(clickedSpan)
          const eventId = clickedSpan.dataset.eventId;
          if(eventInputTimeEle.value !== "" && eventInputTextEle.value !== ""){

               const eventsForClickedDate = fetchEventsForDate(eventId);
               
               const newEvent = {
                    id: Date.now(),
                    time: eventInputTimeEle.value,
                    task: eventInputTextEle.value
               }
               
               // events[eventId] = events[eventId] || [];
               if(!events[eventId]){
                    events[eventId] = [];
               }
               events[eventId].push(newEvent);
     
               localStorage.setItem('events', JSON.stringify(events));
     
               // Clear the inputs
               eventInputTextEle.value = "";
               eventInputTimeEle.value = "";

               handleDateClick(eventId);
          }
     }

     if(!clickedSpan.dataset.eventId === document.querySelector('.clicked').dataset.eventId){
          clickedSpan = null;
     }

});

const handleDateClick = (eventId) => {
     const eventsForClickedDate = events[eventId] || [];
     const [date, month] = eventId.split("_");
     eventsListEle.innerHTML = '';

     eventsForClickedDate.forEach((event) => {
          let divWrapperEle = document.createElement('div');
          divWrapperEle.className = "wrapper-div";
          divWrapperEle.setAttribute('data-event-id', event.id);
          
          let divEle = document.createElement('div');
          divEle.className = "event-item";
          
          let pEle = document.createElement('p');
          pEle.className = "event-time";
          
          let h3Ele = document.createElement('h3');
          h3Ele.className = "event-task";

          let deleteBtnEle = document.createElement('button');
          deleteBtnEle.textContent = "delete";
          deleteBtnEle.className = "btn btn-delete";

          // Adding delete event handler
          deleteBtnEle.addEventListener('click', (e) => handleDeleteEvent(e, eventId));

          // Format the event.time
          const timeArr = event.time.split(':');
          const hours = parseInt(timeArr[0], 10);
          const minutes = parseInt(timeArr[1], 10);

          // Convert to 12-hr format
          const amOrPm = hours >= 12 ? 'PM' : 'AM';
          const hours12 = hours % 12 || 12;

          pEle.textContent = `${hours12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
          h3Ele.textContent = event.task;

          divEle.appendChild(pEle);
          divEle.appendChild(h3Ele);
          divWrapperEle.appendChild(divEle);
          divWrapperEle.appendChild(deleteBtnEle);
          eventsListEle.appendChild(divWrapperEle);  
     });

     // if user clicks on any date
     eventHeadingEle.textContent = `Create event for ${date}th ${month}`;
     eventContainerEle.style.display = "block";

     const prevClickedSpan = document.querySelector('.date.clicked');
     if(prevClickedSpan){
          prevClickedSpan.classList.remove('clicked');
     }

     event.target.classList.add('clicked');
}

const handleDeleteEvent = (e, eventId) => {
     console.log("Delete id : " + eventId);
     let entireEventEle = e.target.parentElement; 
     let id = e.target.parentElement.getAttribute('data-event-id');

     // Remove from UI 
     entireEventEle.remove();
     
     // Remove from localstorage
     events[eventId] = (events[eventId] || []).filter((event) => event.id != id);
     localStorage.setItem('events', JSON.stringify(events));
}    

// const createEventForDate = (evt, date, month, year) => {
//      const eventId = `${date}_${month}_${year}`;
//      const [day, mon, yr] = eventId.split("_");

//      // Get the events of date clicked
//      const eventsForClickedDate = fetchEventsForDate(eventId);
//      console.log(eventsForClickedDate)

//      // if user clicks on any date
//      eventHeadingEle.textContent = `Create event for ${date}th ${month}`;
//      eventContainerEle.style.display = "block";
     
     
//      // Clear the events array for the current date
//      events.length = 0;
// }

const fetchEventsForDate = (eventId) => {
     const [day, mon, yr] = eventId.split("_");
     // return events.filter((event) => {
     //      return event.date === day && event.month === mon && event.year === yr; 
     // });
     return events[eventId] || [];
}


renderDays();





