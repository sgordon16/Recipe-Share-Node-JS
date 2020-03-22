$(document).ready(function() {
 // executes when HTML-Document is loaded and DOM is ready
 //console.log("document is ready");
  

  $( ".card" ).hover(function() {
      $(this).addClass('shadow-lg').css('cursor', 'pointer'); 
    }, function() {
      $(this).removeClass('shadow-lg');
  });
  
  $('#add-ingredient').click( function() {
      var ingredient = $('#ingredient').val();
      if(!(ingredient === "")) {
          //$('#ingredient-list').append('<li><span class="input-group-append"><input class="form-control" style="background-color:transparent;" type="text" name="ingredients" value="' + ingredient + '" style="border-style: none;"><i class="fas fa-minus-circle fa-lg delete" style="color: red;"></i></span></li>');
          $('#ingredient-list').append('<li><span class="input-group-append"><input class="form-control-plaintext"  type="text" name="ingredients" value="' + ingredient + '" readonly><i class="fas fa-minus-circle fa-lg delete" style="color: red;"></i></span></li>');
          $('#ingredient').val(''); 
      }      		
  });
  // Attach a delegated event handler
  $( "#ingredient-list" ).on( "click", ".delete", function( event ) {
      event.preventDefault();
      $(this).parentsUntil('ul').remove();
  });

  // $('.save').click(function(){
  //   if(Cookies.get('name') != null){
  //     $.ajax({
  //       type: 'POST',
  //       url: '/save',
  //       success: function(response) {
  //           alert(response);
  //       }
  //     });
  //     alert("Recipe Saved\nIngredients added to your shopping list")
  //   }

  // });
});

function deferVideo() {

    //defer html5 video loading
  $("video source").each(function() {
    var sourceFile = $(this).attr("data-src");
    $(this).attr("src", sourceFile);
    var video = this.parentElement;
    video.load();
    // uncomment if video is not autoplay
    video.play();
  });

}
window.onload = deferVideo;
  