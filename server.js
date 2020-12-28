var express = require("express")
var app = express()
const PORT = 3000;
var path = require('path');
var hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
var context = require("./data/data01.json")
console.log(context)

app.get("/", function (req, res) {
    res.render('index01.hbs', context);
})

app.use(express.static('static'))
//komentartz
//nasłuch na określonym porcie
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
//komentarz