// main.js

/**
 * @author Fedy Cherif
 * 
 * The code for the GUI was mostly taken from:
 * https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
 * 
 * All the code for the AI was not taken from anywhere outside.
 * Not a single framework was used in the making of this.
 * 
 */

/**
 * @type {Object} MachineLearning - the object for everything in the machine learning data
 */
var MachineLearning = {};


/**
 * @static MachineLearning
 * @property {Object} Data - the Data side of the machine learning project
 */
MachineLearning.Data = {};

    
/**
 * @class MachineLearning.Vector2 - This is a class for 2 points
 */
MachineLearning.Vector2 = function (x,y) {
  
  /**
   * @class MachineLearning.Vector2
   * @property {number} x - the x point for the class
   */
  this.x = x;
  
  /**
   * @class MachineLearning.Vector2
   * @property {number} y - the y point for the class
   */
  this.y = y;
};

/**
 * @static MachineLearning
 * @property {Object} GUI - the graphical user interface side of the machine learning project
 */
MachineLearning.GUI = {
  
  /**
   * @type {HTMLCanvasElement} canvas - this is the main canvas of the GUI side
   */
  canvas: undefined,
  
  /**
   * @type {CanvasRenderingContext2D} ctx - this is the main canvas drrawing of the GUI side
   */
  ctx: undefined, 
  
  /**
   * @type {Boolean} flag - wether the user is holding down or not
   */
  flag: false,
  
  /**
   * @type {Vector2} prev - the previous position
   */
  prev: new MachineLearning.Vector2(0, 0),
  
  /**
   * @type {Vector2} curr - the current drawing position
   */
  curr: new MachineLearning.Vector2(0, 0),
  
  /**
   * @type {Boolean} dotFlag - another check for when the user is holding down 
   */
  dotFlag: false,
  
  /**
   * @type {HTMLCanvasElement} canvas - this is the new canvas that converts it into squares
   */
  newCanvas: document.createElement("canvas"),
  
  
  /**
   * @type {HTMLCanvasElement} canvas - this is the new canvas that converts it into squares
   */
  imageCanvas: document.createElement("canvas"),
  
  /**
   * @type {string} squishedUrl - the image 
   */
  squishedUrl: "",
  
  /**
   * @type {object} points - the two points to where it starts and ends
   */
  points: {
    smallest: new MachineLearning.Vector2(null, null),
    highest: new MachineLearning.Vector2(null, null)
  }
  
};

/**
 * @static MachineLearning.Data
 * @method ctxStretchAndFitImage - this stretches the drawn image into the computer image
 * @return {CanvasRenderingContext2D} imageCtx - the canvas that returns the drawing 
 */
MachineLearning.Data.ctxStretchAndFitImage = function () {
  var yPosition = MachineLearning.GUI.points.smallest.y || 0, 
    xPosition = MachineLearning.GUI.points.smallest.x || 0,
    widthSize = MachineLearning.GUI.points.highest.x != null ? MachineLearning.GUI.points.highest.x - MachineLearning.GUI.points.smallest.x : 48,
    heightSize = MachineLearning.GUI.points.highest.y != null ? MachineLearning.GUI.points.highest.y - MachineLearning.GUI.points.smallest.y : 48;
  // sets the initial dimension of the image
  
  var rectangleData = MachineLearning.GUI.ctx.getImageData(xPosition, yPosition, widthSize, heightSize);
  // gets all the pixel data
  
  var newCtx = MachineLearning.GUI.newCanvas.getContext("2d");
  // gets a different canvas to draw the image
  
  MachineLearning.GUI.newCanvas.width = widthSize;
  MachineLearning.GUI.newCanvas.height = heightSize;
  // sets the dimensions of the different canvas
  
  newCtx.clearRect(0, 0, widthSize, heightSize);
  newCtx.putImageData(rectangleData, 0, 0);
  // clears the different canvas (incase of previous use) and renderes the drawing object
  
  var dataUrl = MachineLearning.GUI.newCanvas.toDataURL();
  // gets the base64 data of the canvas
  
  var imageCtx = MachineLearning.GUI.imageCanvas.getContext("2d");
  // gets the main image context
  
  MachineLearning.GUI.imageCanvas.width = MachineLearning.GUI.imageCanvas.height = 48;
  // resets the size of the image canvas
  
  var tempImg = new Image();
  // creates a new image
  
  tempImg.src = dataUrl;
  MachineLearning.GUI.squishedUrl = dataUrl;
  // stores the base64 data of the current image
  
  imageCtx.clearRect(0, 0, 48, 48);
  imageCtx.drawImage(tempImg, 0, 0, 48, 48);
  // redraws the current image
  
  return imageCtx;
};

