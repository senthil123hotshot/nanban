var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var multer=require('multer');
var fs=require("fs");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'nanban'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log("Error connecting database ... nn");    
}
});
var app = express();

var engines = require('consolidate');

app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


var storage =multer.diskStorage({
  destination: function(req,fileToUpload,cb){
    cb(null,'public/uploadsimage/');
  },
  filename: function(req,fileToUpload,cb){
    cb(null,fileToUpload.originalname);
  }
})

var upload = multer({storage: storage}).single('fileToUpload');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get("/register",function(req,res){
	res.render("register");
});
app.post("/register",function(req,res){
	//register page load
	var username=req.body.Username;
    var	password=req.body.PassWord;
    connection.query("INSERT INTO Register (`Email`, `Password`) VALUES ('" + username + "', '" +password + "')", function(err){
           if(err)console.log(err);
               else
               //res.json({"message":"succesfully Resistered"});
           		res.redirect("/");
           		//load login file or render login automatically.
});
});
app.get("/",function(req,res){
	res.render("login");
});
app.post("/login",function(req,res){
	//login pageload
var username=req.body.Username;
 var password=req.body.PassWord;

 //integrate the login page ui

 connection.query('select Email from Register where Email= "'+username+'" and Password="'+password+'"' ,function(err,result){
 	if(err){
 		res.send("Authendication fail");
 	}
 	else
 	//res.send("succesfully login");
res.redirect("/home");
 });
});
app.get("/home",function(req,res){
	//render the  full home page 
connection.query("select imagepath,name,doj from student",function(err,result){
 res.render("home" // result); 
});


		
});
app.get('/memoriesadd',function(req,res){
  res.render('memoryadd');
});
app.post('/memoriesadd',function(req,res){
  upload(req,res,function(err){
    var magic =["image/jpeg","image/png","image/jpg"];
              var image={
                imagename : req.file.filename,
                imagepath : req.file.path,
                imagesize : req.file.size,
                imagetype : req.file.mimetype

              }
              if(image.imagetype == magic[0] || image.imagetype == magic[1] || image.imagetype == magic[2]){
                res.send("display photo");


                //res.redirect("/memoriesdispaly");
          }
          else{
            res.render('memoryadd',{error:"ONLY IMAGES ARE ACCEPTED"});
            console.log('error uploading ');

          }
          });

});
// catch 404 and forward to error handler
app.get("/memorydisplay",function(res,req){

fs.readFile('5640(2).jpg', function(err, data) {
  if (err) throw err
  	else
  	res.writeHead(200, {'Content-Type': 'image/jpg'});
    res.end(data); // Send the file data to the browser.
  });
});






app.listen(3000);
