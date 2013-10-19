// JavaScript Document
var ClickContext = Class.create();
ClickContext.prototype = {

	_state : Object(),
  _editState :  Object(),
  _validateState :  Object(),
  _selectState :  Object(),
  
  _activePatternTreeElement: Object(),
  
  _state_mode : Number(0),
  _IN_SELECT_STATE : Number(1), 
  _IN_VALIDATE_STATE : Number(2),
  _IN_EDIT_STATE : Number(3),  

	initialize : function(activePatternTreeElement ) {

	   this._activePatternTreeElement = activePatternTreeElement;
	
     _editState = new ClickStateEdit(this);
     _validateState = new ClickStateValidate(this);
     _selectState = new ClickStateSelect(this);
     
     console.log("ClickContext initialised...");
	},
	
	setEditState: function() {
    this._state = _editState;
    this._state_mode = this._IN_EDIT_STATE;
    console.log("ClickContext in Edit-State, activePatternTreeElement is |"+this.getActivePatternTreeElement());
    this._state.init();
  },
  
  setValidateState: function() {
    this._state = _validateState;
    this._state_mode = this._IN_VALIDATE_STATE;    
    console.log("ClickContext in Validate-State");
    this._state.init();    
  },
  
  setSelectState: function() {
    this._state = _selectState;
    this._state_mode = this._IN_SELECT_STATE;
    console.log("ClickContext in Select-State");    
    this._state.init();    
  },
  
  getState: function() {
    return this._state;
  },
  
  getStateMode: function() {
    return this._state_mode;
  },
  
  getActivePatternTreeElement: function() {
    return this._activePatternTreeElement;
  },
	
	setActivePatternTreeElement: function(item) {
    this._activePatternTreeElement = item;
  },
	
	paintXPathRed:function(xPath) {
		this.paintXPathRed(xPath,"");
	},

	paintXPathRed:function(xPath, textSelection) {

		console.log("paint red |"+xPath+"| with type-strategy |"+textSelection+"|");
    
    		// delete all existing markings
		$A(document.getElementsByClassName("marked")).each(function (n) {n.removeClassName("marked");});

		$("xPathToString").update(xPath);
		
		var iterator = document.evaluate(xPath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null );
	
		var changeArray = $A();

		try {
		  var thisNode = iterator.iterateNext();
		  
		  while (thisNode) {
			  changeArray.push(thisNode);
			  thisNode = iterator.iterateNext();
		  }	
		}
		catch (e) {
		  alert( 'Error: Document tree modified during iteration' + e );
		}	

		for (var i=0; i < changeArray.length; i++) {
			if (changeArray[i] instanceof HTMLDocument) {
				continue;
			}
			
			try {
				if (textSelection == undefined || !textSelection instanceof AbstractTypeStrategy) {
					changeArray[i].addClassName("marked");
				} else {
					changeArray[i].update(textSelection.returnPatternMarked(changeArray[i].innerHTML));
				}
			} catch(e) {
				alert("paintXPathRed"+xPath+e+changeArray[i]);
			}
		}

		return changeArray;

	},

	
};