/**
 * @static MachineLearning.GUI
 * @method init - this sets up the GUI of the machine learning (connects buttons and text)
 */
MachineLearning.GUI.init = function () {
  
  MachineLearning.GUI.canvas = document.getElementById('canvas');
  MachineLearning.GUI.ctx = MachineLearning.GUI.canvas.getContext("2d");
  // gets the canvas information
  
  w = MachineLearning.GUI.canvas.width;
  h = MachineLearning.GUI.canvas.height;
  // and stores the dimensions into the w and h variable

  MachineLearning.GUI.canvas.addEventListener("mousemove", function (e) {
    MachineLearning.GUI.findxy('move', e)
  }, false);
  // sets the mouse move event
  
  MachineLearning.GUI.canvas.addEventListener("mousedown", function (e) {
    MachineLearning.GUI.findxy('down', e)
  }, false);
  // sets the mouse down event
  
  MachineLearning.GUI.canvas.addEventListener("mouseup", function (e) {
    MachineLearning.GUI.findxy('up', e)
  }, false);
  // sets the mouse up event
  
  MachineLearning.GUI.canvas.addEventListener("mouseout", function (e) {
    MachineLearning.GUI.findxy('out', e)
  }, false);
  // sets the mouse out event
  
  MachineLearning.GUI.newCanvas.style.display = MachineLearning.GUI.imageCanvas.style.display = "none";
  // hides both of the new canvases
  
  document.body.appendChild(MachineLearning.GUI.newCanvas);
  document.body.appendChild(MachineLearning.GUI.imageCanvas);
  // adds the new canvases
};

/**
 * @static
 * @method draw - a function to draw the line 
 */
MachineLearning.GUI.draw = function () {
  
  MachineLearning.GUI.ctx.beginPath();
  // begins the line
  
  MachineLearning.GUI.ctx.moveTo(MachineLearning.GUI.prev.x / 4, MachineLearning.GUI.prev.y / 4);
  MachineLearning.GUI.ctx.lineTo(MachineLearning.GUI.curr.x / 4, MachineLearning.GUI.curr.y / 4);
  // sets the line position
  
  MachineLearning.GUI.ctx.strokeStyle = "black";
  MachineLearning.GUI.ctx.lineWidth = 2;
  MachineLearning.GUI.ctx.stroke();
  // sets the visual part of the line
  
  MachineLearning.GUI.ctx.closePath();
  // ends the line
  
  MachineLearning.GUI.setPointsFor(MachineLearning.GUI.curr.x / 4, MachineLearning.GUI.curr.y / 4);
  // updates the MachineLearning.GUI.prev values
  
}

/**
 * @static MachineLearning.GUI
 * @method clearCanvasFrame - a function to clear the canvas more efficiently
 */
MachineLearning.GUI.clearCanvasFrame = function () {
  
  MachineLearning.GUI.points = {
    smallest: new MachineLearning.Vector2(null, null),
    highest: new MachineLearning.Vector2(null, null)
  };
  // resets the mouse positions (for the squishing points)
  
  MachineLearning.GUI.ctx.clearRect(0, 0, w, h);
  // clears the actual left over canvas
  
};

