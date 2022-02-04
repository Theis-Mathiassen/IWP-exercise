'use strict'
//SEE: https://javascript.info/strict-mode

console.log("Hej Med Dig!");
triangle(7);
console.log(chessBoard());
let strings = ["Hejsa", "med", "dig!"];
console.log(averageLength(strings));

console.log(renderPage("Simpel IWP Demo", "IWP demo","JS Script er kørt"));


function triangle (n) {
  for (let i = 1; i <= n; i++) {
    let result = "";
    for (let j = 1; j <= i; j++) {
      result += "#";
    }
    console.log(result);
  }
}

function chessBoard () {
  let result = "";
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (j % 2 === i % 2) {
        result += " ";
      } else {
        result += "#";
      }
    }
    result += "\n";
  }
  return result
}

function renderPage(title,heading,demoString) {
  let result = 
  "<!DOCTYPE html>\n" +
  "  <html lang=\"da\">\n" +
  "  <head>\n" +
  "    <meta charset=\"utf-8\">\n" +
  "    <title>" + title + "</title>\n" +
  "  </head>\n" +
  "  <body>\n" +
  "    <!-- page content -->\n" +
  "    <h1> " + heading + " </h1>\n" +
  "    <script>\n" +
  "      console.log(\"" + demoString + "\");\n" +
  "    </script>\n" +
  "  </body>\n" +
  "</html>\n";
  return result;
}

function averageLength (list) {
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i].length;
  }
  return sum / list.length;
}



