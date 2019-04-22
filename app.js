const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Item = require('./models/items');
const List = require('./models/lists');
const _ = require('lodash');
const date = require(__dirname + '/date.js');
const items = ['Buy Food', 'Cook Food', 'Eat Food'];
const workItems = [];
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useFindAndModify: false});

const newItem1 = new Item({
    name: 'Welcome to your todolist!'
});

const newItem2 = new Item({
    name: 'Hit the + button to add a new item.'
});

const newItem3 = new Item({
    name: '<-- Hit this to delete an item.'
});

const defaultItems = [newItem1, newItem2, newItem3];

// Item.insertMany(defaultItems, (err) => {
//     if (err) {
//         console.log('Error');
//     } else {
//         mongoose.connection.close();
//         console.log('All items inserted into Item DB successfully.');
//     }
// });

app.get('/', (req, res) => {
    const day = date.getDate();

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log('Error');
                } else {
                    mongoose.connection.close();
                    console.log('Default items inserted into DB.');
                }
            });
            
            res.redirect('/');
        } else {
            res.render("list", {listTitle: "Today", newListItem: foundItems })
        }
    });
});

app.post('/', (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const newItem = new Item({
        name: itemName
    });

    if (listName === "Today") {
        newItem.save();
        res.redirect('/');
    } else {
      List.findOne({name: listName}, (err, foundList) => {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect('/' + listName);
      }); 
    }
});

app.post('/delete', (req, res) => {
    const itemID = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === 'Today') {
        Item.findByIdAndRemove(itemID, (err) => {
            if (!err) {
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: mongoose.Types.ObjectId(itemID)}}}, {safe: true, upsert: true}, function(err, foundList) {
            if (!err) {
                res.redirect('/' + listName);
            } else {
                console.log('err');
            }
        });
    }
});

app.get('/:newListName', (req, res) => {
    const customListName = _.capitalize(req.params.newListName);
    const day = date.getDate();

    List.findOne({name: customListName}, (err, results) => {
        if (!err) {
            if (!results) {
            // Create a new list
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save();
            res.redirect('/' + customListName);
            } else {
                // Show an existing list
                res.render('list', {listTitle: results.name, newListItem: results.items});
            }
        }
    });
});

app.post('/work', (req, res) => {
    res.redirect('/work');
});

app.get('/about', (req, res) => {
    res.render("about");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});