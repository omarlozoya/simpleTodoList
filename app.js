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


app.get('/', (req, res) => {
    const day = date.getDate();
    res.render('list', {listTitle: day, newListItem: items});
});

app.post('/', (req, res) => {
    const item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect('/work');
    } else {
        items.push(item);
        res.redirect('/');
    }
});

app.get('/work', (req, res) => {
    res.render("list", {listTitle: "Work List", newListItem: workItems});
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