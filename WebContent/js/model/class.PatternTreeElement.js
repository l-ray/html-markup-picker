var PatternTreeElement = Class.create(Enumerable,{

	children : Object(),
	name:String(),
	xPath:String(),
	xPathCollection:Object(),
	color: String(),
	type: String(),
	document: Object(),
	compareDocument: Object(),
	parent: Object(),
	
	oContext : Object(),
  	oExampleNode : Object(),
	oPatternTreeElementType : Object(),
	oPatternTreeElementName: String(),

	initialize : function() {
		this.initialize("new leaf");
	},

	initialize : function(name) {
		this.children = $A();
		this.name = name;
		this.xPath = "";
		this.parent = undefined;
	},

	_each: function(iterator) {
		return this.children._each(iterator);
	},
	
	toString:function() {
    		return "[PatternTreeElement:"+name+":"+this.getXPath()+"]-> parent:"+this.parent;
  
 	},

	toJSON:function() {
		var JSONString = {
			"name": this.name,
			"xPath": this.getXPath(true, true ,true),
			"color": this.color,
			"type": this.type
		};
		if (this.children.size() > 0) {
			JSONString["children"] = this.children.map(function(n) { return n.toJSON().evalJSON(true);});
		}
		return Object.toJSON(JSONString);
	},
	
	push:function(item) {
		this.children.push(item);
	},
	
	without:function(item) {
		this.children.without(item);
	},	
	
	setName:function(name) {
		this.name=name;
	},
	
	getName:function() {
		return this.name;
	},
	
	getXPath: function(value, value2, value3) {
	  if (this.xPathCollection.getPath != undefined)
        	return this.xPathCollection.getPath(value, value2, value3);
	  else 
        	return this.xPath;
 	},
	
	setXPathCollection: function(path) {
		this.xPathCollection = path;
	},
	
	getXPathCollection: function() {
		  return this.xPathCollection;
	},
	
	getFullXPath: function(bMiddlePart) {
    
	    if (this.getParent() != undefined 
		&& this.getParent().getFullXPath != undefined 
		&& !this.getParent().getFullXPath().empty()
		) 
		    {
			var front = this.getParent().getFullXPath(true);
			var back = this.getXPath(true,bMiddlePart);
		
			if (front.search(/\/$/) != -1 && back.search(/^\/./) != -1) {
				return front+back;                            
		      } else {
				return front+"/"+back;
		      }
      
		} else {
			return this.getXPath(false,bMiddlePart);
		}
	},
	
	setColor: function(color) {
		this.color = color;
	},
	
	getColor: function() {
		return this.color;
	},
	
	setType: function(color) {
		this.type = color;
	},
	
	getType: function() {
		return this.type;
	},
	
	setDocument: function(document) {
   	 this.document = document;
	},
	
	getDocument: function() {
		return this.document;
	},
	
	setCompareDocument: function(document) {
   	 this.compareDocument = document;
	},
	
	getCompareDocument: function() {
		return this.compareDocument;
	},

	setParent: function(item) {
		if (item == this)
		  alert("hen-egg-problem, my and my parents are the same");
    		this.parent = item;
	},
	
	getParent: function() {
		return this.parent;
	},
	
	activateElement: function() {

		documentRoot.onclick = undefined;
    		this.oContext._activePatternTreeElement = this;
		
   		$('generalizationControl').update(this.getGeneralizationInputForm());
 		$(SELECT_FRAME).update(this.getDocument());
  		$(VALIDATION_FRAME).update(this.getCompareDocument());
    
    		this.oContext.setSelectState();
		this.oContext.paintXPathRed(this.getFullXPath());

	},
	
	paint: function() {
		var myNode = new Element("ul",{});
		var myLiWrapper = new Element("li",{});
		
		var myLink = new Element("a", {href:'#'}).insert(this.getName());
		myLink.observe('click', this.activateElement.bind(this) 
			);
		
		myLiWrapper.appendChild(myLink);    
		myNode.appendChild(myLiWrapper);
		myLiWrapper.appendChild(
		new Element("i",{}).insert(
	          "("+this.getFullXPath().replace(this.getXPath(true),"<b>"
        		  +this.getXPath(true)+"</b>")+")"
        	  )
      		);
		
		this.children.each(function(n) {myNode.appendChild(n.paint());});
		
		return myNode;
	},
	
	  setCounterForClickedInput: function(e,i) {
	 
	try {
		if (Event.element(e).checked) 
  		  this.xPathCollection.elements.toArray()[i].setIsCounter(true);
  		else 
  	  	  this.xPathCollection.elements.toArray()[i].setIsCounter(false); 
  	  
        this.updatePreview();

	} catch (e) { console.log(e); }		  
  },
  
  setTagNameForClickedInput: function(e,i) {
	 try {
  	  if (Event.element(e).checked) 
  		  this.xPathCollection.elements.toArray()[i].setIsTagName(true);
  	  else 
  	  	this.xPathCollection.elements.toArray()[i].setIsTagName(false); 
  	  
        this.updatePreview();	  

    } catch (e) {console.log(e);}    		  
  },
  
  setClassNameForClickedInput: function(e,i) {
	 try {

  	  if (Event.element(e).checked) 
  		  this.xPathCollection.elements.toArray()[i].setIsClassName(true);
  	  else 
  	  	this.xPathCollection.elements.toArray()[i].setIsClassName(false); 
        this.updatePreview();		  
    } catch (e) {console.log(e);}    		  
  },
  
  setIDForClickedInput: function(e,i) {
		 try {

  	  if (Event.element(e).checked) 
  		  this.xPathCollection.elements.toArray()[i].setIsIdName(true);
  	  else 
  	  	this.xPathCollection.elements.toArray()[i].setIsIdName(false); 
  	  
        this.updatePreview();		  
    } catch (e) {console.log(e);}    		  
  },

  setTypeForClickedInput: function(e) {
    try {
	var selectElement = Event.element(e);
	this.type = selectElement.options[selectElement.selectedIndex].value;
	console.log("Type from element |"+selectElement+"| set to |"+this.type+"|");        
	this.updatePreview();	  

    } catch (e) {console.log(e);}    		  
  },

  getGeneralizationInputForm: function() {
  	
  	var oNodeCollection = new Element("form",{style:'display:block;clear:both;float:none;'});
  	
  	for (var i=0; i < this.xPathCollection.elements.size(); i++) {
			var xPathFieldset = new Element("fieldset",{"style":"display:block;width:100px;float:left;"});

			// Show Element
      xPathFieldset.appendChild(document.createTextNode(this.xPathCollection.elements[i]));
	xPathFieldset.appendChild(document.createElement("br"));

	if ( this.xPathCollection.elements[i].internalTag ) {
		xPathFieldset.insert("ignored");
		continue;
	}     


			// show use-Counter
      var xPathInputField = document.createElement("input");
			xPathInputField.setAttribute("type","checkbox");
			
			xPathInputField.observe('click',this.setCounterForClickedInput.bindAsEventListener(this,i));
			
			xPathInputField.setAttribute("title","use TagCount");
			if (this.xPathCollection.elements[i].isCounter()) xPathInputField.setAttribute("checked","checked"); 
			if (this.xPathCollection.elements[i].counter < 0) xPathInputField.setAttribute("disabled","disabled");
			xPathFieldset.appendChild(xPathInputField);

      // show Use-TagName
			var xPathIgnoreInputField = document.createElement("input");
			xPathIgnoreInputField.setAttribute("type","checkbox");

			xPathIgnoreInputField.observe('click',this.setTagNameForClickedInput.bindAsEventListener(this,i));
			xPathIgnoreInputField.setAttribute("title","use Tag");
      if (this.xPathCollection.elements[i].isTagName()) xPathIgnoreInputField.setAttribute("checked","checked"); 
			
			xPathFieldset.appendChild(xPathIgnoreInputField);

			// show Use-ClassName
      var xPathClassInputField = document.createElement("input");
			xPathClassInputField.setAttribute("type","checkbox");

			xPathClassInputField.observe('click',this.setClassNameForClickedInput.bindAsEventListener(this,i));
			xPathClassInputField.setAttribute("title","use Class");
			if (this.xPathCollection.elements[i].isClassName()) xPathClassInputField.setAttribute("checked","checked"); 
			if (this.xPathCollection.elements[i].className.empty()) xPathClassInputField.setAttribute("disabled","disabled");
      
      xPathFieldset.appendChild(xPathClassInputField);
			
			// show Use-ID-Name
      var xPathIdInputField = document.createElement("input");
			xPathIdInputField.setAttribute("type","checkbox");
			
      xPathIdInputField.observe('click',this.setIDForClickedInput.bindAsEventListener(this,i));
      xPathIdInputField.setAttribute("title","use ID");
			if (this.xPathCollection.elements[i].isIdName()) xPathIdInputField.setAttribute("checked","checked"); 
			if (this.xPathCollection.elements[i].idName.empty()) xPathIdInputField.setAttribute("disabled","disabled");
      
			xPathFieldset.appendChild(xPathIdInputField);

			oNodeCollection.appendChild(xPathFieldset);
		} 
  	
  			this.oPatternTreeElementName = new Element("input",{type:'text', value:'new name'});
  	
  			oNodeCollection.appendChild(this.oPatternTreeElementName);
  			
		  	// add all possible Strategies
			this.oPatternTreeElementType = new Element("select",{name:"selectType"});
			for (var strategy in TypeStrategyEnum) {
				var options = {value:strategy};
				if (TypeStrategyEnum[strategy] == 0) {
					options["selected"] = "selected";				
				}				
				this.oPatternTreeElementType.insert(new Element("option",options).insert(strategy.toLowerCase()));
			}		  	
			
						
			this.oPatternTreeElementType.observe('change',this.setTypeForClickedInput.bindAsEventListener(this));
			oNodeCollection.appendChild(this.oPatternTreeElementType);
  	
	  	    var submitElement = new Element("input",{"type":"button","value":"save"});
			submitElement.observe('click', this.saveMe.bind(this));	
			oNodeCollection.appendChild(submitElement);
		
		return oNodeCollection;
		
  },
  
  saveMe: function() {
	  
	  try {
      this.setType(this.oPatternTreeElementType.value);
  	  
  	  this.setName(this.oPatternTreeElementName.value);
  	  
  	  var childNode = $(SELECT_FRAME).childNodes[0];
  	  var childCompareNode = $(VALIDATION_FRAME).childNodes[0];
  
  	  while (childNode != undefined && childNode.nodeType != 1)
  		  childNode = childNode.nextSibling;
  	  
  	  if (childNode == undefined) alert("childNode undefined");
  	  
  	  while (childNode != undefined && childCompareNode.nodeType != 1)
  		  childCompareNode = childCompareNode.nextSibling;
  	  
  	  if (childCompareNode == undefined) alert("childCompareNode undefined");


  	  this.setDocument(childNode.cloneNode(true));
	  this.setCompareDocument(childCompareNode.cloneNode(true));
  	  
  	  alert(this.getParent());
  	  
      this.getParent().push(this);
  	  
  	  this.oContext.setActivePatternTreeElement(this);
  	  //aPathInAction.oExampleNode = $('example');
  	  documentRoot=this.getDocument();
  	  this.oContext.setSelectState();
  	  
  	  $('treeNode').update(myMappingDocument.paint());
	  } catch (e) { console.log(e);} 

  },
   
  setContext: function(view) {
    this.oContext = view;
  },
  
  getContext: function() {
    return this.oContext;
  },

  updatePreview: function() {
	var changeArray;
	console.log("type |"+this.type+"| - Strategy |"+typeof(AbstractTypeStrategy.instanceFor(TypeStrategyEnum[this.type]))+"|");
	switch (TypeStrategyEnum[this.type]) {
		case TypeStrategyEnum.PRICE:		
		case TypeStrategyEnum.TIME:		
		case TypeStrategyEnum.DATE: changeArray = this.oContext.paintXPathRed(this.getFullXPath(),AbstractTypeStrategy.instanceFor(TypeStrategyEnum[this.type]));break;
		default: changeArray = this.oContext.paintXPathRed(this.getFullXPath());
	}	

	console.log(changeArray);	
	try {	
		$(SELECT_FRAME).update(changeArray.first().cloneNode(true).removeClassName("marked"));
	} catch (e) {$(SELECT_FRAME).update("mothing found");}
	try {	
		$(VALIDATION_FRAME).update(changeArray.entries()[1].cloneNode(true).removeClassName("marked"));
	} catch (e) {$(VALIDATION_FRAME).update("nothing found");}

  }	
	
});
