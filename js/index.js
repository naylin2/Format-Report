$(document).ready(function(){
  startTime();
  // Get Name
  var text = document.getElementById("text");
  var url = document.getElementById("url");
  var edit = document.getElementById("edit");
  var time = document.getElementById("time");
  edit.style.display = "none";
  time.style.display = "none";
  var welcome = document.getElementById("welcome");
  // Toggle Event
  $("#welcome").click(function(){
    if (edit.style.display === "none") {
      edit.style.display = "block";
      text.focus();
    } else {
      edit.style.display = "none";
    }
  });
  // Name save Event
  $("#save").click(function(){
    window.localStorage.setItem("myvalue", text.value);
    welcome.innerHTML = window.localStorage.getItem("myvalue");
    window.localStorage.setItem("url", url.value);
    if (edit.style.display === "none") {
      edit.style.display = "block";
    } else {
      edit.style.display = "none";
    }
  });
  text.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
     event.preventDefault();
     $("#save").click();
    }
  });
  url.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
     event.preventDefault();
     $("#save").click();
    }
  });
  text.value = window.localStorage.getItem("myvalue");
  url.value = window.localStorage.getItem("url");
  welcome.innerHTML = window.localStorage.getItem("myvalue");
  // Convert Event
  $("#convert-btn").click(function(){
    var originalTaskArray = $("#original").val().split("\n");
    var formattedTaskArray = [];
    var formattedTaskString = "";
    var tmpTime = 0;
    for (let original = 0; original < originalTaskArray.length; original++) {
      if (!originalTaskArray[original].includes('lunch')
        && !originalTaskArray[original].includes('Lunch')
        && !originalTaskArray[original].includes('LUNCH')) {
        var tmpArray = originalTaskArray[original].split("\t");
        if (formattedTaskArray.length) {
          for (let format = 0; format < formattedTaskArray.length; format++) {
            var taskString = formattedTaskArray[format][0].toLowerCase();
            var tmpTaskString = tmpArray[0].toLowerCase();
            if (taskString == tmpTaskString) {
              var tmpTime = parseFloat(formattedTaskArray[format][2]) + parseFloat(tmpArray[2]);
              formattedTaskArray.splice(format, 1);
              tmpArray[2] = tmpTime;
            }
          }
          formattedTaskArray.push(tmpArray);
        } else {
          formattedTaskArray.push(tmpArray);
        }
      }
    }
    for (let format = 0; format < formattedTaskArray.length; format++) {
      formattedTaskString += `⇒ ${formattedTaskArray[format][0]} - ${formattedTaskArray[format][1]} (${formattedTaskArray[format][2]}hr)\n`;
    }
    // For adding today's date
    var today = new Date();
    var yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    var today = mm + '/' + dd + '/' + yyyy;

    // For concating string at custom index
    function addStr(str, index, stringToAdd){
      return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
    };

    // Getting Name from Local Storage
    var name = window.localStorage.getItem("myvalue");

    // For start
    var start = `-------- Today(`+ today + `) Progress (`+ name + `) ---------\n\n■今日の作業実績\n`;

    // For next task
    var issue = formattedTaskString.match(/\d{4}/);
    var nextTask = "";
    if (issue !== null){
      nextTask =`\n⇒ Issue #`+ issue;
    }
    else{
      nextTask = "\n⇒ "
    }

    // For end
    var end = `\n■明日の作業予定`+ nextTask +` \n\n■問題点。改善点\n⇒ None`;

    // Final String
    $("#formatted").val(addStr(formattedTaskString, 0, start)+end);
  });

  // Copy Event
  $("#copy-btn").click(function(){
    var $temp = $("<textarea></textarea>");
    $("body").append($temp);
    $temp.val($("#formatted").val()).select();
    document.execCommand("copy");
    $temp.remove();

    document.body.style.background = '#FFCDD2';

    setTimeout(function() {
      document.body.style.background = 'inherit';
    }, 500);

  });
  document.body.addEventListener("keyup", function(event) {
    if (event.ctrlKey && event.key === 'c') {
      $("#copy-btn").click();
    }
  });
  document.body.addEventListener("keyup", function(event) {
    if (event.altKey && event.key === 'r') {
      urll = window.localStorage.getItem("url");
      window.open(urll,'_blank');
    }
  });
  document.body.addEventListener("keyup", function(event) {
    if (event.altKey && event.key === 't') {
      if (time.style.display === "none") {
        time.style.display = "block";
        text.focus();
      } else {
        time.style.display = "none";
      }
    }
  });

  function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var ms = today.getMilliseconds();
    // AM/PM clock
    if (h >= 12) {
        h = h - 12;
    }
    // to always show 3 digits miliseconds
    if     (ms<1){ms = "000";}
    else if(ms<10){ms = "00" + ms;}
    else if(ms<100){ms = "0" + m;}
    m = checkTime(m);
    s = checkTime(s);

    $('#time').html(m + " : " + s + " : " + ms);

    var t = setTimeout(function () {
        startTime()
        if (h == 4 && m > 50) {
          time.style.display = "block";
          if (ms > 900) {
            document.getElementById("time").style.background = '#61faa9';
            document.getElementById("time").style.borderBlockColor = '#61faa9';
          }
          else {
            document.getElementById("time").style.background = '#FFCDD2';
            document.getElementById("time").style.borderBlockColor = '#FFCDD2';
          }
        }
    }, 1);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }; // add zero in front of numbers < 10
    return i;
}

});
