//default feature setting
const defaultShape = 'rectangle';
const defaultElementColor = '#526da8';
const defaultTargetColor = '#f64932';
const defaultHeightWidthRatio = 2.5;
const defaultOrientation = 'rectangle'; 
const defaultCurvature = false;
const defaultClosure = false;
const defaultIntersection = false;
const defaultTerminator = false;
const ShapeEnum = {
    Rectangle: 'Rectangle',
    Circle: 'Circle',
    Square: 'Square'
  };

//default factor setting
const defaultTargetNumber = 1;
const defaultElementNumber = 81;
const defaultXLocation = null;
const defaultYLocation = null;
const defaultSpatialPattern = null;
const defaultProximity = null;

//Macro const for the stimulus container
const DEFAULT_RECTANGLE_SIZE = [0.233, 0.583]; //width, height
const STIMULUSCONTAINERWIDTH = 8;//inchs
const STIMULUSCONTAINERHEIGHT = 6;
const DPI = 96;// this DPI only works on Wei's screen
// The data structure that store all necessary feature info for an experiment
var Feature ={
  targetShape: "rectangle",
  distractorShape: "rectangle",
  targetColor: "hsl(7, 92%, 50%)",
  distractorColor: "hsl(221, 34%, 50%)",
  tdSizeRatio: 1,//the ratio between target size and distractor size
  tdLengthRatio: 1, //the ratio between target length and distractor length
  targetAngle: 0,
  distractorAngle: 0,
  curvature: null,
  closure: null,
  intersection: null,
  terminator: null
}

// The data structure that store all necessary factor info for an experiment
var Factor ={
  targetNumber: 1,
  elementNumber: 36,
  targetLocation: {}, //Has 4 variables - left, right, top, middle 
  orientation: 0,
  spatialPattern: null, //string: "Gridded", "Randomized"
  proximity : null  // type: float
}

// The data structure that stores all elements
var ElementArray = [];

var ElementsRect = [];

var ElementWidth = 0;

var CSVFileName = "";

function defineFeature(object)
{
    Feature.targetColor = object.targetColor||Feature.targetColor;
    Feature.distractorColor = object.distractorColor||Feature.distractorColor;
    Feature.tdLengthRatio = object.tdLengthRatio||Feature.tdLengthRatio;
    Feature.tdSizeRatio = object.tdSizeRatio||Feature.tdSizeRatio;
    Feature.targetHeight = object.targetHeight;
    Feature.targetAngle = object.targetAngle;//the default value is 0
    Feature.distractorAngle = object.distractorAngle; //the default value is 0
    Feature.distractorShape = object.distractorShape||Feature.distractorShape;
    Feature.targetShape = object.targetShape||Feature.targetShape;
    Feature.curvature = object.curvature||Feature.curvature;
    Feature.intersection = object.intersection||Feature.intersection;
    Feature.terminator = object.terminator||Feature.terminator;
}

function defineFactor(object)
{
    /* 
    All elements are generated through a loop, 
    So each element has an implicit serial number,
    *targets* stores the randoom serial number to randomized the location of targets 
  */
  Factor.targetNumber = object.targetNumber || Factor.targetNumber;
  Factor.elementNumber = object.elementNumber || Factor.elementNumber;
  /*
      The following four variables are used to restrict the position of targets,
      based on user input. The default value is equal to the container size.
    */
  Factor.targetLocation.left = 0;
  Factor.targetLocation.right = STIMULUSCONTAINERWIDTH;
  Factor.targetLocation.top = 0;
  Factor.targetLocation.bottom = STIMULUSCONTAINERHEIGHT;
  switch(object.targetLocationX) {
    case -1: //left
      Factor.targetLocation.left  = 0;
      Factor.targetLocation.right = STIMULUSCONTAINERWIDTH/3;
      break;
    case 0: //middle
      Factor.targetLocation.left  = STIMULUSCONTAINERWIDTH/3;
      Factor.targetLocation.right = 2*STIMULUSCONTAINERWIDTH/3;
      break;
    case 1: //right
      Factor.targetLocation.left = 2*STIMULUSCONTAINERWIDTH/3;
      Factor.targetLocation.right = STIMULUSCONTAINERWIDTH;
      break;
    default:
      break;
  }

  switch(object.targetLocationY) {
    case -1: //top
      Factor.targetLocation.top = 0;
      Factor.targetLocation.bottom = STIMULUSCONTAINERHEIGHT/3;
      break;
    case 0: //middle
      Factor.targetLocation.top  = STIMULUSCONTAINERHEIGHT/3;
      Factor.targetLocation.bottom = 2*STIMULUSCONTAINERHEIGHT/3;
      break;
    case 1: //bottom
      Factor.targetLocation.bottom = STIMULUSCONTAINERHEIGHT;
      Factor.targetLocation.top = 2*STIMULUSCONTAINERHEIGHT/3;
      break;
    default:
      break;
  }
  Factor.spatialPattern = object.spatialPattern || Factor.spatialPattern;
  Factor.proximity = object.proximity || Factor.proximity;
}

