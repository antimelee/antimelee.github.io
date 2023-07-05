var FactorData ={
    targetNumber: 1,
    elementNumber: 36,
    targetLocationX: null,//type: num: 0, 1, -1
    targetLocationY: null,
    orientation: 0,
    spatialPattern: 'random', //type: string
    proximity : null
  }

/* 
    numberFlag: a flag value that determines which kinds of numerical factor data that users are setting
    Meaning of numberFlag: 
        1 - setting the number of target
        2 - setting the number of element
        3 - proximity
*/
var NumberFlag = null;

var LocationFlag = true;

function initializeFactorData()
{
    FactorData ={
        targetNumber: 1,
        elementNumber: 36,
        targetLocationX: null,
        targetLocationY: null,
        orientation: 0,
        spatialPattern: 'random', //type: string
        proximity : null //proximity should be a positive value. The default value is negative, means no proximity
      }; 
}

function setTargetNumber(num)
{
    //reset FactorData
    initializeFactorData();
    FactorData.targetNumber = num;
}

function setProximity(num)
{
    //reset FactorData
    initializeFactorData();
    FactorData.proximity = num;
}
function setElementNumber(num)
{
    initializeFactorData();
    FactorData.elementNumber = num;
}

function setTargetLocation(value){
    initializeFactorData();
    if(LocationFlag)
        FactorData.targetLocationX = value;
    else
        FactorData.targetLocationY = value;
}

function setSpatialPattern(value)
{
    initializeFactorData();
    FactorData.spatialPattern = value;
}

function openModal(modalName, flag) {
    const modal = document.getElementById(modalName);
    modal.style.display = 'block';
    if (modalName == "number_input_window")
        {
            NumberFlag = flag;
        }
    if (modalName == "location_choice_window")
        LocationFlag = flag;
}

function closeModal(modalName) {
    const modal = document.getElementById(modalName);
    modal.style.display = 'none';
}

function submitRadioInput(modalName) {
    const isGridded = document.getElementById('patternChoice1');
    const isRandom = document.getElementById('patternChoice2');
    if(isGridded.checked)
        {
            setSpatialPattern(isGridded.value);
            isGridded.checked = false;
        }
    if(isRandom.checked)
        {
            setSpatialPattern(isRandom.value);
            isRandom.checked = false;
        }
    generateStimulus({},FactorData)
    closeModal(modalName);
    isGridded.checked = false;
    isRandom.checked = false;
}

function submitLocationInput(modalName) {
    const location1 = document.getElementById('locationChoice1');
    const location2 = document.getElementById('locationChoice2');
    const location3 = document.getElementById('locationChoice3');
    const location4 = document.getElementById('locationChoice4');
    var value;
    if(location1.checked)
        value = -1;
    if(location2.checked)
        value = 0;
    if(location3.checked)
        value = 1;
    if(location4.checked)
        value = null;
    setTargetLocation(value);
    generateStimulus({},FactorData)
    closeModal(modalName);
    location1.checked = false;
    location2.checked = false;
    location3.checked = false;
    location4.checked = false;
}

function submitInput(modalName) {
    const input = document.getElementById('number_input').value;
    if(input>0)
    {   if(NumberFlag == 1)
            setTargetNumber(input);
        else if(NumberFlag == 2)
            setElementNumber(input);
        else if(NumberFlag == 3)
            setProximity(parseFloat(input));
    }
    else
        initializeFactorData();
    generateStimulus({},FactorData);
    closeModal(modalName);
}