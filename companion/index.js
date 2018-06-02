import * as messaging from "messaging";
import { settingsStorage } from "settings";

// Import Outbox from the file-transfer module
import { outbox } from "file-transfer"




function fetch_habits_data() {
    // Source image on the internet
    let srcJSON = "http://www.rocketman-endeavours.com/HabitTracker/get_habits.php?user_id=1";

    // Destination filename
    let destFilename = "habits.json";

    // Fetch the habit JSON from the internet
    fetch(srcJSON).then(function (response) {
      // We need an arrayBuffer of the file contents
      return response.arrayBuffer();
    }).then(function (data) {
      // Queue the file for transfer
      outbox.enqueue(destFilename, data).then(function (ft) {
        // Queued successfully
        console.log("Transfer of '" + destFilename + "' successfully queued.");

      }).catch(function (error) {
        // Failed to queue
        throw new Error("Failed to queue '" + destFilename + "'. Error: " + error);
      });
    }).catch(function (error) {
      // Log the error
      console.log("Failure: " + error);
    });



    // Source image on the internet
    let srcJSON2 = "http://www.rocketman-endeavours.com/HabitTracker/get_todays_habits.php?user_id=1";

    // Destination filename
    let destFilename2 = "habits_log.json";

    // Fetch the habit JSON from the internet
    fetch(srcJSON2).then(function (response) {
      // We need an arrayBuffer of the file contents
      return response.arrayBuffer();
    }).then(function (data) {
      // Queue the file for transfer
      outbox.enqueue(destFilename2, data).then(function (ft) {
        // Queued successfully
        console.log("Transfer of '" + destFilename2 + "' successfully queued.");

      }).catch(function (error) {
        // Failed to queue
        throw new Error("Failed to queue '" + destFilename2 + "'. Error: " + error);
      });
    }).catch(function (error) {
      // Log the error
      console.log("Failure: " + error);
    });

}


//Fetch Habits Data
fetch_habits_data();

var HabitsBuffer = "";

//Get List of Habits
function getHabits() {
 
   var url = "http://www.rocketman-endeavours.com/HabitTracker/get_habits.php?user_id=1";
    
  
  
   fetch(url).then(function(response) {
      console.log("Got response from server:", response);
      return response.json();
    }).then(function(json) {
      
      console.log("Got JSON response from server:" + JSON.stringify(json));
      //Load into JSON
      HabitsBuffer = json;
     
      console.log(HabitsBuffer[0]["name"]);
     //var data = json["root"]["station"][0];
	  });
  
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings();
  
  //getHabits();
  
};

messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log("Data Received...");
  console.log(evt.data);
  
  if (evt.data.includes("Post:")) {
      var postURL = evt.data.replace("Post:", "");
       console.log("Attempting to post to: " + postURL);
       
       fetch(postURL).then(function(response) {
          console.log("Got response from server:", response);
          return response;
        }).then(function(response) {

          console.log("Got JSON response from server:" + response);
          //Write code later to let the watch know that it was successful! 
          
          fetch_habits_data();
         
        });
  }
  
    if (evt.data.includes("FetchHabitsData:")) {
      //fetch_habits_data()
    }
  
}

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

// A user changes settings
settingsStorage.onchange = evt => {
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  sendVal(data);
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {
        key: key,
        newValue: settingsStorage.getItem(key)
      };
      sendVal(data);
    }
  }
}

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}


