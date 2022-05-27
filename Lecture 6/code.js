function monkeysJump(event) {
  event.preventDefault();
  let numMonkeys = document.getElementById("monkeys")["value"];
  let output = document.getElementById("message");
  try {
    if (isNaN(numMonkeys)) {
      throw "Not a number.";
    } else {
      if (numMonkeys > 5) {
        throw "Too many monkeys."
      } else if (numMonkeys < 1) {
        throw "At least 1 monkey.";
      } else {
        output.textContent = "";
        for (let i = numMonkeys; i > 0; i--) {
          output.append((i) + " little monkeys are jumping on the bed.\n");
        }
      }
    }

  }
  catch (err) {
    setTimeout(() => {output.textContent = err}, 2000);
  }
}

async function hejIWPAsync () {
  let output = document.querySelector('#task3output');
  await wait(2000);
  write(output, 'Hej');
  await wait(2000);
  write(output, 'IWP');
  await wait(2000);
  write(output, 'I am done!');


  console.log("Hello");
}

function hejIWP () {
  let output = document.querySelector('#task3output');
  wait(2000)
  .then(() => {return write(output, 'Hej')})
  .then(() => {return wait(2000)})
  .then(() => {return write(output, 'IWP')})
  .then(() => {return wait(2000)})
  .then(() => {return write(output, 'I am done!')});


  console.log("Hello");
}

function write (output, text) {
  return new Promise ((resolve, reject) => {
    output.append(text);
    output.append(document.createElement("br"));
    resolve();
  });
}

function wait (time) {
  return new Promise ((resolve, reject) => {
    if (isNaN(time)) {
      reject(new Error('needs to be a number.'));
    }
    setTimeout(resolve,time);
  });
}



document.getElementById("myForm").addEventListener("submit", monkeysJump);
document.getElementById("task3Button").addEventListener("click", hejIWPAsync);