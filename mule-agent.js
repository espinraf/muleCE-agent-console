


function getListApps(){
    $.get( "getListApps", function( data ) {
        var res = data.split(",");
        var i;
        for (i = 0 ; i < res.length ; i++){
            addTableElem(res[i]);
        }
    });

}

function getListDomains(){
    $.get( "getListDomains", function( data ) {
        var res = data.split(",");
        var i;
        for (i = 0 ; i < res.length ; i++){
            addTable2Elem(res[i]);
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
