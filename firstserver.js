let http = require('http')
let ourapp = http.createServer(function(req,res)
{
    let resultvalue = "Hello welcome to our first site";
    if(req.url == "/")
    {
        res.end("This is a Main page");
    }
    else if(req.url == "/about")
    {
        res.end("This is a About page");
    }
    res.end('this is Unknown Page');
});
ourapp.listen(3000)