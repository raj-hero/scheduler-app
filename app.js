const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");
// console.log(date());
const app = express();
// items used in get,so defined before
// we can use const instead of let in arrays and still append the array
let items=["lola pu","loli pa","lol po","naatu"];
let workItems=[];

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
    let day=date.getDate();
    // let day=date.getDate();
    // listTitle,newListItems->from ejs file
    // newListItems->to be defined in get also even if defined in post
    res.render("list",{listTitle:day,newListItems:items});
});
app.post("/",function(req,res){
    // newItem is name of input in form
    let item=req.body.newItem;
    if(req.body.list==="Work"){
        workItems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
    // res.render("list",{newListItems:item});
    // vvvv redirects to app.get
    // console.log(item);
});

app.get("/work",(req,res)=>{
    res.render("list",{listTitle:"Work List",newListItems:workItems});
});
app.post("/work",function(req,res){
    let item=req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});


app.listen(3000, function() { 
    console.log("Server started on port 3000");
  });