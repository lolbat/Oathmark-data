// command line code run via node to take the 'flat' JSON files
// and create more logically organized files

// this is being written to take advantage of node even though I know next to nothing about it

// require the filesystem and path code in node
const fs = require('fs');

// get the filename that we sent
let thisFileName = "raw/spells.json";

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
    
// now lets read the JSON data
fs.readFile(thisFileName, 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
    } else {

        // parse JSON string to JSON object
        const spellData = JSON.parse(data);
        
        // now lets sort out the spells into groups so it is easier to access them
        
        // first build a new object to put the data into
        let sortedSpellData = {};
        sortedSpellData["spells"] = {};
        
        let spellSchoolList = ["Dwarf", "Elf", "Orc", "Human", "General", "Goblin", "Necromancer"];
        spellSchoolList.forEach(schoolName => {
          sortedSpellData["spells"][schoolName] = [];
        });

        // now push each spell into an array with the faction name as a key
        spellData.forEach(spell => {
          let schoolName = spell.Race;
          delete spell["Race"];
          sortedSpellData["spells"][schoolName].push(spell);
        });
        
        // we will write out the data so that the replacer will strip the quotes from the boolean and integer values
        // now write out the updated file
        let newFilePath = 'processed/spells.json';
        let newJSONData = JSON.stringify(sortedSpellData, replacer, 2);
        
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
