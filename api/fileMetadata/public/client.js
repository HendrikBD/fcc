// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {

  $("#inputFile").on("change", function(){
    $("#filesize")[0].value = String(this.files[0].size) + " Bytes";
    // alert(this.files[0].size);
  })

})
