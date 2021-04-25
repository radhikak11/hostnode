//import packages into JS
let express = require('express')
let mongodb = require('mongodb')

//Crate objects
let ourApp = express()

//settings for App development
ourApp.use(express.urlencoded({extended:false}))
ourApp.use(express.json())
ourApp.use(express.static('public'))

let port = process.env.PORT; 
if(port == null || port == "")
{
  port = 3000;
}

//mongo db object creation
let db;

//Connection string.
let constr="mongodb+srv://complanguser:radhikasoft@cluster0.xf4sl.mongodb.net/samplemongo?retryWrites=true&w=majority"


/*
  Database Name         : samplemongo
  Collections           : CompLang
  database access user  : complanguser
  database access pass  : radhikasoft
 */
//connect Mongo db
mongodb.connect(constr,{ useNewUrlParser: true, useUnifiedTopology: true},function(err,client){
  db = client.db('samplemongo')   
  ourApp.listen(port)
})

//App Intial Rendering page (Home Page)=> GET
ourApp.get('/',function(req,res)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
{     
  db.collection('CompLang').find().toArray(function(err,collcitems)
  {
    let homepage = getHtmlHomePage(collcitems)
    res.send(homepage);
  }); 
});


//Create new item in Collection (mongodb => samplemongo=>CompLang)
ourApp.post('/create-item', function(req, res){  
  let dblst = {lanname:req.body.iptext, desc:req.body.ipdesc}  
  db.collection('CompLang').insertOne(dblst, function (err,info) {
      console.log(info.ops[0])  
    //let rtnval = eachItem_Prpare()
    res.json(info.ops[0])  //here return created new item all elements for render value in veiw
  })
 })


 //Update item in Collection (mongodb => samplemongo=>CompLang)
 ourApp.post('/update-item',function(req,res){
  let dblst = {id: req.body.id, lanname:req.body.iptext, desc:req.body.ipdesc}  
    db.collection('CompLang').findOneAndUpdate({_id: new mongodb.ObjectId(dblst.id)},{$set : {lanname : dblst.lanname, desc: dblst.desc}},function(){
        res.json(`Success`)
    })
 })

 //Delete item in Collection (mongodb => samplemongo=>CompLang)
 ourApp.post('/delete-item',function(req,res){
   db.collection('CompLang').deleteOne({_id: new mongodb.ObjectId(req.body.id)},function(){
    res.send(`<p>Deleted Item Completed</p><a href="/">Back to HomePage</a>`)
   })
 })


//Main HTML page tags
 function getHtmlHomePage(collcitems)
 {
   let db_col_list = "";//createList(collcitems);
   return (`<!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Simple To-Do App</title>
     <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
   </head>
   <body>
     <div class="container">
       <h1 class="display-4 text-center py-1">To-Do App</h1>
       
       <div class="jumbotron p-3 shadow-sm">
         <form id="create-form">
           <div class="d-flex align-items-center">
             <input autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;" name="iptext" id="iptext">
             <input autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;" name="ipdesc" id="ipdesc">
             <button class="btn btn-primary">Add New Item</button>
           </div>
         </form>
       </div>
       
       <ul id="item-list" class="list-group pb-5">
         ${db_col_list}
       </ul>       
     </div>
    
     <script> each_collcitems= ${JSON.stringify(collcitems)}</script>
     <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/browscrp.js"></script>           
    
   </body>
   </html>`)
 }

 //this method is un_used; because this method based html loading is client side rendering
 function createList(collcitems)
 {
  let returnlist =  collcitems.map(function(each){
     return eachItem_Prpare(each)
   }).join(' ');
   return returnlist;
 }

 //un used method; because implent client side rendering.
 function eachItem_Prpare(each)
 {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${each.lanname}</span>              
  <span class="item-desc mr-1">${each.desc}</span>
  <div>
    <button data-id="${each._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${each._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
</li>`
}
