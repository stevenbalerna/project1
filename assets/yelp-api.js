//https://www.yelp.com/developers/documentation/v3/business_search
//http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
//https://wp-oauth.com/docs/how-to/using-a-bearer-token-with-wp-rest-api/
var name = ''
var rating = ''
var price = ''
var image = ''
$('#submitLocationBtn').on('click', function () {
    var location = $('#cityInput').val().trim() + ', ' + $('#stateInput').children('option:selected').val()

    var apiKey = 'gYpd0tg2LukWlDSHSOD5LgGSwODx7DSxL4tNAKDW0Hmo3isXWutgLbtpboiWy76e79vrCD02K9yc1Gfm5VMOc2XmDoyloCiaWVRg2PGbksm9ByMzEjTrbPS5CQv3XHYx'
    $.ajax({
        type: 'GET',
        url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        data: {
            term: 'restaurants',
            location: location,
            sort_by: 'rating',
            limit: '5'
        }
    }).then(function (response) {
        for (i=0; i<response.businesses.length; i++){
            name = response.businesses[i].name
            rating = response.businesses[i].rating
            price = response.businesses[i].price
            image = response.businesses[i].image_url
            var businessResponse = ('<h3>Name:</h3>') + ('<p>') + name + ('</p><h3>Rating:</h3><p>') + rating + ('</p><h3>Price:</h3><p>') + price + ('</p><img class ="images" src="' + image + '">')
            $('#yelpInfo').append(businessResponse)
            $('.images').css('height', '200px')
        }
    })

    $.ajax({
        type: 'GET',
        url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        data: {
            term: 'bars',
            location: location,
            sort_by: 'rating',
            limit: '5'
        }
    }).then(function (response) {
        for (i=0; i<response.businesses.length; i++){
            name = response.businesses[i].name
            rating = response.businesses[i].rating
            price = response.businesses[i].price
            image = response.businesses[i].image_url
            var businessResponse = ('<h3>Name:</h3>') + ('<p>') + name + ('</p><h3>Rating:</h3><p>') + rating + ('</p><h3>Price:</h3><p>') + price + ('</p><img class ="images" src="' + image + '">')
            $('#yelpInfo').append(businessResponse)
            $('.images').css('height', '200px')
        }
    })
});