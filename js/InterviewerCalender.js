// var firebaseConfig = {
//   apiKey: "AIzaSyBWxdWYRYaTOIgjHU2H4OPakSrfhZ7Z1qA",
//   authDomain: "interviewapp-74631.firebaseapp.com",
//   databaseURL: "https://interviewapp-74631.firebaseio.com",
//   projectId: "interviewapp-74631",
//   storageBucket: "interviewapp-74631.appspot.com",
//   messagingSenderId: "268988093733",
//   appId: "1:268988093733:web:c69782a9408a3abd1a36cc",
//   measurementId: "G-8EEM95QSX4"
// };
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();
// const auth  = firebase.auth();
// const db = firebase.firestore();
today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
let currentDay = today.getDate();
let currentTime  = today.getHours();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
monthToNumber = {
    "Jan" : 01, 
    "Feb" : 02, 
    "Mar" : 03, 
    "Apr" : 04, 
    "May" : 05, 
    "Jun" : 06, 
    "Jul" : 07, 
    "Aug" : 08, 
    "Sep" : 09, 
    "Oct" : 10, 
    "Nov" : 11, 
    "Dec" : 12
};

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();

    tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }

            else {
                cell = document.createElement("td");
                cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                } // color today's date
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }
}  
{
    var date = -1;
    var year = -1;
    var month = -1;
    var bookButton = document.getElementById("book");
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = Math.floor(slider.value/4.1666666666);
    slider.oninput = function() {
    	var val = this.value;
       	val = val/4.16666666667;
        output.innerHTML = Math.floor(val);
        if(date>-1){
            let mon = monthToNumber[month.slice(0,3)];
                slot.innerHTML = "Selected Slot : " + date + "-"  + mon + "-" + year + " || " + output.innerHTML + ":00";
            }
            else{
                slot.innerHTML = " Selected Slot : N/A";
            }
    }
}
document.addEventListener('click', function(e) {
    e = e || window.event;
    // console.log(e);
    var target = e.target || e.srcElement;
    let type = target.nodeName;
    if(type=="TD"){

    date = target.textContent || target.innerText;   
    year = monthAndYear.innerText.slice(4,9);
    month = monthAndYear.innerText.slice(0,4);
        bookButton.disabled = false;
        let slot = document.getElementById("slot");

        let mon = monthToNumber[month.slice(0,3)];
        // if(mon<10) mon = "0" + mon;
        slot.innerHTML = "Selected Slot : " + date + "-"  + mon + "-" + year + " || " + output.innerHTML + ":00";
    }
}, false);

function getEmail(){
  return document.getElementById("email").innerHTML.slice(8,);
}


function bookFunc(){
  console.log("moniasdasd");
  let slot = document.getElementById("slot").innerHTML;

  let bookButton = document.getElementById("book");
  // console.log(slot ==  "Selected Slot : N/A");
  if(date==-1) alert("select a date");
  else{
    var output = document.getElementById("demo");
    
    let mon = monthToNumber[month.slice(0,3)];
    let selectedSlot = output.innerHTML;
    if(year<today.getFullYear()){
        alert("select Valid Year!");
        return;
    }
    if(year==today.getFullYear() && mon<=today.getMonth()){
        alert("Select Valid Month");
        return;
    }
    if(year==today.getFullYear() && mon==today.getMonth()+1 && date <= today.getDate()){
        alert("Select Valid Date");
        return;   
    }
    if(year==today.getFullYear() && mon==today.getMonth()+1 && date== today.getDate()+1 && selectedSlot < today.getHours()){
        alert("Select Valid Slot");
        return;      
    }
    console.log(selectedSlot);
    console.log(today.getHours());
    // if(mon<10) mon = "0" + mon;
    let id = date + "-"  + mon + "-" + year + "-" + selectedSlot;

    console.log(id);
    var docRef = db.collection("availableSlots").doc(id);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            docRef.update({
                "emails" : firebase.firestore.FieldValue.arrayUnion(getEmail()),
            })

        } else {
            docRef.set({
                "emails" : [getEmail()],
                "monthyear" : mon.toString() + year.toString()
            })
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  } 
}

let a = "";

function checkTime(){
    let b = a.split('-');
    let slotDay = Number(b[0]);
    let slotMonth = Number(b[1]);
    let slotYear = Number(b[2]);
    let slotTime = Number(b[3]);
    if(slotYear < currentYear) return true;
    if(slotYear == currentYear && slotMonth < currentMonth) return true;
    if(slotYear == currentYear && slotMonth == currentMonth && slotDay<currentDay) return true;
    if(slotYear == currentYear && slotMonth == currentMonth && slotDay == currentDay && slotTime < currentTime) return true;
    return false;
}

function extractTime(){
    let b = a.split('-');
    let ret = b[0] + '-' + b[1] + '-' + b[2] + "\t || \t";
    ret = ret + (Number(b[3]) * 100).toString() + " Hrs.";
    return ret;
}

function abc(){

    let xyz = document.getElementById("schedule");
    xyz.innerHTML = "";
    let currentEmail = getEmail();
    console.log(currentEmail);
    let docRef = db.collection("erSlots").doc(getEmail());
    docRef.get().then(function(doc) {
        if(doc.exists){
            let email = doc.data()["eeEmail"];
            let time = doc.data()["time"];
            console.log(email);
            let size = time.length;
            for(let i = 0;i<size;i=i+1){
                if(checkTime()){
                    continue;
                }
                let scheduleItem = document.createElement("div");
                scheduleItem.classList.add("schedule-item");

                let scheduleHeader = document.createElement("div");
                scheduleHeader.classList.add("shedule-header");

                let scheduleTitle = document.createElement("div");
                scheduleTitle.classList.add("schedule-title");
                scheduleTitle.innerHTML = "<span class=\"dot\"></span>";
                a = time[i];
                scheduleTitle.innerHTML =  scheduleTitle.innerHTML + extractTime();

                let scheduleContent = document.createElement("span");
                scheduleContent.classList.add("schedule-content");
                
                scheduleContent.innerHTML = email[i];

                scheduleHeader.appendChild(scheduleTitle);
                scheduleItem.appendChild(scheduleHeader);
                scheduleItem.appendChild(scheduleContent);
                xyz.appendChild(scheduleItem);
            }
            if(size==0){
                xyz.innerHTML = " No Upcoming Interviews To Take";
            }
        }
        else{
            let xyz = document.getElementById("schedule");
            xyz.innerHTML = " No Upcoming Interviews To Take";
        }
    })
}

let refresh = document.getElementById("refreshButton");
let scheduleButton = document.getElementById("scheduleButton");
console.log(scheduleButton);
refresh.addEventListener('click', function(e) {
    abc();
}, false);

scheduleButton.addEventListener('click', function(e) {
    abc();
}, false);




    