/**
 * @static MachineLearning.GUI
 * @method setPointsFor - stores the squished values
 */
MachineLearning.GUI.setPointsFor = function (x, y) {
  if (MachineLearning.GUI.points.smallest.x == null && MachineLearning.GUI.points.smallest.y == null) {
    // if the smallest points are undefined
    
    MachineLearning.GUI.points.smallest = new MachineLearning.Vector2(x, y);
    // it defines them
    
  } else {
    
    if (MachineLearning.GUI.points.smallest.x > x) {
      // checks if the smallest x should be updated
      
      MachineLearning.GUI.points.smallest.x = x;
      // updates the values
      
    } 
    if (MachineLearning.GUI.points.smallest.y > y) {
      // checks if the smallest y should be updated
      
      MachineLearning.GUI.points.smallest.y = y;
      // updates the values
    }
    
  }
  if (MachineLearning.GUI.points.highest.x == null && MachineLearning.GUI.points.highest.y == null) {
    // if the highest points are undefined
    
    MachineLearning.GUI.points.highest = new MachineLearning.Vector2(x, y);
    // it defines them
    
  } else {
    
    if (MachineLearning.GUI.points.highest.x < x) {
      // checks if the highest x should be updated
      
      MachineLearning.GUI.points.highest.x = x;
      // updates the values
    } 
    
    if (MachineLearning.GUI.points.highest.y < y) {
      // checks if the highest y should be updated
      
      MachineLearning.GUI.points.highest.y = y;
      // updates the values
    }
    
  }
};

/**
 * @static MachineLearning.GUI
 * @method findxy - a method used to manage the drawing system in the program (recycled from: https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse) 
 * @param {string} res - the method for how to manage the data of exclusive type ("down", "out", "up", "move")
 * @param {Event} e - the event responder
 */
MachineLearning.GUI.findxy = function (res, e) {
  
  if (res == 'down') {
    // checks if the mouse is down
    
    MachineLearning.GUI.prev.x = MachineLearning.GUI.curr.x;
    MachineLearning.GUI.prev.y = MachineLearning.GUI.curr.y;
    MachineLearning.GUI.curr.x = (e.clientX + document.scrollingElement.scrollLeft) - MachineLearning.GUI.canvas.offsetLeft;
    MachineLearning.GUI.curr.y = (e.clientY + document.scrollingElement.scrollTop) - MachineLearning.GUI.canvas.offsetTop;
    // sets the initial locations for drawing

    MachineLearning.GUI.flag = true;
    MachineLearning.GUI.dotFlag = true;
    // enables drawing in the system
    
    if (MachineLearning.GUI.dotFlag) {
      // if it can draw
      
      MachineLearning.GUI.ctx.beginPath();
      MachineLearning.GUI.ctx.fillStyle = "black";
      MachineLearning.GUI.setPointsFor(MachineLearning.GUI.curr.x / 4, MachineLearning.GUI.curr.y / 4);
      MachineLearning.GUI.ctx.fillRect(MachineLearning.GUI.curr.x / 4, MachineLearning.GUI.curr.y / 4, 2, 2);
      MachineLearning.GUI.ctx.closePath();
      // draws the actual line
      
      MachineLearning.GUI.dotFlag = false;
      // disables the dot flag for if it was clicked rather than held
    }
  }
  if (res == 'up' || res == "out") {
    // checks if the user released or left the canvas
    
    MachineLearning.GUI.flag = false;
    // disables the drawing abilities
    
  }
  if (res == 'move') {
    // checks if the mouse is moving
    
    if (MachineLearning.GUI.flag) {
      // and the system wants to draw
      
      MachineLearning.GUI.prev.x = MachineLearning.GUI.curr.x;
      MachineLearning.GUI.prev.y = MachineLearning.GUI.curr.y;
      MachineLearning.GUI.curr.x = (e.clientX + document.scrollingElement.scrollLeft) - MachineLearning.GUI.canvas.offsetLeft;
      MachineLearning.GUI.curr.y = (e.clientY + document.scrollingElement.scrollTop) - MachineLearning.GUI.canvas.offsetTop;
      // gets the position
      
      MachineLearning.GUI.draw();
      // draws the line on it's own
      
    }
  }
  
};

