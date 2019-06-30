From:

![Source files](https://raw.githubusercontent.com/JackNUMBER/ps-process_series/master/readme_images/process_series1.png)

To:

![Output files](https://raw.githubusercontent.com/JackNUMBER/ps-process_series/master/readme_images/process_series2.png)

#### INPUTS:
Filename layout: `<nn><a|b|c>.jpg`

`nn` = id of the serie (01, 02, ...)

`a|b|c` = file position in the serie (from one to three elements)

#### OUTPUTS:
One file by serie: `serie_<nn>.jpg`

#### PROCESS:
1. Count series.
2. For each serie, each file is resized and copyed in a layer.
3. Depending how much files there is in the serie, layer are postioned.
4. Save file for web.

#### LEARNING:
In this script you can learn about:
- user input with prompt
- move a layer
- copy file into another file
- update preferences
- export to web
- and more...
