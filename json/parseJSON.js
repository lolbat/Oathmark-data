// command line code run via node to take the 'flat' JSON files
// and create more logically organized files

// this is being written to take advantage of node even though I know next to nothing about it

// require the filesystem and path code in node
const fs = require('fs');
const path = require('path');

// get the filename that we sent
let thisFileName = process.argv.slice(2)[0];
let nameofFile = path.parse(thisFileName).name;

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
        const unitData = JSON.parse(data);
        
        // we will write out the data so that the replacer will strip the quotes from the boolean and integer values
        // now write out the updated file
        let newFilePath = 'processed/' + nameofFile + '.json';
        let newJSONData = JSON.stringify(unitData, replacer, 2);
        
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