MachineLearning.GUI.init();
// this opens the GUI side of the machine learning

/**
 * @static MachineLearning.Data
 * @type {object} accuracy - the comparison of success vs trials
 */
MachineLearning.Data.accuracy = {
  
  // the success values
  value: 0,
  
  // the total trial values
  trials: 0
};

/**
 * @static MachineLearning.Data
 * @type {object} data - the comparison of success vs trials
 */
MachineLearning.Data.knowledge = {
  
  /**
   * @type {[[number]]} A - all the values stored for A
   */
  A: [],
  
  /**
   * @type {[[number]]} B - all the values stored for B
   */
  B: [],
  
  /**
   * @type {[[number]]} C - all the values stored for C
   */
  C: [],
  
  /**
   * @type {[[number]]} D - all the values stored for D
   */
  D: []
};

if (localStorage.getItem("machine-learning-2-data-saved-item") != null && 
  localStorage.getItem("machine-learning-2-data-saved-accuracy") != null) {
  // checks that both the data and the accuracy was saved
    
  MachineLearning.Data.knowledge = JSON.parse(localStorage.getItem("machine-learning-2-data-saved-item"));
  // gets the data from the machine learning
  
  MachineLearning.Data.accuracy = JSON.parse(localStorage.getItem("machine-learning-2-data-saved-accuracy"));
  // gets the accuracy data
}

/**
 * @static MachineLearning.Data
 * @method dataBasedGuess - a method to get a guess from using all the data rather than the average
 * @param {[number]} givenValue - an input for what to guess
 * @returns {object} lowest - the letter that is created from the guess
 */
MachineLearning.Data.dataBasedGuess = (givenValue)=>{
  
  var writtenData = givenValue || MachineLearning.Data.createValue();
  // gets the value of the data
  
  var lowestPoints = {};
  // an object that contains the smallest values
  
  if (writtenData.join() != ([0,0,0,0,0,0,0,0,0]).join()) {
    // checks that it is not an empty canvas
    
    for (var letter in MachineLearning.Data.knowledge) {
    // a for loop for all the letters
      
      var totalAccuracy = [];
      // stores the total accuracy
      
      for (var i in MachineLearning.Data.knowledge[letter]) {
        // for loops through each peice of data
        
        var accuracy = [];
        // an array to store the accuracy
        
        if (MachineLearning.Data.knowledge[letter][i] !== null && MachineLearning.Data.knowledge[letter][i].join() != ([0,0,0,0,0,0,0,0,0]).join()) {
          // checks if the piece of data is not defined
          
          for (var j in writtenData) {
            // loops through all the data
            
            accuracy.push(Math.abs(MachineLearning.Data.knowledge[letter][i][j] - writtenData[j]));
            // adds the difference to the accuracy
            
            if (totalAccuracy[j] == undefined || totalAccuracy[j] > accuracy[j]) {
              // checks if the data is either not defined or the current piece of data is smaller
              
              totalAccuracy[j] = accuracy[j];
              // stores the accuracy point
            }
          }
          
        }
        
      }
      
      var combinedAccuracy = 0;
      // this is a variable to have a number for all the accuracy
      
      for (var totalAccuracyData of totalAccuracy) {
        // this loops through the accuracy data
        
        combinedAccuracy += totalAccuracyData;
        // adds to the combined accuracy
      }
      
      lowestPoints[letter] = combinedAccuracy;
      // this stores the lowest point for the letter
      
    }
    
  }
  var lowestLetter = "?";
  // a variable that stores the lowest letter
  
  var lowestValue = 10;
  // a variable that stores the lowest letter
  
  for (var letter in lowestPoints) {
    // a for loop for all the letters
    
    if (lowestPoints[letter] < lowestValue) {
      // checks if lowest value is different
      
      lowestValue = lowestPoints[letter];
      // stores the lowest point value
      
      lowestLetter = letter;
      // stores the lowest letter
    }
    
  }
  
  return {
    // returns an object with
    
    letter: lowestLetter,
    // the letter
    
    value: lowestValue,
    // and the assurance of it
    
    points: lowestPoints
    // and the points data
    
  };
  
};

