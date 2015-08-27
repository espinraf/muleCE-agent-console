


function getListApps(){
    $.get( "getListApps", function( data ) {
        var res = data.split(",");
        var i;
        if (res[0] != ""){
            for (i = 0 ; i < res.length ; i++){
                addTableElem(res[i]);
            }
        }
    });

}

function getListDomains(){
    $.get( "getListDomains", function( data ) {
        var res = data.split(",");
        var i;
        if (res[0] != ""){
            for (i = 0 ; i < res.length ; i++){
                addTable2Elem(res[i]);
            }
        }
    });

}

function deleteApp (app) {
    fN = app.id;
    jQuery.ajax({
     type: "DELETE",
     url: "/app/" + fN,
     success: function (data, status, jqXHR) {
         location.reload();
     },

     error: function (jqXHR, status) {
         // error handler
     }
    });
}

function deleteDomain (dom) {
    fN = dom.id;
    jQuery.ajax({
     type: "DELETE",
     url: "/domain/" + fN,
     success: function (data, status, jqXHR) {
         location.reload();
     },

     error: function (jqXHR, status) {
         // error handler
     }
    });
}


function addTableElem(data){
    //$('#dynamictable').append('<table></table>');
    var table = $('#tableElements');
    table.append("<tr id='"+ data + 'TR' + "'><td>" + data + "</td><td><input type='button' id='"+ data +"' name='nickname' value='undeploy' onclick='deleteApp(this);'></td></tr>");
}

function addTable2Elem(data){
    //$('#dynamictable').append('<table></table>');
    var table = $('#tableElements2');
    table.append("<tr id='"+ data + 'TR' + "'><td>" + data + "</td><td><input type='button' id='"+ data +"' name='nickname' value='undeploy' onclick='deleteDomain(this);'></td></tr>");
}

$(function(){

  $('#file').on("change", function(){
  var file = this.files[0];
  var formdata = new FormData();
  formdata.append("file", file);
    $('#info').slideDown();
    if(file.name.length >= 30){
      $('#name span').empty().append(file.name.substr(0,30) + '..');
    }else {
      $('#name span').empty().append(file.name);
    }
    if(file.size >= 1073741824){
			$('#size span').empty().append(Math.round(file.size/1073741824) + "GB");
		}else if(file.size >= 1048576){
			$('#size span').empty().append(Math.round(file.size/1048576) + "MB");
		}else if(file.size >= 1024){
			$('#size span').empty().append(Math.round(file.size/1024) + "KB");
		}else {
			$('#size span').empty().append(Math.round(file.size) + "B");
		}
    $('#type span').empty().append (file.type);
  if(file.name.length >= 30){
    $('#labelMule').text("Chosen : " + file.name.substr(0,30) + '..');
  }else {
    $('#labelMule').text("Chosen : " + file.name);
  }

  var ext = $('#file').val().split('.').pop().toLowerCase();
  if($.inArray(ext, ['php', 'html']) !== -1) {
    $('#info').hide();
    $('#labelMule').text('Choose File');
    $('#file').val('');
    alert('This file extension is not allowed!');
  }

  });

});

$(function(){

  $('#file2').on("change", function(){
  var file = this.files[0];
  var formdata = new FormData();
  formdata.append("file", file);
    $('#info2').slideDown();
    if(file.name.length >= 30){
      $('#name2 span').empty().append(file.name.substr(0,30) + '..');
    }else {
      $('#name2 span').empty().append(file.name);
    }
    if(file.size >= 1073741824){
			$('#size2 span').empty().append(Math.round(file.size/1073741824) + "GB");
		}else if(file.size >= 1048576){
			$('#size2 span').empty().append(Math.round(file.size/1048576) + "MB");
		}else if(file.size >= 1024){
			$('#size2 span').empty().append(Math.round(file.size/1024) + "KB");
		}else {
			$('#size2 span').empty().append(Math.round(file.size) + "B");
		}
    $('#type2 span').empty().append (file.type);
  if(file.name.length >= 30){
    $('#labelDom').text("Chosen : " + file.name.substr(0,30) + '..');
  }else {
    $('#labelDom').text("Chosen : " + file.name);
  }

  var ext = $('#file2').val().split('.').pop().toLowerCase();
  if($.inArray(ext, ['php', 'html']) !== -1) {
    $('#info2').hide();
    $('#labelDom').text('Choose File');
    $('#file2').val('');
    alert('This file extension is not allowed!');
  }

  });

});


function reloadInitPage() {
    window.location.href = "/index.html";
}


// Websocket
var socket = null;

var addressBox = null;
var logBox = null;
var messageBox = null;

function addToLog(log) {
  logBox.value += log + '\n'
  // Large enough to keep showing the latest message.
  logBox.scrollTop = 1000000;
}

function send() {
  if (!socket) {
    addToLog('Not connected');
    return;
  }

  socket.send(messageBox.value);
  addToLog('> ' + messageBox.value);
  //messageBox.value = '';

  /*data = messageBox.value.map(function (num) {
    return String.fromCharCode(num);
  }).join('');
  addToLog('> ' + data);*/
  //var data = messageBox.value.charCodeAt(38);
  //addToLog('> ' + data);
}

function connect() {
  if ('WebSocket' in window) {
    socket = new WebSocket(addressBox);
  } else if ('MozWebSocket' in window) {
    socket = new MozWebSocket(addressBox);
  } else {
    return;
  }
  socket.binaryType = "arraybuffer";
  socket.onopen = function () {
    addToLog('Opened');
  };
  socket.onmessage = function (event) {
    addToLog('< ' + event.data);
  };
  socket.onerror = function () {
    addToLog('Error');
  };
  socket.onclose = function (event) {
    var logMessage = 'Closed (';
    if ((arguments.length == 1) && ('CloseEvent' in window) &&
        (event instanceof CloseEvent)) {
      logMessage += 'wasClean = ' + event.wasClean;
      // code and reason are present only for
      // draft-ietf-hybi-thewebsocketprotocol-06 and later
      if ('code' in event) {
        logMessage += ', code = ' + event.code;
      }
      if ('reason' in event) {
        logMessage += ', reason = ' + event.reason;
      }
    } else {
      logMessage += 'CloseEvent is not available';
    }
    addToLog(logMessage + ')');
  };

  addToLog('Connect ' + addressBox);
}

function closeSocket() {
  if (!socket) {
    addToLog('Not connected');
    return;
  }

  socket.close();

}

function wsinit() {
  var scheme = window.location.protocol == 'https:' ? 'wss://' : 'ws://';
  var defaultAddress = scheme + window.location.hostname + ':9090/';

  addressBox = defaultAddress;
  logBox = document.getElementById('log');
  messageBox = "";

  if ('MozWebSocket' in window) {
    addToLog('Use MozWebSocket');
  } else if (!('WebSocket' in window)) {
    addToLog('WebSocket is not available');
  }
}
