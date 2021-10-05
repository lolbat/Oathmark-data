// command line code run via node to take the 'flat' JSON files
// and create more logically organized files

// this is being written to take advantage of node even though I know next to nothing about it

// require the filesystem and path code in node
const fs = require('fs');

// this function will let us strip out the quotes from around the integer and boolean variables in the file
function replacer(key, value) {
    
  if (value === 'FALSE' || value === 'false' ) {
     return false;
  }
  
  if (value === 'TRUE' || value === 'true') {
     return true;
  }
   
  if (!isNaN(parseInt(value, 10))) {
       return parseInt(value, 10); 
  }
  
  return value;
  
}

// this will take a string array and return an object with the strings broken into key value pairs
// based on whether the trait has a value. So spellcaster(1) would be "spellcaster": 1 and magicItems would
// be "magicItems": 0
function createObject(stringArray) {
  
  let returnObject = {};
  strings = stringArray.split(",");
  
  strings.forEach(item => {
  
    let thisItem = item.trim(); // the CSV is littered with spaces so lets trim them out
    let matches = thisItem.match(/\((.*?)\)/); // look for matches to the (n) pattern
    
    if (matches) {
      let valueStart = thisItem.indexOf(matches[1]);
      let traitName = thisItem.substr(0,valueStart-1).trim();
      returnObject[traitName] = parseInt(matches[1]); // store the value as an int and not a string
    } else {
      returnObject[thisItem] = 0;
    }
    
  });
  
  return returnObject;
  
}

function convertStats(stringStats) {

  items = stringStats.split(",");
  theReturn = [];
  
  items.map( function (item){ 
   
   item = item.trim();
   newArray = item.split(":");
   newObj = {};
   newObj[newArray[0]] = parseInt(newArray[1]);
   theReturn.push(newObj);

 });
  
  return theReturn;// should look like[ { M: 3 }, { D: 2 } ]
  
}

// now lets read the JSON data
fs.readFile('raw/options.json', 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
    } else {

      // parse JSON string to JSON object
      const optionData = JSON.parse(data);
      
      // iterate over each element and modify it
      optionData.forEach(item => {
            
          // check to see if there is a stats entry
          if (item.Stats !== "") {
            item.Stats = convertStats( item.Stats);
          } 
          
          if(item.Traits !== "") {
            if (item.Traits.indexOf(",") == -1) {
              item.Traits += ",";
            }
            console.log(item.Traits);
            item.Traits = createObject(item.Traits);
          }
        
        });
        
        // now write out the updated file
        let newFilePath = 'processed/options.json';
        let newJSONData = JSON.stringify(optionData, replacer, 2);
        
        // write file to disk
        fs.writeFile(newFilePath, newJSONData, 'utf8', (err) => {
        
            if (err) {
                console.log(`Error writing file: ${err}`);
            } else {
                console.log(`JSON data has been successfully written.`);
            }
        
        });
           
    }

});
