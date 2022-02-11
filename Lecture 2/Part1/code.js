let diceRoll = [1,6,6,2,3,4,6];

let findFunc = function (v) {
  return (v === 1) ? true : false;
} 

//findDices_v1(diceRoll, findFunc);
findDices_v1(diceRoll, (v) => {return (v <= 3) ? true : false;});


//First the diceRoll list is filtered to include only 6's and then they are summed up.
console.log(diceRoll.filter(dice=>dice==6).reduce((sum,dice)=>sum+dice,0));


function get6s_v1 (values) {
  for (let i = 0; i < values.length; i++) {
    if (values[i] === 6) {
      console.log(`6:${i}`);
    }
  }
}

function get6s_v2 (values) {
  for (let i = 0; i < values.length; i++) {
    if (is6(values[i])) {
      console.log(`6:${i}`);
    }
  }
}

function get6s_v2_1 (values) {
  values.forEach((element, index) => {
    if (is6(element)) {
      console.log(`6:${index}`);
    }
  });
}

function get6s_v3 (values, compare) {
  for (let i = 0; i < values.length; i++) {
    if (compare(values[i])) {
      console.log(`${values[i]}:${i}`);
    }
  }
}

function findDices_v1 (values, compare) {
  for (let i = 0; i < values.length; i++) {
    if (compare(values[i])) {
      console.log(`${values[i]}:${i}`);
    }
  }
}




function is6(v) {
  return (v === 6) ? true : false;
}
