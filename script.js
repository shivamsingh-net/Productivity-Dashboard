function opencards() {
  let allelem = document.querySelectorAll(".elem");
  let fullelem = document.querySelectorAll(".fullelem");
  let fullelembackbtn = document.querySelectorAll(".fullelem .back");
  let cardSection = document.querySelector(".allelem");

  allelem.forEach(function (elem) {
    elem.addEventListener("click", function () {
      cardSection.style.display = "none";
      fullelem[elem.id].style.display = "block";
    });
  });

  fullelembackbtn.forEach(function (back) {
    back.addEventListener("click", function () {
      fullelem[back.id].style.display = "none";
      cardSection.style.display = "flex";
    });
  });
}
opencards();

function todolist() {
  let currenttask = [];

  if (localStorage.getItem("currenttask")) {
    currenttask = JSON.parse(localStorage.getItem("currenttask"));
  }

  function rendertask() {
    let alltask = document.querySelector(".alltask");
    let sum = "";
    currenttask.forEach(function (elem, idx) {
      sum += `<div class="task">

        <div class="task-header">
            <h3>
              <span class="arrow">▶</span>
              ${elem.task}
              ${elem.imp ? "<span class='important'>🔥 Important</span>" : ""}
            </h3>
      
           <button id="${idx}">
                🗑 Delete
           </button>
        </div>
      
        <div class="task-details">
            ${elem.details || "No details added"}
        </div>
      
      </div>`;
          });
    alltask.innerHTML = sum;

    localStorage.setItem("currenttask", JSON.stringify(currenttask));

    document.querySelectorAll(".task button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currenttask = currenttask.filter((_, i) => i !== Number(btn.id));
        rendertask();
      });
    });
    document.querySelectorAll(".task-header").forEach(function(header){

    header.addEventListener("click",function(e){

        if(e.target.tagName === "BUTTON")
            return;

        header.parentElement
              .classList.toggle("active");
    });

});
  }
  rendertask();

  let form = document.querySelector(".addtask form");
  let taskinp = document.querySelector("#task-inp");          
  let textarea = document.querySelector(".addtask form textarea");
  let check = document.querySelector(".addtask form #check");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    
    if (taskinp.value.trim() === "") {
      taskinp.style.border = "2px solid red";
      taskinp.placeholder = "Task cannot be empty!";
      setTimeout(() => {
        taskinp.style.border = "none";
        taskinp.placeholder = "Add Task";
      }, 2000);
      return;
    }

    currenttask.push({
      task: taskinp.value.trim(),
      details: textarea.value,
      imp: check.checked,
    });
    rendertask();

    taskinp.value = "";
    textarea.value = "";
    check.checked = false;
  });
}
todolist();

