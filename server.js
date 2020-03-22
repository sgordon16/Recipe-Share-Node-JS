var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var mysql = require('mysql');
const bodyParser = require('body-parser');
var sqlDiets = 'select name from diet_options order by name';
var currID = null;
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
});
con.connect(function(err){
    if(err) throw err;
    console.log("connected!");
});
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

/**
 * Send them to home page
 */
app.get(['/', '/home'], (req, res) => {
    var sql = 'select * from recipes order by rating desc, date limit 12';
    try{
        execQuery(sqlDiets, function(res1){ 
            execQuery(sql, function(res2){
                res.render('home', {
                    title: 'Home',
                    diets : JSON.stringify(res1),
                    recipes : JSON.stringify(res2)
                });
            });
        });
    }
    catch(error){
        console.log(error);
    }     
});

app.post('/search', (req, res) => {
    console.log(req.body);
    var sql = `select * from recipes where title like '%${req.body.searchWord}%'`;
    if(req.body.diets != null){
        if(typeof req.body.diets === 'string')
            sql += ` AND JSON_SEARCH(diet, 'one', '${req.body.diets}') is not null`;
        else{
            req.body.diets.forEach(diet => {
                sql += ` AND JSON_SEARCH(diet, 'one', '${diet}') is not null`;
            });
        }
    }
    console.log(sql);
    try{
        execQuery(sqlDiets, function(res1){ 
            execQuery(sql, function(res2){
                res.render('home', {
                    title: 'Home',
                    diets : JSON.stringify(res1),
                    recipes : JSON.stringify(res2)
                });
            });
        });
    }
    catch(error){
        console.log(error);
    }     
});

app.get('/viewRecipe', (req, res) =>{
    currID = req.query.id;
    var sql = `select * from recipes where id = ${currID}`;
    try{
        execQuery(sql, function(result){
            //console.log(JSON.stringify(result))
            res.render('viewRecipe', {
                title: 'View Recipe',
                recipes: JSON.stringify(result)
            });
        });
    }
    catch(error){
        console.log(error);
    } 
});

app.get('/recipeForm', (req, res) =>{
    var sql = 'select name from diet_options order by name';
    execQuery(sql, function(result){
        res.render('RecipeForm', {
            title: 'Recipe Form',
            diets: JSON.stringify(result)
        });
    });
});

app.post('/recipeUpload', (req, res) =>{
    var ingredients = JSON.stringify(req.body.ingredients);
    var diets;
    var imgUrl = '';
    if(typeof req.body.diets === 'string')
        diets = req.body.diets;
    else
        diets = JSON.stringify(req.body.diets);
    if(req.body.imgUrl != null)
        imgUrl = req.body.imgUrl;
    var sql = `INSERT INTO recipes (title, ingredients, directions, time, diet, imgUrl, servings, caloriesPerServing) 
        VALUES('${req.body.title}', '${ingredients}', '${req.body.directions}', '${req.body.time}', '${diets}', '${imgUrl}', '${req.body.servings}', '${req.body.caloriesPerServing}')`;
    //INSERT INTO `table_name`(column_1,column_2,...) VALUES (value_1,value_2,...);
    execQuery(sql, function(result){
        console.log(result);
        res.render('confirmation', {
            title: 'Confirmation',
            message: 'Your recipe has been uploaded!'
        });
    });
});

app.get('/about', (req, res) =>{
    res.render('about', {
        title: 'About Us'
    });
});

app.get('/contact', (req, res) =>{
    res.render('contact',{
        title: 'Contact us'
    });
});

app.post('/rate', (req, res) => {
    var sql = `UPDATE recipes SET totalRating = totalRating + ${req.body.rating}, rates = rates + 1 WHERE ID = ${currID}`;
    execQuery(sql, function(res){
        console.log(res);
    });
});
  /**
   * Recieved the contact page. Send them to comfirmation page and process the data
   */
app.post('/confirmation', (req, res) => {
    //Send them a confirmation email
    sendEmail(req.body.name, req.body.email, req.body.subject, req.body.message);
    //console.log(req.name);
    res.render('confirmation', {
        title: 'Confirmation',
        message: 'Your email has been sent'
    });
});


const server = app.listen(8080, () => {
    console.log(`Express running -> PORT ${server.address().port}`);
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})



function execQuery(sql, callback) {
    con.query(sql, function(err, result){
        if (err) throw err;
        callback(result);
    }); 
}

function sendEmail(name, email, subject, message){
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shlomogordon16@gmail.com',
            pass: 'keyboard#95'
        }
    });

    var mailOptions = {
        from: email, 
        to: 'shlomogordon16@gmail.com',
        subject: 'Form Submission: ' + subject, 
        html: '<h3>From: ' + name + '</h3>'+
        '<h3>Email Address: ' + email + '</h3>' +
        '<h2>Message:</h2><p>' + message + '</p>',
    };

    transport.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }
         else {
            console.log('Email sent: ' + info.response);
        }
    });
}