/**
 * @static MachineLearning.Data
 * @method averageOutArray - gets the combined average of all the data for each letter
 * @param {string} letter - the letter of what to get the average from
 * @returns {[number]} array - the averaged out value of all the data from the letter
 */
MachineLearning.Data.averageOutArray = (letter)=>{
  
  var array = MachineLearning.Data.knowledge[letter][0];
  // creates a new array of size of a value
  
  for (var i in MachineLearning.Data.knowledge[letter]) {
    // loops through every single data set in the letter
    
    for (var j in MachineLearning.Data.knowledge[letter][i]) {
      // loops for each chunk in a data set
      
      array[j] = ((MachineLearning.Data.knowledge[letter][i][j] * 1000) + (array[j] * 1000)) / 2000;
      // stores the value of the data set by getting the average of the chunk in a data set and the current value of the data set
      
    }
  }
  
  // returns the averaged out array 
  return array;
};

/**
 * @static MachineLearning.Data
 * @method createValue - creates the value from the canvas
 * @returns {[number]} dataSample - either returns an empty array of 0s or the real data from the canvas
 */
MachineLearning.Data.createValue = ()=>{
  
  var dataSample = [];
  // creates a new array to return
  
  var tempCtx = MachineLearning.Data.ctxStretchAndFitImage();
  // gets the squished image
  
  for (var x = 0; x < 3; x++) {
    // a for loop to check the 3 chunks of the x axis
    
    for (var y = 0; y < 3; y++) {
      // a for loop to check the 3 chunks of the y axis per x axis
      
      var imageData = tempCtx.getImageData(x * 16, y * 16, 16, 16).data;
      // gets an individual image chunk
      
      var firstSize = imageData.length;
      // gets all the pixels of the image (to calculate percentage darkness of the chunk)
      
      var secondSize = imageData.filter(e=>{return e > 0}).length;
      // gets all the dark pixels
      
      dataSample.push(Math.floor((secondSize / firstSize) * 100000) / 100000);
      // divides the firstSize and secondSize to create the percentage darkness and puts it in the data sample
      
    }
  }
  return dataSample.length == 9 ? dataSample : [0,0,0,0,0,0,0,0,0];
  // returns the dataSample if the data exists
};

/**
 * @static MachineLearning.Data
 * @method combinedAccuracy - tests all the data for all the letters to get the Accuracy
 */
MachineLearning.Data.combinedAccuracy = ()=>{
  
  var obj = {};
  // sets the object for data
  
  for (var key of Object.getOwnPropertyNames(MachineLearning.Data.knowledge)) {
    // loops through each letter
    
    obj[key] = MachineLearning.Data.testPreviousData(key);
    // gets the test data for each letter
    
  }
  return obj;
  // returns the object
  
};

/**
 * @static MachineLearning.Data
 * @method testPreviousData - a function to test all the data that existed before
 * @param {string} letter - the letter to test
 * @returns {Object} obj - the return data
 */