function Dailyplanner() {
  let dayplannerdata = JSON.parse(localStorage.getItem("dayplannerdata")) || {};
  let dayplanner = document.querySelector(".dayplanner");
  let hour = Array.from({ length: 18 }, (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`);

  let wholeDaySum = "";
  hour.forEach(function (elem, idx) {
    var savedData = dayplannerdata[idx] || "";
    wholeDaySum +=
      `<div class="dayplannertime">
        <p>${elem}</p>
        <input id="${idx}" type="text" placeholder="...." value="${savedData}">
      </div>`;
  });

  dayplanner.innerHTML = wholeDaySum;

  var dpinput = document.querySelectorAll(".dayplanner input");
  dpinput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayplannerdata[elem.id] = elem.value;
      localStorage.setItem("dayplannerdata", JSON.stringify(dayplannerdata));
    });
  });

   var dpinput = document.querySelectorAll(".dayplanner input");
   

   let clearBtn = document.querySelector(".clear-planner");

   clearBtn.addEventListener("click", function(){

  let confirmClear = confirm(
    "Are you sure you want to clear the entire planner?"
  );

  if(!confirmClear) return;

  localStorage.removeItem("dayplannerdata");

  dpinput.forEach(function(input){
    input.value = "";
  });

   });



}
Dailyplanner();

function motivationalQuotes() {
  var motivationQuote = document.querySelector(".mv h2");
  var nextBtn = document.querySelector(".next-quote-btn");

  async function fetchQuote() {
    motivationQuote.style.opacity = "0";
    motivationQuote.style.transform = "translateY(10px)";

    try {
      let response = await fetch("https://motivational-spark-api.vercel.app/api/quotes/random");
      if (!response.ok) throw new Error("API error");
      let data = await response.json();
      motivationQuote.innerHTML = data.quote;
    } catch (err) {
      motivationQuote.innerHTML = "Stay focused. Every day is a new beginning.";
    }

    setTimeout(() => {
      motivationQuote.style.opacity = "1";
      motivationQuote.style.transform = "translateY(0)";
    }, 50);
  }

  nextBtn.addEventListener("click", function () {
    nextBtn.style.scale = "0.9";
    setTimeout(() => { nextBtn.style.scale = "1"; }, 150);
    fetchQuote();
  });

  fetchQuote();
}
motivationalQuotes();

function pomodoroTimer() {
  let timerInterval = null;
  let totalseconds = 25 * 60;

  let timer = document.querySelector(".pomo-timer h2");
  let startbtn = document.querySelector(".pomo-timer .start");
  let pausebtn = document.querySelector(".pomo-timer .Pause");
  let resetbtn = document.querySelector(".pomo-timer .reset");
  let isWorkSession = true;
  let session = document.querySelector(".timerfullpage .session");

  function updatetime() {
    let minutes = Math.floor(totalseconds / 60);
    let seconds = totalseconds % 60;
    timer.innerHTML = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function startTimer() {
    clearInterval(timerInterval);

    if (isWorkSession) {
      timerInterval = setInterval(function () {
        if (totalseconds > 0) {
          totalseconds--;
          updatetime();
        } else {
          isWorkSession = false;
          clearInterval(timerInterval);
          timer.innerHTML = "05:00";
          sessionText.textContent = "Take a Break";
          sessionIcon.textContent = "☕";
          
          session.style.backgroundColor = "var(--blue)";
          totalseconds = 5 * 60;
        }
      }, 1000);
    } else {
      timerInterval = setInterval(function () {
        if (totalseconds > 0) {
          totalseconds--;
          updatetime();
        } else {
          isWorkSession = true;
          clearInterval(timerInterval);
          timer.innerHTML = "25:00";
          sessionText.textContent = "Work Session";
          sessionIcon.textContent = "🍅";
      
          session.style.backgroundColor = "var(--green)";
          totalseconds = 25 * 60;
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }
 let sessionText = document.querySelector(".session-text");
 let sessionIcon = document.querySelector(".session-icon");
 sessionText.textContent = "Break Time";
 sessionIcon.textContent = "☕";
 sessionText.textContent = "Work Session";
 sessionIcon.textContent = "🍅";



 function resetTimer() {
  clearInterval(timerInterval);

  isWorkSession = true;
  totalseconds = 25 * 60;

  sessionText.textContent = "Work Session";
  sessionIcon.textContent = "🍅";

  session.style.backgroundColor = "var(--green)";

  updatetime();
}
  startbtn.addEventListener("click", startTimer);
  pausebtn.addEventListener("click", pauseTimer);
  resetbtn.addEventListener("click", resetTimer);
}
pomodoroTimer();

function WeatherFunctionality() {
  var header1Time = document.querySelector(".header1 h1");
  var header1date = document.querySelector(".header1 h2");
  var header2Temp = document.querySelector(".header2 h1");
  var header2Condition = document.querySelector(".header2 h4");
  var heatindex = document.querySelector(".header2 .heatindex");
  var humidity = document.querySelector(".header2 .Humidity");
  var Wind = document.querySelector(".header2 .Wind");


  header2Temp.innerHTML = "Loading...";
  header2Condition.innerHTML = "Fetching weather...";
  heatindex.innerHTML = "Heatindex: --";
  humidity.innerHTML = "Humidity: --";
  Wind.innerHTML = "Wind: --";

  async function WeatherApiCall() {
    try {
      const apikey = "8c7fe6f8a6c1451c9b0142946261905";
      const city = "katihar";
      var response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`
      );
      if (!response.ok) throw new Error("Weather fetch failed");
      var data = await response.json();

      header2Temp.innerHTML = `${data.current.temp_c}°C`;
      header2Condition.innerHTML = `${data.current.condition.text}`;
      heatindex.innerHTML = `Heatindex: ${data.current.heatindex_c}°C`;
      humidity.innerHTML = `Humidity: ${data.current.humidity}%`;
      Wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`;
    } catch (err) {
      header2Temp.innerHTML = "--°C";
      header2Condition.innerHTML = "Unavailable";
      heatindex.innerHTML = "Heatindex: --";
      humidity.innerHTML = "Humidity: --";
      Wind.innerHTML = "Wind: --";
    }
  }
  WeatherApiCall();

  function timeDate() {
    const totalDaysofWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    var date = new Date();
    var dayofWeek = totalDaysofWeek[date.getDay()];
    var hours = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    var tarik = date.getDate();
    var month = monthNames[date.getMonth()];
    var year = date.getFullYear();

    header1date.innerHTML = `${tarik} ${month} ${year}`;

    if (hours >= 12) {
      let displayHour = hours === 12 ? 12 : hours - 12;
      header1Time.innerHTML = `${dayofWeek}, ${String(displayHour).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")} PM`;
    } else {
      let displayHour = hours === 0 ? 12 : hours;
      header1Time.innerHTML = `${dayofWeek}, ${String(displayHour).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")} AM`;
    }
  }
   timeDate();
  setInterval(() => {
    timeDate();
  }, 1000);



function updateHeaderBackground() {
  const header = document.querySelector(".allelem header");

  
  const hour = new Date().getHours();

  //Night: 7 PM to 2:59 AM
  if (hour >= 19 || hour < 3) {
    header.style.backgroundImage = "url('./images/night-city.jpg')";
    header.style.backgroundPosition = "0% 70%";
  } 
  // Day: 3 AM to 6:59 PM
  else {
    header.style.backgroundImage ="url('./images/day-city.jpg')";
    header.style.backgroundPosition = "0% 52%";
  }
}
updateHeaderBackground();


setInterval(updateHeaderBackground, 60000);




}
WeatherFunctionality();


