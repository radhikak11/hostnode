let express = require("express")
let ourApp = express()
ourApp.use(express.urlencoded({extended:false}))
ourApp.get('/',function(req,res){
res.send(`<form action="/answer" method="POST">
<p>wHAT COLOR IS THE SKY ON A CLEAR AND SUNNY DAY?</p>
<input name="skyColor" autocomplete="off"/>
<button>Submit Answer</button>
</form>`)
});

//this method access from form Submit button
ourApp.post("/answer",function(req,res){
    console.log(req.body)  
  if(req.body.skyColor.toString().trim().toLowerCase()=="blue")
  {
    res.send(`<p>Congrats, that is the correct answer!</p><a href="/">Back to HomePage</a>`)
  }else{
    res.send(`<p>that is the invalid color</p><a href="/">Back to HomePage</a>`)
  }
})

//Direct Access the answer page retun value
ourApp.get('/answer',function(req,res){
    res.send('This page direct access not allowed')
 })

ourApp.listen(3000)