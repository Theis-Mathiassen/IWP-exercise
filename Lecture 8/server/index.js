const WebSocket = require('ws');
const http = require('http');
const fs=require("fs");
const path=require("path");
const url=require("url");
const hostname = '127.0.0.1';
const port = 3000;
const wss = new WebSocket.Server({ port:port});

const publicResources="node/PublicResources/";
let clients = [];
let idCount = 0;

function getID () {
    return idCount++;
}



////WEBSOCKET SERVER
wss.on('connection', ws => {
    console.log("New client connected.");
    let id = getID();
    console.log(id);
    ws.internalID = id;
    clients.push(ws);
    for (let elem of clients) {
        console.log("User connected: " + elem);
    }

    ws.on("message", (data) => {
        console.log("Client send us this: " + data);
    });


    ws.on("close", (client) => {
        console.log("Client " + id + " disconnected.");

        clients.forEach((elem, index) => {
            if (elem.internalID == id) {
                clients.splice(index,1);
            }
        });
    });
});





//// NORMAL SERVER
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














  /* send contents as file as response */
function fileResponse(res, filename){
    const sPath=securePath(filename);
    console.log("Reading:"+sPath);
    fs.readFile(sPath, (err, data) => {
        if (err) {
            console.error(err);
            errorResponse(res,404,String(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', guessMimeType(filename));
            res.write(data);
            res.end('\n');
        }
    });
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