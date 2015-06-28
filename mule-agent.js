


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

    jQuery.ajax({
     type: "DELETE",
     url: "/app/" + app,
     success: function (data, status, jqXHR) {
         // do something
     },

     error: function (jqXHR, status) {
         // error handler
     }
    });
}


function addTableElem(data){
    //$('#dynamictable').append('<table></table>');
    var table = $('#tableElements');
    table.append("<tr id='"+ data + 'TR' + "'><td>" + data + "</td><td><input type='button' id='"+ data +"' name='nickname' value='undeploy'></td></tr>");
}

function cleanTable(){
    var row = data + "TR"
    $(row).remove()
}