MachineLearning.Data.testPreviousData = (letter)=>{
  
  var points = {A: 0, B: 0, C: 0, D: 0};
  // stores the initial acuracy for each letter
  
  for (var test of MachineLearning.Data.knowledge[letter]) {
    // loops through all the previous letters that exist
    
    points[
      (
        !MachineLearning.Data.isUsingDataBasedGuess ? 
        MachineLearning.Data.guess(test) : 
        MachineLearning.Data.dataBasedGuess(test).letter
        // guesses the letter based on either averaged data or compiled data
      )
    ] += 1;
    // adds one point
    
  }
  var percentAccuracy = points[letter] / (points.A + points.B + points.C + points.D);
  // gets the percentage accuracy of the test
  
  return {
    points,
    percentAccuracy
  };
  // returns the points total and accuracy
  
};

/**
 * @static MachineLearning.Data
 * @method guess - a method to guess the letter that was drawn
 * @returns {string} highestKey - the highest probablity for the letter (default: "?")
 */
MachineLearning.Data.guess = (givenValue)=>{
  
  var value = givenValue || MachineLearning.Data.createValue();
  // this is a value of either the parameter or the value of the image
  
  var normalSizeCounter = 0;
  // this is a variable to see if it should return null
  
  for (var val of value) {
    // a for loop comparing all values of the input
    
    if (val > 0.5) {
      // checks if the value is normal sized
      
      normalSizeCounter += 2;
      // adds two to the counter to say that it does pass 
      
    } else if (val > 0.05) {
      // checks if the value is not too small
      
      normalSizeCounter += 1;
      // adds one to the counter to say that it does pass 
    }
    
  }
  
  if (normalSizeCounter < 3) return "?";
  // checks if the should return null is what it should do and then returns it to stop more code
  
  var differences = {};
  // an object that contains the differences between the letters
  
  var letters = Object.getOwnPropertyNames(MachineLearning.Data.knowledge);
  // gets all the main letters (A,B,C,D)
  
  for (var letter of letters) {
    // loops through all the letters
    
    var average = MachineLearning.Data.averageOutArray(letter);
    // gets the average of that letter
    
    differences[letter] = [];
    // stores a chunk of data for 
    
    for (var i in average) {
      // loops through each point in the average
      
      var newElement = average[i] - value[i];
      // gets the difference of the average and the current value
      
      differences[letter][i] = newElement < 0 ? -newElement : newElement;
      // sets the difference for the letter
    }
  }
  
  var points = {};
  // an object to see which letter has the closest data to the
  
  for (var i in value) {
    // loops through all 4 letters
    
    var lowest = 1;
    var letterToTheLowest;
    // sets default values for the lowest letter value
    
    for (var letter of letters) {
      // loops through all the letters
      
      if (points[letter] == undefined) {
        // if the points don't have data for each letter
        
        points[letter] = 0;
        // it defines it
      }
      if (lowest > differences[letter][i]) {
        // checks if the difference between the letter data and lowest
        
        lowest = differences[letter][i];
        letterToTheLowest = letter;
        // updates the lowest value and stores the letter
        
      }
    }
    
    if (letterToTheLowest != undefined) {
      // if the letter to the lowest was found
      
      points[letterToTheLowest] += (1 - lowest);
      // add a point to the letter found to boost it's chance of being chosen
      
    }
    
    
  }
  
  var highestLetter = "?";
  var highestPoint = 0;
  // sets default values for the highest letter value
  
  for (var letter of letters) {
    // loops through all the letters
    
    if (points[letter] > highestPoint && letter !== highestLetter) {
      // checks if the guesser found a letter with a higher guess 
      
      highestKey = letter;
      highestPoint = points[letter];
      // updates the data
      
    } 
  }
  
  return highestKey;
  // returns the highest letter
};

/**
 * @static MachineLearning.Data
 * @method learnTheData - this learns the data by storing the drawing into the system and updates the ui
 */
