

/*-------------------------------------------------------------------------------
  PRE LOADER
-------------------------------------------------------------------------------*/

$(window).load(function () {
  $('.preloader').fadeOut(1000); // set duration in brackets    
});

/*-------------------------------------------------------------------------------
  LOL
-------------------------------------------------------------------------------*/

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);
}

loadMore = function () {
  var table = document.getElementById("matchsList");
  var row = table.insertRow(0);
  var cell = row.insertCell(0);
  cell.innerHTML = "Test2";
}