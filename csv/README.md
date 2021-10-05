## Oathmark csv files

These files are straight csv export from the Numbers spreadsheet that stored all of the formatted data. Since doing the initial export the Numbers spreadsheet has not been used for updates so it is not included since the data isn't up to date. The `.csv` files should be considered the canonical source of data.

### Data notes

There are several additional columns that are not from the data in the rulebooks.
* `unitPoints` is used in the Oathmark Army Builder to store the current point value including options. This isn't displayed to the user.
* `hero` is deprecated and included only because an old version of the web app uses it
* `spellcaster` is an integer value from 0-5. 0 indicates that the unit is not a spellcaster and a positive value is the level of spellcasting the model has. 
* `spells` is a comma delimited list of the Spell Schools the model has access to. 
* `magic` determines if the model can have magic items
* `min` and `max` are the minimum and maximum unit sizes

### convert.sh
The `convert.sh` shell script uses the node library `csvtojson` to convert each `.csv` file to a `.json` file and copy it to the ../json/raw/ directory. 