function createGriddedStimulus(container,rowNum)
{ 
  var elementHeight = ElementWidth;
  var targetsize = calculateTargetSize();
  var targetWidth = targetsize[0];
  var targetHeight = targetsize[0];
  if(Feature.distractorShape == "rectangle")
    elementHeight = ElementWidth * defaultHeightWidthRatio;
  if(Feature.targetShape == "rectangle")
    targetHeight = targetsize[1]; 
  console.log("element width: " + ElementWidth);
  console.log("element height: " + elementHeight);
  console.log("target width: " + targetWidth);
  console.log("target width: " + targetHeight);
  var elementPaddingH = (STIMULUSCONTAINERWIDTH - rowNum*ElementWidth)/(rowNum+1);
  var elementPaddingV = (STIMULUSCONTAINERHEIGHT - defaultHeightWidthRatio*rowNum*ElementWidth)/(rowNum+1);;
  
  var targetPos = parseInt(Math.random() * (Factor.elementNumber));
  var count = 1;
  for (let i = 0; i < rowNum; i++) 
    for(let j = 0; j < rowNum; j++) {
      const element = document.createElement("div");
      
      let x = (i+1) * (ElementWidth + elementPaddingH)-ElementWidth;
      let y = (j+1) * (elementHeight + elementPaddingV) -elementHeight;
      element.style.position = "absolute";
      element.style.left = `${x}in`;
      element.style.top = `${y}in`;
      if(count == targetPos)
      {console.log("It is the number " + count + ", and it's the target");
        element.classList.add(Feature.targetShape);
        element.style.backgroundColor  = Feature.targetColor;
        element.style.width = `${targetWidth}in`;
        element.style.height = `${targetHeight}in`;
        //rotate target
        element.style.transform = `rotate(${Feature.targetAngle}deg)`;
        if (Feature.targetShape == 'circle')
          element.style.borderRadius = `${targetWidth}in`;
      }
      else
      {
        element.classList.add(Feature.distractorShape);
        element.style.backgroundColor  = Feature.distractorColor;
        element.style.width = `${ElementWidth}in`;
        element.style.height = `${elementHeight}in`;
        element.style.transform = `rotate(${Feature.distractorAngle}deg)`;
        if (Feature.distractorShape == 'circle')
          element.style.borderRadius = `${ElementWidth}in`;
      }
      ElementArray.push(element);
      count++;
      //elements.push({ x, y });
      container.appendChild(element);
  }
}

function calculateTargetSize()
{
    var totalLengthRatio = defaultHeightWidthRatio*Feature.tdLengthRatio;
    var distractorArea = ElementWidth*totalLengthRatio*ElementWidth;
    var targetWidth = Math.sqrt(distractorArea*Feature.tdSizeRatio/(totalLengthRatio));
    var targetHeight = targetWidth*totalLengthRatio;
  return [targetWidth,targetHeight];
}

function createRandomTarget(container)
{
  console.log("target shape: "+ Feature.targetShape);
  var count = 1;
  var targetsize = calculateTargetSize();
  var targetWidth = targetsize[0];
  var targetHeight = targetsize[0];
  if (Feature.targetShape == 'rectangle')
     targetHeight = targetsize[1];
  while(count <= Factor.targetNumber)
  {
    const x = Math.random() * (STIMULUSCONTAINERWIDTH - targetWidth);
    const y = Math.random() * (STIMULUSCONTAINERHEIGHT - targetHeight);
    const rect = { x, y, width: targetWidth, height: targetHeight, isTarget: "true"  };
    if (!checkCollision(rect, ElementsRect) && checkLocation(rect))
    {    
      const target = document.createElement('div');
      target.classList.add(Feature.targetShape);
      target.style.position = "absolute";
      target.style.left = `${rect.x}in`;
      target.style.top = `${rect.y}in`;
      target.style.width = `${targetWidth}in`;
      target.style.height = `${targetHeight}in`;
      //shape determine
      if (Feature.targetShape == 'circle')
        target.style.borderRadius = `${targetWidth}in`;
      target.style.backgroundColor = Feature.targetColor;
      //rotate target
      target.style.transform = `rotate(${Feature.targetAngle}deg)`;
      ElementArray.push(target);
      container.appendChild(target);
      ElementsRect.push(rect);
      count++;
      
      //comment following lines can make the proximity circle disappered
      if(Factor.proximity>0)
      {
        var centerR = Factor.proximity*DPI;
        drawCircle(target,centerR,container);
      }
    }
  }
}