MachineLearning.Data.learnTheData = ()=>{
  
  var text = document.getElementById('text-letter');
  // gets the text element for the next letter
  
  if ((!MachineLearning.Data.isUsingDataBasedGuess ? MachineLearning.Data.guess() : MachineLearning.Data.dataBasedGuess().letter) == text.innerText) {
    // checks if the guess was correct
    
    MachineLearning.Data.accuracy.value += 1;
    // adds one to the success values
    
  }
  
  MachineLearning.Data.accuracy.trials += 1;
  // adds one to the number of trials
  
  
  MachineLearning.Data.knowledge[text.innerText].push(MachineLearning.Data.createValue());
  // stores the data for the letter
  
  if (text.innerText.includes("A")) {
    // checks if the letter to draw was A
    
    text.innerText = text.innerText.replace("A", "B")
    // changes it to B
    
  } else if (text.innerText.includes("B")) {
    // checks if the letter to draw was B
    
    text.innerText = text.innerText.replace("B", "C")
    // changes it to C
    
  } else if (text.innerText.includes("C")) {
    // checks if the letter to draw was C
    
    text.innerText = text.innerText.replace("C", "D")
    // changes it to D
    
  } else if (text.innerText.includes("D")) {
    // checks if the letter to draw was D
    
    text.innerText = text.innerText.replace("D", "A")
    // changes it to A
    
  }
  
  
  localStorage.setItem("machine-learning-2-data-saved-item", JSON.stringify(MachineLearning.Data.knowledge));
  // stores all the data set
  
  localStorage.setItem("machine-learning-2-data-saved-accuracy", JSON.stringify(MachineLearning.Data.accuracy));
  // stores the accuracy
  
  MachineLearning.GUI.clearCanvasFrame();
  // clears the drawing canvas
  
  for (var letter of Object.getOwnPropertyNames(MachineLearning.Data.knowledge)) {
    // loops through all the letters
    
    MachineLearning.Data.displayValueIn(
      // this dislays the value for the
      
      document.getElementById("value-canvas-" + letter.toLowerCase()),
      // canvas of that letter
      
      MachineLearning.Data.averageOutArray(letter)
      // and the data that goes with
    );
    
    document.getElementById("value-text-" + letter.toLowerCase()).innerText = `Amount of data: ${MachineLearning.Data.knowledge[letter].length} (~${Math.floor(((MachineLearning.Data.knowledge[letter].length * ((9 * 7) + 3)) - 1) / 100) / 10} KB)`;
    // writes down the amount of data there is
    
  }
};

/**
 * @static MachineLearning.Data
 * @property {Boolean} isUsingDataBasedGuess - a variable if the gussing algorithm should use data based
 */
MachineLearning.Data.isUsingDataBasedGuess = true;

MachineLearning.GUI.guessUI = ()=>{
  
  var createdValue = MachineLearning.Data.createValue();
  // gets the created value
  
  document.getElementById("current-value-text").innerText = createdValue.join(", ")
  document.getElementById('guess-text').innerText = !MachineLearning.Data.isUsingDataBasedGuess ? MachineLearning.Data.guess(createdValue) : MachineLearning.Data.dataBasedGuess(createdValue).letter;
  document.getElementById("accuracy-text").innerText = 'Accuracy: ' + Math.floor((MachineLearning.Data.accuracy.value / MachineLearning.Data.accuracy.trials) * 100).toString() + "%";
  //document.getElementById('guess-text').innerText = 'Guess: ' + MachineLearning.Data.guess() + ', 
};

/**
 * @static MachineLearning.Data
 * @method displayValueIn - a method used to show the 9 float array in a 3 by 3 pixel square
 * @param {HTMLCanvasElement} differentCanvas - the canvas for where it wants to render the value
 * @param {[number]} value - the 9 float array for the 3 by 3 square
 */
MachineLearning.Data.displayValueIn = (differentCanvas, value)=>{
  
  var ctx2 = differentCanvas.getContext("2d");
  // gets the context of the canvas to render it
  
  ctx2.clearRect(0, 0, 48, 48);
  // clears it if anything was rendered previously
  
  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      // loops through the x and y of the 3
      
      var currentValue = (Math.floor((1 - (value[(x * 3) + y])) * 255));
      // gets the current value of the nested for loop
      
      ctx2.fillStyle = "rgb(" +[ currentValue , currentValue , currentValue].join(",") + ")";
      // generates a color for the user to see from the value
      
      ctx2.fillRect(x * 16, y * 16, 16, 16);
      // renders the pixel
    }
  }
}

