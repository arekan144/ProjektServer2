var express = require("express")
var app = express()
const PORT = 3000;
var path = require('path');
var hbs = require('express-handlebars');
var formidable = require('formidable');
const { callbackify } = require("util");
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: "views/partials",
    helpers: {
        sprawdz_czy_istnieje: function (data) {
            switch (data) {
                case 'PNG': case 'jpg': case 'json': case 'pdf': case 'doc': case 'txt': return data;
                default: return 'nieznany';
            }
        }
    },
}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname));

//zmienne serwera
let context = {
    files: [],
}
var id = 1;

app.get("/", function (req, res) {
    res.redirect("/upload")
})
app.get("/upload", function (req, res) {
    res.render('viewupload.hbs', context);
})
app.get("/filemanager", function (req, res) {
    res.render('viewfileman.hbs', context);
})
app.get("/info/:id", function (req, res) {
    let id = req.params.id;
    let szukany = {};
    if (context.files != []) {
        context.files.forEach(element => {
            if (element.id == id) {
                szukany = element;
            }
        });
    }
    res.render('viewinfo.hbs', szukany);
})
app.get('/del/:id', function (req, res) {
    let id = req.params.id;
    if (context.files != []) {
        for (var x = 0; x < context.files.length; x++) {
            if (context.files[x].id == id) {
                context.files.splice(x, 1);
            }
        }
    }
    res.redirect("/filemanager")
})
app.get('/download/:id', function (req, res) {
    let id = req.params.id;
    if (context.files != []) {
        let do_pobrania = "";
        for (var x = 0; x < context.files.length; x++) {
            if (context.files[x].id == id) {
                do_pobrania = context.files[x].path
                res.download(do_pobrania, function (error) {
                    console.log(error);
                })
            }
        }
    }
})
app.get("/dall", function (req, res) {
    id = 1;
    context = {
        files: [],
    }
    res.redirect("/filemanager")
})
app.post('/handleUpload', function (req, res) {
    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/static/upload')
    form.keepExtensions = true
    form.multiples = true
    form.parse(req, function (err, fields, files) {
        if (Array.isArray(files.imagetoupload) == true) {
            files.imagetoupload.forEach(element => {
                if (element.lastModifiedDate == null) {
                    element.lastModifiedDate = new Date();
                }
                context.files.push({
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
        }
        else {
            console.log(files.imagetoupload)
            if (files.imagetoupload.lastModifiedDate == null) {
                files.imagetoupload.lastModifiedDate = new Date();
            }
            context.files.push({
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
        res.redirect('/filemanager');
    })
});
app.use(express.static('static'))
//nasłuch na określonym porcie
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
});