/*
    This function will draw circle around the target when the proximity factor is toggled.
 */
function drawCircle(target,r,container)
{
  const containerRect = container.getBoundingClientRect();
  console.log(containerRect);
  // Create an SVG element
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // Set the SVG attributes (e.g., width, height)
  var realCX = target.getBoundingClientRect().left - containerRect.left + target.getBoundingClientRect().width/2;
  var realCY = target.getBoundingClientRect().top - containerRect.top + target.getBoundingClientRect().height/2;
  svg.setAttribute("width", containerRect.width.toString());
  svg.setAttribute("height", containerRect.height.toString());
  svg.setAttribute("left", containerRect.left.toString());
  svg.setAttribute("top", containerRect.top.toString());
  svg.id = "circle_svg_for_proximity";
  //svg.setAttribute("border", "2px solid red");
  // Create a circle element
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  // Set the circle attributes (e.g., cx, cy, r, fill)
  circle.setAttribute("cx", realCX.toString());
  circle.setAttribute("cy", realCY.toString());
  circle.setAttribute("r", r.toString());
  circle.setAttribute("fill", "white");
  circle.setAttribute("stroke", "black");
  circle.setAttribute("stroke-dasharray", "5,5");

  // Append the circle to the SVG element
  svg.appendChild(circle);
  //svg.style.visibility = "hidden"
  // Append the SVG element to the div
  container.appendChild(svg);
}

function createRandomElements(container)
{
  console.log("element shape: "+ Feature.distractorShape);
  const targetRect = ElementsRect[0];
  var elementHeight = ElementWidth;
  if(Feature.distractorShape == 'rectangle')
    elementHeight = ElementWidth * defaultHeightWidthRatio;
  var count = 1;
  var numOutofTarget = Factor.elementNumber- Factor.targetNumber;
  while (count <= numOutofTarget) {
      const x = Math.random() * (STIMULUSCONTAINERWIDTH - ElementWidth);
      const y = Math.random() * (STIMULUSCONTAINERHEIGHT - elementHeight);
      const rect = { x, y, width: ElementWidth, height: elementHeight, isTarget: "false" };

      if (!checkCollision(rect, ElementsRect) && checkProximity(rect,targetRect)) {
          ElementsRect.push(rect);
          const element = document.createElement('div');
          element.classList.add(Feature.distractorShape);
          element.style.position = "absolute";
          element.style.left = `${rect.x}in`;
          element.style.top = `${rect.y}in`;
          element.style.width = `${ElementWidth}in`;
          element.style.height = `${elementHeight}in`;
          //shape determine
          if (Feature.distractorShape == 'circle')
            element.style.borderRadius = `${ElementWidth/2}in`;
          element.style.backgroundColor  = Feature.distractorColor;
          //rotate element
          element.style.transform = `rotate(${Feature.distractorAngle}deg)`;
          ElementArray.push(element);
          container.appendChild(element);
          count++;
      }
  }
}

function checkLocation(element)
{
  var elementHeight = ElementWidth*defaultHeightWidthRatio;
  return (Factor.targetLocation.left <= element.x + ElementWidth/2
     && Factor.targetLocation.right >= element.x + ElementWidth/2
     && Factor.targetLocation.top  <= element.y + elementHeight/2 
     && Factor.targetLocation.bottom >= element.y + elementHeight/2);
}

function checkCollision(element, elements)
{
  for (const rect of elements) {
    if (
      element.x < rect.x + rect.width &&
      element.x + element.width > rect.x &&
      element.y < rect.y + rect.height &&
      element.y + element.height > rect.y
    ) {
        return true;
    }
  }
  return false;
}

function checkProximity(element, target)
{
  if(Factor.proximity == null)
    return true;
  var dx = element.x + element.width/2-target.x - target.width/2;
  var dy = element.y + element.height/2-target.y - target.height/2;
  return (Math.sqrt(dx**2 +dy**2) >= Factor.proximity);
}