/**
 * @static MachineLearning.Data
 * @method recieveData - this is a function used to get the string data of the saved code
 * @returns {string} data - the data in string form
 */
MachineLearning.Data.recieveData = ()=>{
  
  return JSON.stringify(MachineLearning.Data.knowledge);
  // returns the stringified data
};

/**
 * @static MachineLearning.Data
 * @method download - a function to download the data
 */
MachineLearning.Data.download = ()=>{
  
  var textBlob = new Blob([MachineLearning.Data.recieveData()], { type:"text/plain" });
  // creates a new blob with the json data
  
  var link = document.createElement("a");
  // creates a link element
  
  link.download = "ml-letter-download.json";
  // sets the suggested file name
  
  link.innerHTML = "Download File";
  // random extra test
  
  if (window.URL !== null) {
    // checks which version of browser
    
    link.href = window.URL.createObjectURL(textBlob);
    // creates the file location
    
  } else {
    
    link.href = window.URL.createObjectURL(textBlob);
    // creates the file location
    
    link.onclick = destroy;
    // makes it deleted when clicked
    
    link.style.display = "none";
    // hides the link
    
    document.body.appendChild(link);
    // adds it to the body
  }
  link.click();
  // then clicks it
  
};

/**
 * @static MachineLearning.GUI
 * @method displaySquishedImage - a function used to display a squished image
 */
MachineLearning.GUI.displaySquishedImage = function () {
  
  var squishedCanvas = document.getElementById("value-squished");
  // gets the squished canvas
  
  var squishedCtx = squishedCanvas.getContext("2d");
  // gets the image data of the squished canvas
  
  squishedCtx.clearRect(0, 0, 48, 48);
  // clears the squished canvas
  
  var tempImg = new Image();
  // this gets an image to store
  
  tempImg.src = MachineLearning.GUI.squishedUrl;
  // gets the image sourced
  
  squishedCtx.drawImage(tempImg, 0, 0, 48, 48);
  // draws the squished image
  
  squishedCtx.globalAlpha = 0.2;
  // makes it a little bit transparent to add the squares for each section
  
  for (var x = 0; x < 3; x++) {
    // a for loop for the x axis
    
    for (var y = 0; y < 3; y++) {
      // a for loop for the y axis
      
      squishedCtx.strokeRect(x * 16, y * 16, 16, 16);
      // draws a rectangle with the outline
      
    }
  }
  squishedCtx.globalAlpha = 1;
  // this makes it not transparent
};

setInterval(()=>{
  // sets a loop for every 400 milliseconds
  
  MachineLearning.GUI.guessUI();
  // updates the UI information
  
  MachineLearning.GUI.displaySquishedImage();
  // renders the squished image
  
  MachineLearning.Data.displayValueIn(document.getElementById("value-canvas"), MachineLearning.Data.createValue());
  // draws the value
  
}, 400);

for (var letter of Object.getOwnPropertyNames(MachineLearning.Data.knowledge)) {
  // loops for all the letters in the data set of the project
  
  MachineLearning.Data.displayValueIn(
    // this dislays the value for the
    
    document.getElementById("value-canvas-" + letter.toLowerCase()),
    // canvas of that letter
    
    MachineLearning.Data.averageOutArray(letter)
    // and the data that goes with
  );
  
  document.getElementById("value-text-" + letter.toLowerCase()).innerText = `Amount of data: ${MachineLearning.Data.knowledge[letter].length} (~${Math.floor(((MachineLearning.Data.knowledge[letter].length * ((9 * 7) + 3)) - 1) / 100) / 10} KB)`;
  // writes down the amount of data there is
  
}

    