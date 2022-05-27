const http = require('http');
const fs=require("fs");
const path=require("path");
const url=require("url");
const hostname = '127.0.0.1';
const port = 3000;

//const serverName="http://localhost:3000";

/* *****************************************************************
  DISCLAIMER: This code is developed to support education and demo 
  purposes and certain simplifications have been made to keep the code
  comphrensible.
  ****************************************************************** */


/* ******************************************************************  
  First a number of helper functions to serve basic files and documents 
 ****************************************************************** */ 

//https://blog.todotnet.com/2018/11/simple-static-file-webserver-in-node-js/
//https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http

const publicResources="node/PublicResources/";
//secture file system access as described on 
//https://nodejs.org/en/knowledge/file-system/security/introduction/
const rootFileSystem=process.cwd();
function securePath(userPath){
  if (userPath.indexOf('\0') !== -1) {
    // could also test for illegal chars: if (!/^[a-z0-9]+$/.test(filename)) {return undefined;}
    //if (!/^[a-z0-9]+$/.test(filename)) {      return undefined;    }
    return undefined;
  }
  userPath = path.normalize(userPath).replace(/^(\.\.(\/|\\|$))+/, '');
  userPath= publicResources+userPath;

  let p= path.join(rootFileSystem,path.normalize(userPath)); 
  //console.log("The path is:"+p);
  return p;
}


/* generate and send a response with htmlString as body */
function htmlResponse(res, htmlString){
  res.statusCode = 200;
  res.setHeader('Content-Type', "text/html");
  res.write(HTMLHdr+htmlString+HTMLEnd);
  res.end('\n');
}

/* send a response with a given HTTP error code, and reason string */ 
function errorResponse(res, code, reason){
  res.statusCode=code;
  res.setHeader('Content-Type', 'text/txt');
  res.write(reason);
  res.end("\n");
}
/* send 'obj' object as JSON as response */
function jsonResponse(res,obj){
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(obj));
  res.end('\n');
}

/* send contents as file as response */
function fileResponse(res, filename){
  const sPath=securePath(filename);
  console.log("Reading:"+sPath);
  fs.readFile(sPath, (err, data) => {
    if (err) {
      console.error(err);
      errorResponse(res,404,String(err));
    }else {
      res.statusCode = 200;
      res.setHeader('Content-Type', guessMimeType(filename));
      res.write(data);
      res.end('\n');
    }
  })
}

//A helper function that converts filename suffix to the corresponding HTTP content type
//better alternative: use require('mmmagic') library
function guessMimeType(fileName){
  const fileExtension=fileName.split('.').pop().toLowerCase();
  console.log(fileExtension);
  const ext2Mime ={ //Aught to check with IANA spec
    "txt": "text/txt",
    "html": "text/html",
    "ico": "image/ico", // CHECK x-icon vs image/vnd.microsoft.icon
    "js": "text/javascript",
    "json": "application/json", 
    "css": 'text/css',
    "png": 'image/png',
    "jpg": 'image/jpeg',
    "wav": 'audio/wav',
    "mp3": 'audio/mpeg',
    "svg": 'image/svg+xml',
    "pdf": 'application/pdf',
    "doc": 'application/msword',
    "docx": 'application/msword'
   };
    //incomplete
  return (ext2Mime[fileExtension]||"text/plain");
}

/* As the body of a POST may be long the HTTP modules streams chunks of data
   that must first be collected and appended before the data can be operated on. 
   This function collects the body and returns a promise for the body data
*/

function collectPostBody(req){
  //the "executor" function
 function collectPostBodyExecutor(resolve,reject){
    let bodyData = [];
    req.on('data', (chunk) => {
      bodyData.push(chunk);
    }).on('end', () => {
      bodyData = Buffer.concat(bodyData).toString();
      console.log(bodyData);
      resolve(bodyData);
    });
    //Exceptions raised will reject the promise
  }
  return new Promise(collectPostBodyExecutor);
}

//interprets req body as JSON data and returns the parsed JS object 
/*
async function extractJSON(req){
  let body=await collectPostBody(req);
  let bodyJSON=JSON.parse(body);
  console.log(bodyJSON);
  return bodyJSON
}
*/

function extractJSON(req){
  return collectPostBody(req).then(body=> JSON.parse(body));
//  let bodyJSON=JSON.parse(body);
//  console.log(bodyJSON);
//  return bodyJSON
}


/* ***************************************************
 * Application code for the BMI tracker application 
 ***************************************************** */

//constants for validating input from the network client
const maxHeight=300;
const minHeight=1;
const maxWeight=300;
const minWeight=1;
const minNameLength=1;
const maxNameLength=30;

let clients = [];

//const server = http.createServer( (req, res) => {HR(req,res);});

const server = http.createServer(requestHandler);
function requestHandler(req,res){
  try{
   processReq(req,res);
  }catch(e){
    console.log("Internal Error: " +e);
   errorResponse(res,500,"");
  }
}

function processReq(req,res){
  let date=new Date();
  console.log("GOT: " + req.method + " " +req.url);
  switch(req.method){
    case "GET":
      let query=url.parse(req.url);
      let queryPath=decodeURI(query.path); // Conert uri encoded special letters (eg æøå that is escaped by "%number") to JS string
      let pathElements=queryPath.split("/"); 
      console.log(pathElements);
      switch(pathElements[1]){  //index 0 contains string before first "/" (which is empty) 
        case "": //
          fileResponse(res,"chatClient.html");
          break;
        case "/chat":
          clients.push(response);
          // If the client closes the connection, remove the corresponding
          // response object from the array of active clients
          request.connection.on("end", () => {
            clients.splice(clients.indexOf(response), 1);
            response.end();
          });
          // Set headers and send an initial chat event to just this one client
          response.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache"
          });
          break;
        case "date": // 
          date=new Date();
          console.log(date);
          jsonResponse(res,date);
        break;
        default: //for anything else we assume it is a file to be served
          fileResponse(res, req.url);
        break;
      }
    break;
    case "POST":
      switch(req.url){
        default: 
          console.error("Resource doesn't exist");
          errorResponse(res, 404, "No such resource"); 
          break; //POST URL
      }
      break;
  }
}



/* start the server */
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  fs.writeFileSync('message.txt', `Server running at http://${hostname}:${port}/`);
});



