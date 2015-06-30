


function getListApps(){
    $.get( "getListApps", function( data ) {
        var res = data.split(",");
        var i;
        for (i = 0 ; i < res.length ; i++){
            addTableElem(res[i]);
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


function addTableElem(data){
    //$('#dynamictable').append('<table></table>');
    var table = $('#tableElements');
    table.append("<tr id='"+ data + 'TR' + "'><td>" + data + "</td><td><input type='button' id='"+ data +"' name='nickname' value='undeploy' onclick='deleteApp(this);'></td></tr>");
}

$(function(){

  $("[type=file]").on("change", function(){
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
    $('label').text("Chosen : " + file.name.substr(0,30) + '..');
  }else {
    $('label').text("Chosen : " + file.name);
  }

  var ext = $('#file').val().split('.').pop().toLowerCase();
  if($.inArray(ext, ['php', 'html']) !== -1) {
    $('#info').hide();
    $('label').text('Choose File');
    $('#file').val('');
    alert('This file extension is not allowed!');
  }

  });

});

function reloadInitPage() {
    window.location.href = "/index.html";
}
