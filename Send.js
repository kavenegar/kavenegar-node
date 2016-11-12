var Kavenegar = require('./lib/kavenegar');
var api = Kavenegar.KavenegarApi({
    apikey: ''
});
api.Send({message: "",sender: "",receptor: ""}, function(response,status) {
    console.log(response);
    console.log(status);
});