var express = require("express")
var app = express()
const PORT = 3000;
var path = require('path');
var hbs = require('express-handlebars');
var formidable = require('formidable');
const { callbackify } = require("util");
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname));

//zmienne serwera
let context = [];
let id = 1;

app.get("/", function (req, res) {
    res.redirect("/upload")
})
app.get("/upload", function (req, res) {
    res.render('viewupload.hbs', context);
})
app.get("/filemanager", function (req, res) {
    res.render('viewfileman.hbs', context);
})
app.get("/info", function (req, res) {
    res.render('viewinfo.hbs');
})
app.get("/dall", function (req, res) {
    // jakiś kod usuwający wszystkie dane z tablicy :);
    res.render('viewinfo.hbs', context);
})
app.post('/handleUpload', function (req, res) {
    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/static/upload')       // folder do zapisu zdjęcia
    form.keepExtensions = true                           // zapis z rozszerzeniem pliku
    form.multiples = true                                // zapis wielu plików                          
    form.parse(req, function (err, fields, files) {
        //console.log(files.imagetoupload, typeof (files.imagetoupload));
        if (Array.isArray(files.imagetoupload) == true) {
            files.imagetoupload.forEach(element => {
                context.push({
                    id: id,
                    ext: element.name.split(".")[1],
                    name: element.name,
                    size: element.size,
                    type: element.type,
                    path: element.path,
                    savedate: element.lastModifiedDate.getTime(),
                })
                id++;
            })
            console.log("wiele elementów")
        }
        else {
            console.log("jeden element")
            console.log(files.imagetoupload.lastModifiedDate)
            context.push({
                id: id,
                ext: files.imagetoupload.name.split(".")[1],
                name: files.imagetoupload.name,
                size: files.imagetoupload.size,
                type: files.imagetoupload.type,
                path: files.imagetoupload.path,
                savedate: files.imagetoupload.lastModifiedDate.getTime(),
            })
            id++;
        }
        console.log(context)
        //let szukany = {};
        /*context.forEach(element => {
            if (element.id == 1) {
                szukany = element;
            }
        })*/
        res.redirect('/filemanager');
    })
});
app.use(express.static('static'))
//nasłuch na określonym porcie
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
});
