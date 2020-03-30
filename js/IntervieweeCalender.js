today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");


available = {};
dateToCell = {};
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let selectedDate = -1;
let selectedMonth = -1;
let selectedYear = -1;
let selectedSlot = -1;
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

    available = {};
    let calMonth = month+1;
    // if(calMonth < 10) calMonth = "0" + calMonth;
    let calYear = year;

    
    console.log(calMonth);
    console.log(calYear);
    // available[28]=4;
    // console.log(available);
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
    // available[2] = 3;

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
                // console.log(date + " : " + available[date]);
                dateToCell[date] = cell;
                date++;
            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
    }
    calMonth = calMonth.toString();
    calYear = calYear.toString();
    console.log(calMonth+calYear);
    db.collection("availableSlots").where("monthyear", "==", calMonth+calYear).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let val = doc.data();
            let id = doc.id;
            let extractedDateAndTime = id.split('-');
            console.log(extractedDateAndTime);
            let key = extractedDateAndTime[0];
            let value = extractedDateAndTime[3];
            if(key in available){
                let array = available[key];
                array.push(value);
                available[key] = array;
            }
            else{
                available[key] = [value];
            }
            dateToCell[key].classList.add("marked");
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    console.log("monil");
    console.log(available);
}
    
{
    var date = -1;
    var year = -1;
    var month = -1;
    var bookButton = document.getElementById("book");
}


document.addEventListener('click', function(e) {
    e = e || window.event;
    // console.log(e);
    var target = e.target || e.srcElement;
    let type = target.nodeName;
    if(type=="TD"){
        console.log(available);
        date = target.textContent || target.innerText;   
        year = monthAndYear.innerText.slice(4,9);
        month = monthAndYear.innerText.slice(0,4);
        bookButton.disabled = false;
        // let slot = document.getElementById("slot");
        let mon = monthToNumber[month.slice(0,3)];
        // if(mon<10) mon = "0" + mon;
        // slot.innerHT = "Selected Slot : " + date + "-"  + mon + "-" + year;
        let id = "Selected Date : " + date + "-"  + mon + "-" + year;
        let slots = document.getElementById("slot");
        slots.innerHTML = id;
        let availableSlots = document.getElementById("availableSlots")
        availableSlots.innerHTML = null;
        if(date in available){
            for(let x in available[date]){
                // Object.keys(available[date]).forEach(key => {
                    // console.log(x);
                    // console.log("x");
                    let currSlot = document.createElement("option");
                    currSlot.setAttribute("value",available[date][x]);
                    // currSlot.setAttribute("value",key);
                    // currSlot.innerHTML = x;
                    currSlot.innerHTML = available[date][x];
                    availableSlots.appendChild(currSlot);
                }
            
        }   
        else{
            availableSlots.innerHTML = null;
        }

    }

}, false);



function getEmail(){
  return document.getElementById("email").innerHTML.slice(8,);

}


function bookFunc(){
  // console.log("moniasdasd");
  let bookButton = document.getElementById("book");
  if(date==-1 || !(date in available)) alert("select an appropriate date");
  else{
    selectedDate = date;
    selectedYear = year;
    var selectedSlotElement = document.getElementById("availableSlots");
    selectedSlot = selectedSlotElement.options[selectedSlotElement.selectedIndex].value;
    let mon = monthToNumber[month.slice(0,3)];
    selectedMonth = mon;

    let id = selectedDate + "-"  + selectedMonth + "-" + selectedYear + "-" + selectedSlot;
    console.log(id);
    let assignedEr = "";
    let assignedEe = getEmail();
    let size = 10;
    let docAvailRef =  db.collection("availableSlots").doc(id);
    let assignedErs = [];
    docAvailRef.get().then(function(docAvail) {
        if(docAvail.exists){
            let docEeRef = db.collection("eeSlots").doc(assignedEe);
            docEeRef.get().then(function(docEe) {
                if(docEe.exists){
                    let data = docEe.data()["time"];
                    if(data.includes(id)){
                        console.log("yahin pe  tha");
                        alert("You already have an interview scheduled for the selected time!");
                        throw "not available";
                    }
                    else{
                        assignedEr = docAvail.data()["emails"][0];
                        let docAvailData = docAvail.data();
                        docAvailData["emails"].shift();
                        if(docAvailData["emails"].length==0){
                            console.log("haan");
                            docAvailRef.delete().then(function() {
                                console.log("Document successfully deleted!");
                            })
                        }
                        else{
                            console.log("bhai");
                            docAvailRef.set({
                                "emails" : docAvailData["emails"],
                                "monthyear" : docAvailData["monthyear"]
                            })
                        }
                        let docEeData = docEe.data();
                        docEeData["erEmail"].push(assignedEr);
                        docEeData["time"].push(id);
                        docEeRef.set({
                            "erEmail" : docEeData["erEmail"],
                            "time" : docEeData["time"]
                        })
                        let docErRef = db.collection("erSlots").doc(assignedEr);
                        docErRef.get().then(function(docEr) {
                            if(docEr.exists){
                                let docErData = docEr.data();
                                docErData["eeEmail"].push(assignedEe);
                                docErData["time"].push(id);
                                docErRef.set({
                                    "eeEmail" : docErData["eeEmail"],
                                    "time" : docErData["time"]
                                })
                            }
                            else{
                                docErRef.set({
                                    "eeEmail" : [assignedEe],
                                    "time" : [id]
                                })
                            }
                        })
                    }
                }    
                else{
                    docEeRef.set({
                        "erEmail" : [assignedEr],
                        "time" : [id]
                    })
                }  
            })
        }
        else{
            throw "not available";
        }
    }).then(function() {

        showCalendar(currentMonth,currentYear);
    })
    .catch(function(error) {
        alert("Error getting documents: ", error);
    });


    console.log(assignedEr);

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
    console.log(getEmail());
    let docRef = db.collection("eeSlots").doc(getEmail());
    docRef.get().then(function(doc) {
        if(doc.exists){
            let email = doc.data()["erEmail"];
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


