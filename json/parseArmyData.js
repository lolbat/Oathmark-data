// command line code run via node to take the 'flat' JSON files
// and create more logically organized files

// this is being written to take advantage of node even though I know next to nothing about it

// now runs on its own without CLI arguments and also merges data from a separate file to store names
// for each army so I don't have to keep entering them

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
  
  stringArray.forEach(item => {
  
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

// define an array of army names that we need to parse
let armyNames = ["dwarves", "orcs", "humans", "goblins", "undead", "elves", "monsters"];

armyNames.forEach (factionName => {
  
  let unitDataFilePath = "raw/" + factionName + ".json";
  let unitDetailsFilePath = "headers/" + factionName + "_headers.json";
  let unitOptionsFilePath = "options/" + factionName + "_options.json";
  let resultsFilePath = "processed/" + factionName + ".json";
  
  // read the options file and iterate over all the keys to build a list of unit names that have options available
  let armyOptionsString = fs.readFileSync(unitOptionsFilePath).toString();
  let armyOptions = JSON.parse(armyOptionsString);
  
  let optionNames = [];
  armyOptions.forEach(option => {
    optionNames.push(option.unit);
  });
  
  // read the army details search name etc
  let armyDetails = fs.readFileSync(unitDetailsFilePath).toString();
  let newJSONArmy = JSON.parse(armyDetails);

  // now lets read the army data
  let armyData = fs.readFileSync(unitDataFilePath).toString();
  let unitData = JSON.parse(armyData);

  // iterate over each element and modify it
  unitData.forEach(unit => {
        
      // change the equipment to an array
      unit["equipment"] = unit["equipment"].split(',').map(item => item.trim());
      
      // if they can have magic items then add a key for them
      if (unit["magic"] == "TRUE" || unit["magic"] == "true") {
        unit["magicItems"] = [];
      };
      
      // is there option data for this unit?
      let unitNameIndex = optionNames.indexOf(unit.name);
      if (unitNameIndex != -1) {
        
        // so they are in the list so they have options so make a key and add the options
        unit["hasOptions"] = true;
        unit["options"] = armyOptions[unitNameIndex].options;
        
      } else {
        unit["hasOptions"] = false;
      }

      // change the special traits to an array
      let tempArray = unit["special"].split(',').map(item => item.trim());
      
      // now convert it to an object
      unit["special"] = createObject(tempArray);

        // create a new object
        let thisNewObject = {};
        let keyArray = ["activation", "move", "fight", "shoot", "defence", "combatDice", "health"];
        
        // iterate over the keys for the stats
        keyArray.forEach(keyName => {
            
            // add the key and its value in the JSON file to the new object
            thisNewObject[keyName] = unit[keyName];
            
            // now delete the key
            delete unit[keyName];
            
        });
        
        // add the stats key to the JSON object
        unit["stats"] = thisNewObject;
        
        // build the character traits key
        let traitsObject = {};
        
        // first check for a spellcaster and store their spells
        // check to see if this is a spellcaster and add a spells trait if it is
        if (unit["spellcaster"] !== "0") {
          
          if (unit["spells"] !== undefined) {
            traitsObject["spells"] = unit["spells"].split(',').map(item => item.trim());
            traitsObject["spelllist"]  = [];
            traitsObject["maxSpells"] = unit["special.Spellcaster"]; // store a distinct spell level so we can modify it for magic items
          }
          
        }
        
        // now delete the spells key
        delete unit["spells"];
        
        // iterate over the keys for the character traits
        let newKeyArray = ["hero", "commander", "champion", "spellcaster"];
        
        newKeyArray.forEach(keyName => {
            
            // add the key and its value in the JSON file to the new object
            traitsObject[keyName] = unit[keyName];

            // now delete the key
            delete unit[keyName];
            
        });
        
        // add it to the JSON object
        unit["traits"] = traitsObject;
        
        // now push this army data into the new object
        newJSONArmy["armyData"].push(unit);
          
    // now write out the updated file
    let newJSONData = JSON.stringify(newJSONArmy, replacer, 2);
    
    // write file to disk
    fs.writeFileSync(resultsFilePath, newJSONData);
  
  });
  
});