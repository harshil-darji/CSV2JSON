const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const csvToJson = require('convert-csv-to-json');
const fs = require('fs');

//CREATE EXPRESS APP
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
 
//ROUTES WILL GO HERE
app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');
 
});

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

// Upload single file
app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }

  var fileExtension = file.originalname.split(".").pop();
  if(fileExtension === "xlsx")
  {
	const result = excelToJson({
   	sourceFile: 'uploads/' + file.originalname,
   		header: {
       		rows: 1
    	},
	    columnToKey: {
        	'*': '{{columnHeader}}'
    	}
  	});
	res.sendStatus(200)
  	console.log(result);
  }
  else if(fileExtension === "csv")
  {
  	res.sendStatus(200)
	let json = csvToJson.getJsonFromCsv('uploads/' + file.originalname);
	console.log(json);
  }
  else
  {
    res.sendStatus(400);
  	console.log('\nInvalid file uploaded!');
  }

  fs.unlink('./uploads/' + file.originalname, function(err){
     if(err) return console.log(err);
     console.log('\nFile deleted successfully.');
  }); 
})

app.listen(3000, () => console.log('Server started on port 3000'));