/*
    ***
      This function is only for researchers to sava the random seeds which are haphazardly spread on the canvas
    ***
*/

function saveRandomSeed()
{
  const data = [];
  for(var i = 0; i< ElementsRect.length; i++)
  {
    const element = ElementsRect[i];
    data.push([parseFloat(element.x), parseFloat(element.y), element.isTarget]);
  }

  // Create CSV content
  let csvContent = "left, top, isTarget\r\n";

  data.forEach(row => {
    const csvRow = row.join(",");
    csvContent += csvRow + "\r\n";
  });

  // Create Blob object
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //CSVFileName was assigned in showInfo() function
  var fileName = CSVFileName + ".csv"
    
  // Save the file
  saveAs(blob, fileName);

}

function showInfo(infoContainer,stimulusContainer,factorData)
{
  const stimulusRect = stimulusContainer.getBoundingClientRect();
  infoContainer.style.position = "absolute";
  infoContainer.style.left = `${stimulusRect.left + stimulusRect.width + 20}px`;
  infoContainer.style.top = `${stimulusRect.top}px`;
  var xLocationText = "Free";
  var yLocationText = "Free";
  var spatialPatternText = Factor.spatialPattern||"Free";
  var proximityText = Factor.proximity||"Free"
  switch(factorData.targetLocationY) {
    case -1:
      yLocationText = "top";
      break;
    case 0:
      yLocationText = "middle";
      break;
    case 1:
      yLocationText = "bottom";
      break;
    default:break;
  }
  switch(factorData.targetLocationX) {
    case -1: 
      xLocationText = "left";
      break;
    case 0:
      xLocationText = "middle";
      break;
    case 1:
      xLocationText = "right";
      break;
  }
  var info = "<b>Target number: </b>" + Factor.targetNumber + "<br>" +
             "<b>Element number: </b>" + Factor.elementNumber + "<br>" +
             "<b>Horizontal location restriction: </b>" + xLocationText + "<br>" +
             "<b>Vertical location restriction: </b>" + yLocationText + "<br>" +
             "<b>Spatial pattern: </b>" + spatialPatternText + "<br>" +
             "<b>Proximity: </b>" + proximityText + "<br>";
  CSVFileName = Factor.targetNumber.toString() + "_" + Factor.elementNumber + "_"+ xLocationText + "_"+ yLocationText + "_"+ spatialPatternText + "_"+ proximityText;
  infoContainer.innerHTML = info;
}

function generateStimulus(featureData, factorData) {
  
    defineFeature(featureData);
    defineFactor(factorData);
    console.log(Feature);
    ElementsRect = [];
    // clear the element array
    ElementArray = [];
    // Get the pivot object - the first factor cell
    const firstFactor = document.getElementById("first-factor");
    // Get the stimulus container
    const stimulusContainer = document.getElementById("stimulus-container");
    // Get the stimulus container
    const infoContainer = document.getElementById("info-container");
    // Clear the content
    stimulusContainer.innerHTML = ""
    
    // // Set the pos and size of stimulus container
    const firstFactorRect = firstFactor.getBoundingClientRect();
    let stimulusLeft = firstFactorRect.left + firstFactorRect.width;
    let stimulusTop = firstFactorRect.top;
    stimulusContainer.style.position = "absolute";
    stimulusContainer.style.left = `${stimulusLeft}px`;
    stimulusContainer.style.top = `${stimulusTop}px`;
    stimulusContainer.style.width = `${STIMULUSCONTAINERWIDTH}in`;
    stimulusContainer.style.height = `${STIMULUSCONTAINERHEIGHT}in`;
    stimulusContainer.style.border = "1px solid black";


    showInfo(infoContainer,stimulusContainer,factorData);
    var rowNum = Math.round(Math.sqrt(Factor.elementNumber));

    //The following line can adjust the size according to numbers automatically. But we decided to make elements' size consistent. So it's commented.
    //ElementWidth = STIMULUSCONTAINERHEIGHT/(rowNum*defaultHeightWidthRatio) - 1/rowNum


    ElementWidth = DEFAULT_RECTANGLE_SIZE[0];
    
    if(Factor.spatialPattern == "Gridded")
      createGriddedStimulus(stimulusContainer,rowNum);
    else
      {
        createRandomTarget(stimulusContainer);
        createRandomElements(stimulusContainer);
      }
}
