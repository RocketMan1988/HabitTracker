import document from "document";
import * as messaging from "messaging";
import { readFileSync } from "fs";


// Import Inbox from the file-transfer module
import { inbox } from "file-transfer"



var habitsJSON;
var habits_log_JSON;
var i = 0;

var selectedHabit_id = 0;
var current_user_id = 1;


// Event occurs when new file(s) are received
inbox.onnewfile = function () {
  var fileName;
  do {
    // If there is a file, move it from staging into the application folder
    fileName = inbox.nextFile();
    if (fileName) {
      console.log("/private/data/" + fileName + " is now available");
    }
  } while (fileName);
};


//let background = document.getElementById("background");

// Message is received
messaging.peerSocket.onmessage = evt => {
//  console.log(`App received: ${JSON.stringify(evt)}`);
//  if (evt.data.key === "color" && evt.data.newValue) {
//    let color = JSON.parse(evt.data.newValue);
//    console.log(`Setting background color: ${color}`);
//    background.style.fill = color;
//  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};


function ShowMainMenu() {
  container.style.display = "inline";
  container.style.visibility = "visible";
}
function HideMainMenu() {
  container.style.display = "none";
  container.style.visibility = "hidden";
}

function ShowHabitsMenu() {
  //Update Count from JSON:
  let text = readFileSync("/private/data/habits.json", "json");
  console.log(text);
  habitsJSON = text;
  VTList.length = habitsJSON.length;
  
  
  
  VTList.style.display = "inline";
  VTList.style.visibility = "visible";
}
function HideHabitsMenu() {
  VTList.style.display = "none";
  VTList.style.visibility = "hidden";
}

function ShowHistoryMenu() {
  container_history.style.display = "inline";
  container_history.style.visibility = "visible";
}
function HideHistoryMenu() {
  container_history.style.display = "none";
  container_history.style.visibility = "hidden";
}

function ShowTumbleFiveMenu() {
  tumbler.style.display = "inline";
  tumbler.style.visibility = "visible";
}
function HideTumbleFiveMenu() {
  tumbler.style.display = "none";
  tumbler.style.visibility = "hidden";
}


//
function GetHabitsName(indexNumber) {
  return habitsJSON[indexNumber]["name"]
}
function GetHabitsDecription(indexNumber) {
  return habitsJSON[indexNumber]["description"]
}
function GetHabitsid(indexNumber) {
  return habitsJSON[indexNumber]["id"]
}
function GetHabitsValue(habit_id) {
  
  let text = readFileSync("/private/data/habits_log.json", "json");
  habits_log_JSON = text;
  
  if (habit_id == habits_log_JSON[i]["habit_id"]) 
    { 
        i = i + 1;
        return habits_log_JSON[i-1]["value"];  
    }
  else
    {
      return 0;
    }
  
}


//Main Menu
let container = document.getElementById("container");

// Get the selected index
let currentIndex = container.value;

// Set the selected index
container.value = 0; // jump to first slide
ShowMainMenu();

let btnBR = container.getElementById("btn-br");

btnBR.onactivate = function(evt) {
  console.log("Bottom RIGHT!");
  
  if (VTList.style.visibility == "hidden")
    {
        HideMainMenu();
        ShowHabitsMenu();
    }
  else
    {

    }

}

let btnBL = container.getElementById("btn-bl");
btnBL.onactivate = function(evt) {
  console.log("Bottom Left!");
  HideMainMenu();
  ShowHistoryMenu();
}


//History Menu
let container_history = document.getElementById("container_history");

// Get the selected index
let currentIndex_History = container_history.value;

// Set the selected index
container_history.value = 0; // jump to first slide
HideHistoryMenu();



//Habits Menu
let VTList = document.getElementById("my-list");

VTList.delegate = {
  getTileInfo: function(index) {
    return {
      type: "my-pool",
      value: "Habit",
      habit_id: 0,
      index: index
    };
  },
  configureTile: function(tile, info) {
    if (info.type == "my-pool") {
      //tile.getElementById("text").text = `${info.value} ${info.index}`;
      info.habit_id = GetHabitsid(info.index);
      tile.getElementById("text").text = GetHabitsName(info.index);
      tile.getElementById("textTwo").text = GetHabitsDecription(info.index);
      var tempVar = GetHabitsValue(GetHabitsid(info.index));
      if (tempVar == 5)
        {
          tile.getElementById("image").href = "5.png";
        }
      else if (tempVar == 4)
        {
          tile.getElementById("image").href = "4.png";
        }
      else if (tempVar == 3)
        {
          tile.getElementById("image").href = "3.png";
        }
      else if (tempVar == 2)
        {
          tile.getElementById("image").href = "2.png";
        }
      else if (tempVar == 1)
        {
          tile.getElementById("image").href = "1.png";
        }
      else
        {
          tile.getElementById("image").href = "x.png";
        }
      
      let touch = tile.getElementById("touch-me");
      touch.onclick = evt => {
        console.log(`touched: ${info.index}`);
        selectedHabit_id = info.habit_id;
        ShowTumbleFiveMenu();
        HideHabitsMenu();
      }
    }
  }
};

// VTList.length must be set AFTER VTList.delegate
VTList.length = 10;

HideHabitsMenu();





let tumbler = document.getElementById("tumbler");

let selectedIndex = tumbler.value;
let selectedItem = tumbler.getElementById("item" + selectedIndex);
let selectedValue = selectedItem.getElementById("content").text;

//console.log(`index: ${selectedIndex} :: value: ${selectedValue}`);

//selectedItem.getElementById("content").text = "New Value";

let click = document.getElementById("click");

function clicker(e) {
  //console.log(`Selected: Item ${tumbler.value} = ${getTumblerText(tumbler)}`);
  //Log New Number for habit - Fetch
  //http://www.rocketman-endeavours.com/HabitTracker/log_habit.php?habit_id=3&user_id=1&type=1&value=3
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    console.log("Watch:Post:" + "http://www.rocketman-endeavours.com/HabitTracker/log_habit.php?habit_id=" + selectedHabit_id + "&user_id=" + current_user_id + "&type=1" + "&value=" + getTumblerText(tumbler));
    messaging.peerSocket.send("Post:" + "http://www.rocketman-endeavours.com/HabitTracker/log_habit.php?habit_id=" + selectedHabit_id + "&user_id=" + current_user_id + "&type=1" + "&value=" + getTumblerText(tumbler));
  }
  
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    console.log("Watch:FetchHabitsData:");
    messaging.peerSocket.send("FetchHabitsData:")
  }
  
  i = 0;
  
  HideTumbleFiveMenu();
  ShowMainMenu();
  
}

click.onclick = clicker;

// this event listener is not yet implemented by Fitbit
tumbler.addEventListener("select", function(evt) {
 //console.log("Selected");
})

function getTumblerText(myObject) {
 return myObject.getElementById("item" + myObject.value).getElementById("content").text;
}


HideTumbleFiveMenu();
