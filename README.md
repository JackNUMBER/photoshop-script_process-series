From:

![Source files](https://raw.githubusercontent.com/JackNUMBER/ps-process_series/master/readme_images/process_series1.png)

To:

![Output files](https://raw.githubusercontent.com/JackNUMBER/ps-process_series/master/readme_images/process_series2.png)

####IN:
Files: `<nn><a|b|c>.jpg`
nn = number of the serie (01, 02, ...)
a|b|c = file position in the serie (from 1 to 3 element by serie)

####OUT:
Files: `serie_<nn>.jpg` (1 file by serie)

####PROCESS:
Count series.
For each serie, each file is resized and copyed in a layer.
Depending how much files there is in the serie, layer are postioned.
Save file for web.

####LEARNING:
In this script you can learn about:
- user input with prompt
- move a layer
- copy file into another file
- update preferences
- export to web
- and more...
