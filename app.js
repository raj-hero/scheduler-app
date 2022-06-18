//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

port=process.env.PORT||8080;
// mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://Raj:raj@cluster0.br6qx.mongodb.net/todo",{useNewUrlParser:true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Welcome to your Todolist !"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "Hit checkbox to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", (req, res)=> {

  Item.find({}, (err, foundItems)=>{

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems,(err)=>{
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

app.get("/:customListName", (req, res)=>{
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, (err, foundList)=>{
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });

});

app.post("/", (req, res)=>{

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, foundList)=>{
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res)=>{
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId,(err)=>{
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList)=>{
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});

app.get("/about", (req, res)=>{
  res.render("about");
});

app.listen(port, ()=> {
  console.log(`The server is up and running on http://localhost:${port}`);
});

// items used in get,so defined before
// we can use const instead of let in arrays and still append the array

// listTitle,newListItems->from ejs file
// newListItems->to be defined in get also even if defined in post

// newItem is name of input in form res.render("list",{newListItems:item});