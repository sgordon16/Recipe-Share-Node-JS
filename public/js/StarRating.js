$(document).ready(function(){
    var ratings = $('.rating');

    for (var i = 0; i < ratings.length; i++) {
        var r = new SimpleStarRating(ratings[i]);

        $(ratings[i]).on('rate', function(e) {
            var rating = e.detail;
            $.ajax({
                type: 'POST',
                url: '/rate',
                data: { rating: rating},
                success: function(response) {
                    alert(response);
                }
            });
        });
    }
});