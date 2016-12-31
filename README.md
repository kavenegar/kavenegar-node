# kavenegar-node


# <a href="http://kavenegar.com/rest.html">Kavenegar RESTful API Document</a>
If you need to future information about API document Please visit RESTful Document

## Installation
<p>
First of all, You need to make an account on Kavenegar from <a href="https://panel.kavenegar.com/Client/Membership/Register">Here</a>
</p>
<p>
After that you just need to pick API-KEY up from <a href="http://panel.kavenegar.com/Client/setting/index">My Account</a> section.
You can download the Node SDK <a href="https://github.com/KaveNegar/kavenegar-node.git">Here</a> or just pull it.
Anyway there is good tutorial about <a href="http://gun.io/blog/how-to-github-fork-branch-and-pull-request/">Pull  request</a>
</p>
## Usage

Well, There is two  example to Send SMS by node below.

```node
var Kavenegar = require('./lib/kavenegar');
var api = Kavenegar.KavenegarApi({
    apikey: ''
});
api.Send({
        message: "خدمات پیام کوتاه کاوه نگار",
        sender: "10004346",
        receptor: "09123456789,09367891011"
    },
    function(response, status) {
        console.log(response);
        console.log(status);
    });
/*
sample output
{
    "return":
    {
        "status":200,
        "message":"تایید شد"
    },
    "entries": 
    [
        {
            "messageid":8792343,
            "message":"خدمات پیام کوتاه کاوه نگار",
            "status":1,
            "statustext":"در صف ارسال",
            "sender":"10004346",
            "receptor":"09123456789",
            "date":1356619709,
            "cost":120
        },
        {
            "messageid":8792344,
            "message":"خدمات پیام کوتاه کاوه نگار",
            "status":1,
            "statustext":"در صف ارسال",
            "sender":"10004346",
            "receptor":"09367891011",
            "date":1356619709,
            "cost":120
        }
    ]
}
*/
```
```node
var Kavenegar = require('./lib/kavenegar');
var api = Kavenegar.KavenegarApi({
    apikey: ''
});
api.VerifyLookup({
    receptor: "09361234567",
    token: "852596",
    template: "registerverify"
}, function(response, status) {
    console.log(response);
    console.log(status);
});
/*
sample output
{
    "return":
    {
        "status":200,
        "message":"تایید شد"
    },
    "entries": {
            "messageid":8792343,
			"message": "ممنون از ثبت نام شما کد تایید عضویت  : 852596",
            "status":5,
            "statustext":"ارسال به مخابرات",
            "sender":"10004346",
            "receptor":"09361234567",
            "date":1356619709,
            "cost":120
   }    
    
}
*/
```
