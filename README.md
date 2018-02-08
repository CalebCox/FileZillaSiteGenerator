# FileZilla Import XML Generator
This application was spawned out of a necessity to setup multiple client Sites within FileZilla in a short period of time. We already had client details setup within Excel spreadsheets that could easily be converted into .CSV files for use. 

This will take .CSV files that follow the specified template, convert it to JSON for ease of use and data manipulation, and will also generate FileZilla Importable XML for quick and easy client site setups.

### CSV Template
|    **name**  |    **host**   |       **port**       |    **username**    |    **password**   |     **directory**   |
|:---------:|:---------:|:----------------:|:--------------:|:-------------:|:----------------:|
| Site Name | Site Host | Site Port Number | Site User Name | Site Password | Remote Directory |