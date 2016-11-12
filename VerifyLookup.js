var Kavenegar = require('./lib/kavenegar');
var api = Kavenegar.KavenegarApi({
    apikey: ''
});
api.VerifyLookup({receptor: "09361234567",token: "8792343",template: "registerverify"}, function(response,status) {
    console.log(response);
    console.log(status);
});

