/*
<javascriptresource>
<name>Switch Sample Mode</name>
<enableinfo>true</enableinfo>
<category>Hirlin Scripts</category>
</javascriptresource>
// Oleksii Hirlin 2021

//Attention! in this version some code were added by romasharf to work only with the eyedropper and only with two of its modes:"All Layers" and "Current Layer"

*/
var includeAllOptions = false; // should be either true or false
// if set to false will switch between 'Current' and 'Current &below' or just switch on / off
// if seet to true will switch between all avaliable variants as well as on / off
// getting currentToolOptions property
function checkCTOoption(charString, isIdTypeString){
    var ref = new ActionReference();
        ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("tool"));
        ref.putEnumerated(stringIDToTypeID("application"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
    if (charString=="eyeDropperSampleSheet"){
        return executeActionGet(ref).getObjectValue(stringIDToTypeID("currentToolOptions")).getInteger(stringIDToTypeID(charString));
    }
    if (isIdTypeString==true){
        return executeActionGet(ref).getObjectValue(stringIDToTypeID("currentToolOptions")).getBoolean(stringIDToTypeID(charString));
    } else {
        return executeActionGet(ref).getObjectValue(stringIDToTypeID("currentToolOptions")).getBoolean(charIDToTypeID(charString));
    }
}
// get current tool options object
function getCTO(){
    var ref = new ActionReference();
        ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("tool"));
        ref.putEnumerated(stringIDToTypeID("application"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
        return executeActionGet(ref).getObjectValue(stringIDToTypeID("currentToolOptions"));
}
// setting currentToolOptions with options array
function setCTO( options, isIdTypeString ){
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
            ref.putClass( stringIDToTypeID( app.currentTool ) );
        desc.putReference( stringIDToTypeID( "target" ), ref );
        // getting current tool options so that they do not get reset
        var ctoObj = getCTO();
            // check if we are setting the eyedropper tool
            if ( app.currentTool=="eyedropperTool" ){
                ctoObj.putInteger( stringIDToTypeID( options[0][0] ), options[0][1] );
            } else {
                // iteration through options array and putting booleans into cto descriptor
                for (var i=0; i < options.length; i++){
                    if (isIdTypeString==true){
                        ctoObj.putBoolean( stringIDToTypeID( options[i][0] ), options[i][1] );
                    } else {
                        ctoObj.putBoolean( charIDToTypeID( options[i][0] ), options[i][1] );
                    }
                }
            }
        desc.putObject( stringIDToTypeID( "to" ), stringIDToTypeID( "currentToolOptions" ), ctoObj );
    executeAction( stringIDToTypeID( "set" ), desc, DialogModes.NO );
}
// switching currentToolOptions if it's one of the tools, ignoring otherwise
function switchCTO (){
    if ( app.currentTool=="magicStampTool" || app.currentTool=="cloneStampTool" ){
        if ( checkCTOoption("StmA")==true && checkCTOoption("StmB")==false && checkCTOoption("StmS")==false ){
            // if 'Current' set to 'Current and below'
            setCTO( [ ["StmA",true], ["StmB",true], ["StmS",true] ] );
        }
        else if ( checkCTOoption("StmA")==true && checkCTOoption("StmB")==true && checkCTOoption("StmS")==true && includeAllOptions==true ){
            // if 'current & below' set to 'all layers'
            setCTO( [ ["StmA",true], ["StmB",false], ["StmS",true] ] );
        }
        else {
            // otherwise set it to 'Current'
            setCTO( [ ["StmA",true], ["StmB",false], ["StmS",false] ] );
        }
    }
    else if ( app.currentTool=="magicLassoTool" || app.currentTool=="wetBrushTool" || app.currentTool=="recomposeSelection" ){
        if ( checkCTOoption("sampleAllLayers", true)==false ){
            setCTO( [ ["sampleAllLayers", true] ], true );
        } else {
            setCTO( [ ["sampleAllLayers", false] ], true );
        }
    }
    else if ( app.currentTool=="quickSelectTool" ){
        if ( checkCTOoption("quickSelectSampleAllLayers", true)==false ){
            setCTO( [ ["quickSelectSampleAllLayers", true] ], true );
        } else {
            setCTO( [ ["quickSelectSampleAllLayers", false] ], true );
        }
    }
    else if ( app.currentTool=="magicWandTool" ){
        if ( checkCTOoption("windowsSystem", true)==false ){
            setCTO( [ ["windowsSystem", true] ], true );
        } else {
            setCTO( [ ["windowsSystem", false] ], true );
        }
    }
    else if ( app.currentTool=="spotHealingBrushTool" ){
        if (checkCTOoption("StmS")==true){
            setCTO( [ ["StmS",false] ] );
        } else {
            setCTO( [ ["StmS",true] ] );
        }
    }
    else if ( app.currentTool=="patchSelection" && checkCTOoption("contentAware", true)==true ){
        if ( checkCTOoption("sampleAllLayers", true)==false ){
            setCTO( [ ["sampleAllLayers", true] ], true );
        } else {
            setCTO( [ ["sampleAllLayers", false] ], true );
        }
    }
    else if ( app.currentTool=="eyedropperTool" ){
        /* 
        current layer = 1
        cur & below = 3
        all layers = 0
        all layers no adj = 6
        cur & below no adj = 8
        */
        if ( checkCTOoption("eyeDropperSampleSheet")==1 ) {
            setCTO( [ ["eyeDropperSampleSheet", 0] ] ); //romasharf changed 3 to 0
        } else if ( checkCTOoption("eyeDropperSampleSheet")==3 ) {
            if ( includeAllOptions==true ){
                setCTO( [ ["eyeDropperSampleSheet", 0] ] );
            } else {
                setCTO( [ ["eyeDropperSampleSheet", 1] ] );
            }
        } else if ( checkCTOoption("eyeDropperSampleSheet")==0 ) {
            if ( includeAllOptions==true ){
                setCTO( [ ["eyeDropperSampleSheet", 6] ] );
            } else {
                setCTO( [ ["eyeDropperSampleSheet", 1] ] );
            }
        } else if ( checkCTOoption("eyeDropperSampleSheet")==6 ) {
            if ( includeAllOptions==true ){
                setCTO( [ ["eyeDropperSampleSheet", 8] ] );
            } else {
                setCTO( [ ["eyeDropperSampleSheet", 1] ] );
            }
        } else if ( checkCTOoption("eyeDropperSampleSheet")==0 ) { //romasharf changed 8 to 0
                setCTO( [ ["eyeDropperSampleSheet", 1] ] );
        } else {
                setCTO( [ ["eyeDropperSampleSheet", 1] ] );
        }
    }
    else if ( app.currentTool=="bucketTool" || app.currentTool=="magicEraserTool"){
        if (checkCTOoption("BckS")==true){
            setCTO( [ ["BckS",false] ] );
        } else {
            setCTO( [ ["BckS",true] ] );
        }
    }
    else if ( app.currentTool=="blurTool" || app.currentTool=="sharpenTool" ){
        if (checkCTOoption("BlrS")==true){
            setCTO( [ ["BlrS",false] ] );
        } else {
            setCTO( [ ["BlrS",true] ] );
        }
    }
    else if ( app.currentTool=="smudgeTool" ){
        if ( checkCTOoption("smudgeStick", true)==false ){
            setCTO( [ ["smudgeStick", true] ], true );
        } else {
            setCTO( [ ["smudgeStick", false] ], true );
        }
    }
    else {
        // if other tools, do nothing
    }
}


//romasharf's small part of code ("except switchCTO();")

MyCurrentTool = app.currentTool;
if ( app.currentTool!="eyedropperTool" ) {
    app.currentTool = "eyedropperTool";
    switchCTO();
    app.currentTool = MyCurrentTool;
}

if ( app.currentTool=="eyedropperTool" ) {
    switchCTO();
}
