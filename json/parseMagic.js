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
    
// now lets read the JSON data
fs.readFile('raw/magic.json', 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
    } else {

      // parse JSON string to JSON object
      const magicData = JSON.parse(data);
      
      // iterate over each element and modify it
      magicData.forEach(item => {
            
            // iterate over the keys for the character traits
            let traitsObject = {};
            let newKeyArray = ["commander", "champion", "spellcaster"];
            
            newKeyArray.forEach(keyName => {
                
                // add the key and its value in the JSON file to the new object
                traitsObject[keyName] = item[keyName];
                
                // now delete the key
                delete item[keyName];
                
            });
            
            // add it to the JSON object
            item["restrictions"] = traitsObject;

        });
        
        // now write out the updated file
        let newFilePath = 'processed/magic.json';
        let newJSONData = JSON.stringify(magicData, replacer, 2);
        
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
