const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Item = require('./models/items');
const date = require(__dirname + '/date.js');
const items = ['Buy Food', 'Cook Food', 'Eat Food'];
const workItems = [];
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true});

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
            res.render("list", {listTitle: day, newListItem: foundItems })
        }
    });
});

app.post('/', (req, res) => {
    const itemName = req.body.newItem;

    const newItem = new Item({
        name: itemName
    });

    newItem.save();
    res.redirect('/');
});

app.post('/delete', (req, res) => {
    const itemID = req.body.checkbox;
    Item.deleteOne({_id: itemID}, (err, callback) => {
        if (!err) {
            console.log('Item deleted');
        } else {
            console.log('Error. Item not deleted.');
        }
    });
    res.redirect('/');
});

app.get('/:route', (req, res) => {
    const customListName = req.params.route;

    
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