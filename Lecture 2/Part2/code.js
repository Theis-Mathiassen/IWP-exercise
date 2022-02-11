function briansHandler(boardName,message){
  console.log(`Brian! A message from ${boardName}: ${message}`);
}


let msgBoard = {
  name          : "IWP Chat",
  messages      : [],
  callBacks     : [],
  putMessage    : function (message) {
    this.messages.push(message);
  },
  printMessages : function () {
    let outputString = "Messages History in board IWP Chat:";
    outputString = outputString + `\n` + this.messages.reduce((tempString, element) => {
      return tempString + "\n" + element;
    });
    console.log(outputString);
  },
  register      : function (f) {
    this.callBacks.push(f);
  },
  sendAndNotify : function (message) {
    this.putMessage(message);
    this.callBacks.forEach(func => {
      func(this.name, message);
    });
  }
}

function MessageBoard (name) {
  this.name = name;
  this.messages = [];
  this.callBacks = [];
  this.putMessage = function (message) {
    this.messages.push(message);
  };
  this.printMessages = function () {
    let outputString = "Messages History in board IWP Chat:";
    outputString = outputString + `\n` + this.messages.reduce((tempString, element) => {
      return tempString + "\n" + element;
    });
    console.log(outputString);
  };
  this.register = function (f) {
    this.callBacks.push(f);
  };
  this.sendAndNotify = function (message) {
    this.putMessage(message);
    this.callBacks.forEach(func => {
      func(this.name, message);
    });
  }
}




msgBoard.putMessage("Hej, dette er en test");
msgBoard.putMessage("Hej IWP");
msgBoard.printMessages();

msgBoard.register(briansHandler);
msgBoard.register((board,message)=>console.log(`Board ${board} says to Michele: ${message}`));
msgBoard.sendAndNotify("URGENT: Opgaveregning nu!")

let board2= new MessageBoard("Opgave Regning"); 
board2.putMessage("Hej, dette er en test");
board2.printMessages();

