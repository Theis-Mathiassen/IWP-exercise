import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';

const hostname = '127.0.0.1';
const port = '3000';



const server = http.createServer(requestHandler);

function requestHandler (req, res) {
    try {
        console.log("GOT: " + req.method + " " +req.url);
        let baseURL = 'http://' + req.headers.host + '/';
        let u=new URL(req.url,baseURL);
        let queryPath=decodeURIComponent(u.pathname);
        let pathElements=queryPath.split("/");
        console.log(pathElements);
        switch (req.method) {
        case "GET":
            switch (pathElements[1]) {
                case "":
                    htmlResponse(res, createHTMLSite());
                    break;
                case "cookie":
                    console.log("You asked for cookies :)");
                    htmlResponse(res, createHTMLCookieSite());
                    break;
                /*case "favicon.ico":
                    Implement later.
                    break;*/
                default:
                    console.log("Error you entered: " + pathElements[1]);
                    errorResponse(res, 'Wrong endpoint.');
                    break;
            }
            break;
        case "POST":
            switch (pathElements[1]) {
                case 'mouseOver':
                    extractForm(req)
                    .then(data => {
                        logData(req, data.outerHTML);
                        htmlResponse(res, '');
                    })
                    break;
                default:
                    console.log("Error you entered: " + pathElements[1]);
                    errorResponse(res, 'Wrong endpoint.');
                    break;
            }
            break;
        default:
            throw "method does not exist";
        }
    }
    catch (e) {
        console.log(e);
    }

}

function logData (req, data) {
    //console.log(data.outerHTML);
    let id = "data";//req.headers["host"];
    id = id.replaceAll('.', '_');
    for (let element in req.headers) {
        console.log(element + " : " + req.headers[element]);
    }
    let logPath = path.join("logs", id + ".txt");
    fs.appendFile(logPath, data + "\n", 'utf8', (error) => {
        if (error) {
            console.error("Some error??");
            return;
        }
        console.log("File is updated.");
    });
}

server.listen(port,hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


/* send a response with htmlString as html page */
function htmlResponse(res, htmlString){
    res.statusCode = 200;
    res.setHeader('Content-Type', "text/html");
    res.write(htmlString);
    res.end('\n');
}

function errorResponse (res, error) {
    res.statusCode = 400;
    res.setHeader('Content-Type', "text/html");
    res.write(error);
    res.end('\n');
}

/* extract the enclosed forms data in the pody of POST */
/* Returns a promise */
function extractForm(req){
    if((req.headers['content-type'] === "application/json")) {
        return collectPostBody(req).then(body=> {
        //const data = qs.parse(body);//LEGACY
            //console.log(data);
            let data=JSON.parse(body);
        return data;
        });
    } else {
        return Promise.reject(new Error("request headers content type, is not JSON")); 
    }
}

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


function createHTMLSite () {
    return `
    <h1>This is a header</h1>
    <p>This is a paragraph</p>
    <script defer>
        document.addEventListener("mouseover", (event) => {
            let elementInfo = {"outerHTML": String(event.target.outerHTML)};
            fetch ('/mouseOver', {
                method: "POST",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(elementInfo)
            });
            console.log(elementInfo);
        });
    </script>
    `;
}

function createHTMLCookieSite () {
    return `
    <h1>Welcome to cookie site</h1>
    <p>You have visited this site <span id="timesVisited"> </span> times.</p>
    <script defer>
        function getCookies() {
            let cookies = new Map(); // The object we will return
            let all = document.cookie; // Get all cookies in one big string
            console.log("Number of cokies?: " + all.length);
            let list = all.split("; "); // Split into individual name/value pairs
            for(let cookie of list) { // For each cookie in that list
                if (!cookie.includes("=")) continue; // Skip if there is no = sign
                console.log(cookie);
                let p = cookie.indexOf("="); // Find the first = sign
                let name = cookie.substring(0, p); // Get cookie name
                let value = cookie.substring(p+1); // Get cookie value
                value = decodeURIComponent(value); // Decode the value
                cookies.set(name, value); // Remember cookie name and value
            }
            return cookies;
        }
        function setCookie(name, value, daysToLive=null) {
            let cookie = name+"="+encodeURIComponent(value);
            if (daysToLive !== null) {
                cookie += "; max-age="+daysToLive*60*60*24;
            }
            document.cookie = cookie;
        }
        let timesVisitedField = document.querySelector("#timesVisited");
        let cookies = getCookies();
        let timesVisited = Number(cookies.get("timesVisited"));
        console.log(timesVisited);
        if (timesVisited) {
            timesVisitedField.innerHTML = timesVisited + 1;
            setCookie("timesVisited", timesVisited + 1, 2);
        } else {
            setCookie("timesVisited", 1, 2);
            timesVisitedField.innerHTML = 1;
        }
    </script>
    `;
}


function getCookies() {
    let cookies = new Map(); // The object we will return
    let all = document.cookie; // Get all cookies in one big string
    console.log(all);
    let list = all.split("; "); // Split into individual name/value pairs
    for(let cookie of list) { // For each cookie in that list
        if (!cookie.includes("=")) continue; // Skip if there is no = sign
        let p = cookie.indexOf("="); // Find the first = sign
        let name = cookie.substring(0, p); // Get cookie name
        let value = cookie.substring(p+1); // Get cookie value
        value = decodeURIComponent(value); // Decode the value
        cookies.set(name, value); // Remember cookie name and value
    }
    return cookies;
}

function setCookie(name, value, daysToLive=null) {
    let cookie = `${name}=${encodeURIComponent(value)}`;
    if (daysToLive !== null) {
        cookie += `; max-age=${daysToLive*60*60*24}`;
    }
    document.cookie = cookie;
}
    
