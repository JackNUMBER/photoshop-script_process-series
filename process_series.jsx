/************************************************************************
 Processes files as series
 ************************************************************************
 IN:
 Files: <nn><a|b|c>.jpg
 nn = number of the serie (01, 02, ...)
 a|b|c = file position in the serie (from 1 to 3 element by serie)

 OUT:
 Files: serie_<nn>.jpg (1 file by serie)

 PROCESS:
 Count series.
 For each serie, each file is resized and copyed in a layer.
 Depending how much files there is in the serie, layer are postioned.
 Save file for web.

 ************************************************************************

 In this script you can learn about:
 - user input with prompt
 - move a layer
 - copy file into another file
 - update preferences
 - export to web
 and more...

 ************************************************************************
 Thanks to Habaki from forum.photoshop-school.org for his help (02/02/2012).
 ************************************************************************/

// Settings
var baseResizeHeight = 455, // height resize
    baseCropWidth    = 300, // width crop
    baseCropHeight   = 455, // height crop
    docWidth         = 640, // output file's width
    docHeight        = 960, // output file's height
    docResol         = 300, // output file's resolution (dpi)
    outPath          = "D:/my_series", // default folder
    inputExtension   = "png"; // input file's extensions

// change unit config to px
var unitSaved = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;

// hide dialogs
app.displayDialogs = DialogModes.NO;

/**
 * Move a layer to defined coordinates
 * @param {string} layerName layer name
 * @param {int} posX new X position
 * @param {int} posY new Y position
 */
function moveLayer(layerName, posX, posY) {
    app.activeDocument.layers[layerName].translate(posX,posY);
}

/**
 * Copy file in a new output file's layer
 * @param {string} targetDoc targeted document name
 * @param {string} layerName layer name
 * @param {string} sourceFile source file
 * @return {obj} layer
 */
function layerFromFile(targetDoc, layerName, sourceFile) {
  var layer, selection;

  // open, resize, crop and copy image
  file = open(sourceFile);
  file.resizeImage(null,baseResizeHeight,null,null); // resize input file
  file.resizeCanvas(baseCropWidth,baseCropHeight,null); // crop input file
  selection = file.selection;
  selection.selectAll();
  selection.copy();
  file.close(SaveOptions.DONOTSAVECHANGES);

  // paste image to the output file (new layer)
  layer = targetDoc.paste();
  layer.name = layerName;
  return(layer);
}

/**
 * Export output file
 * @param {string} fileName the output file name
 */
function saveForWebJPG(fileName) {
  var opts = new ExportOptionsSaveForWeb();
  opts.format = SaveDocumentType.JPEG;
  opts.quality = 100;
  activeDocument.exportDocument(fileName, ExportType.SAVEFORWEB, opts);
}

// main process
try {
  var series = new Array(), serieCount = 0, inputFiles, ouputFile, outputImage;
  var mainPath = File(prompt("Specify the source folder: \nImages will be resized and croped to " + baseCropWidth + "x" + baseCropHeight, outPath));

  // load files
  inputFiles = mainPath.getFiles("*." + inputExtension);

  // define series names and elements per serie
  for (var i in inputFiles) {
    // parseInt will ignore the a|b|c
    // currentSerie = parseInt(inputFiles[i].name, 10);

    // I prefere use replace and slice to keep leadings zero
    currentSerie = inputFiles[i].name.replace('.' + inputExtension, '').slice(0, -1);

    // fill the array with elements per serie count
    if (series[currentSerie] == undefined) {
      // first image from the serie
      series[currentSerie] = 1;
      serieCount++;
    } else {
      series[currentSerie] = series[currentSerie] + 1;
    }
  }

  // display series count
  alert(serieCount + " series found");

  // process series
  for (var currentSerie in series) {
    var outputFile = '',
        inputFileA = '',
        inputFileB = '',
        inputFileC = '';

    ouputFile = File(mainPath + "/serie_" + currentSerie + ".jpg");

    if (ouputFile.exists) {
      // serie already done
      alert("Serie already done: " +  currentSerie);
      continue;
    }

    if (series[currentSerie] > 0) {
      // load first element (a)
      inputFileA = File(mainPath + "/" + currentSerie + "a." + inputExtension);
    }

    if (series[currentSerie] > 1) {
      // load second element (b)
      inputFileB = File(mainPath + "/" + currentSerie + "b." + inputExtension);
    }

    if (series[currentSerie] > 2) {
      // load third element (c)
      inputFileC = File(mainPath + "/" + currentSerie + "c." + inputExtension);
    }

    if (inputFileA.exists && inputFileB.exists && inputFileC.exists) {
      // 3 elements
      // init final document
      outputImage = documents.add(docHeight, docWidth, docResol, currentSerie, NewDocumentMode.RGB, DocumentFill.BACKGROUNDCOLOR);

      // copy layers
      layerFromFile(outputImage, 'A', inputFileA);
      layerFromFile(outputImage, 'B', inputFileB);
      layerFromFile(outputImage, 'C', inputFileC);

      // move layers
      moveLayer('A', -311, 0);
      moveLayer('B', 0, 0);
      moveLayer('C', 311, 0);
    } else if (inputFileA.exists && inputFileB.exists) {
      // 2 elements
      // init final document
      outputImage = documents.add(docHeight, docWidth, docResol, currentSerie, NewDocumentMode.RGB, DocumentFill.BACKGROUNDCOLOR);

      // copy layers
      layerFromFile(outputImage, 'A', inputFileA);
      layerFromFile(outputImage, 'B', inputFileB);

      // move layers
      moveLayer('A', -155, 0);
      moveLayer('B', 156, 0);
    } else if (inputFileA.exists) {
      // 1 elements
      // init final document
      outputImage = documents.add(docHeight, docWidth, docResol, currentSerie, NewDocumentMode.RGB, DocumentFill.BACKGROUNDCOLOR);

      // copy layer
      layerFromFile(outputImage, 'A', inputFileA);

      // move layer
      moveLayer('A', 0, 0);
    }

    if (inputFileA.exists) {
      // export and close document
      saveForWebJPG(ouputFile);
      outputImage.close(SaveOptions.DONOTSAVECHANGES);
    }
  }

  // restore unit config
  preferences.rulerUnits = unitSaved;

alert("Finito :D");
} catch(exception) {
  alert(exception.message)
}
