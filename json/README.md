## Oathmark JSON files

These files are available in several formats each in a different directory. There are also several Javascript tools that are used to build and interact with these files.

### raw 
These files are straight conversions of the `.csv` files using the `csvtojson` node library in command line mode. There is a shell script `convert.sh` in the ./csv directory that will create these files.

### processed
These files have been created using the various javascript files that are in the top-level of the json directory. These files are specifically formatted for the Oathmark Army Builder and may not be of general interest. The directory is currently empty.

### options
Each army in the game has options available for many of the units. As the data has to be stored in a format that is not amenable to csv export they are stored in json format. These option files are read in using the `parseArmyData.js` file and merged into each army list.

### headers
Each army has a small header that is used as a root for each json object. These files are also read in by `parseArmyData.js` and used to build the files that are copied to the Oathmark Army Builder.

### Javascript files
There are several javascript utilities that are built using [node.js](https://nodejs.org/en/) primarily as a way to read and write files. Each file is custom written to process a specific type of file given the unique requirements of each type of data.

Each file does use a `replacer` function to convert all the integer and boolean values in the `.json` files to native values and not double-quoted values. This is just to make it easier to process the data in the web application. 

#### parseArmyData.js
The main utility file. This has three functions:
1. Build a final file, ready for the Oathmark Army Builder, that integrates the data in the /header and /option directories.
2. Format the JSON data into different objects that we will later use in the app. This is primarily used to create logical elements or group similar items for easy access.
3. Split the `special` and `equipment` entries into arrays

#### parseJSON.js
A generic utility to take any json file and strip out double-quoting around the integer and boolean values.

#### parseMagic.js
Takes the traits for each magic item and puts them all into a single `restrictions` key to make it easier to access.

#### parseOptions.js
This file takes the csv data and splits it into items (trimming as it goes) to help build the files in the /options directory. It is currently being developed as the format of the options is still in flux.

#### parseSpells.js
This file takes the raw csv data and converts it into a json formatted object that is organised by spell school. This allows the web app to get all of the Necromancy spells with a single call to the data.