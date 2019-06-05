//https://www.yelp.com/developers/documentation/v3/business_search
//http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
//https://wp-oauth.com/docs/how-to/using-a-bearer-token-with-wp-rest-api/

var apiKey = 'gYpd0tg2LukWlDSHSOD5LgGSwODx7DSxL4tNAKDW0Hmo3isXWutgLbtpboiWy76e79vrCD02K9yc1Gfm5VMOc2XmDoyloCiaWVRg2PGbksm9ByMzEjTrbPS5CQv3XHYx'
$.ajax({
    url: 'https://api.yelp.com/v3/businesses/search',
    type: 'GET',
    beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'BEARER ' + apiKey);
    }
})