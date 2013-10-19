var XPathElement = Class.create();
XPathElement.prototype = {
  internalTag: Boolean(false),
  useTagName: Boolean(true),
  tagName:String(),   
  useCounter: Object(true),
  counter: Number(-1),
  useClassName: Boolean(true),
  className: String(),
  idName:String(),
  useIdName: Boolean(false),

  initialize: function(myTagName,myIdName) {
	if (myTagName != undefined) {
		this.tagName = myTagName;
		}
	this.setIsCounter(true);
	this.setIsClassName(true);
	this.setIsTagName(true);
	if (myIdName != undefined) {
		this.idName = myIdName;
	} else {
		this.idName = "";
	};
	  },
  
  toString: function() {
    //open maingroup
	with (this) {	 
		return ((useTagName)?tagName+((isIdName()&&idName!="")?"[@id='"+idName+"']":"")
		  +((!isIdName()&&isClassName()&&className!="")?"[@class='"+className+"']":"")
		  +((!isIdName()&&isCounter() && counter!=-1)?"["+counter+"]":""):"");
	}
  },
  
  setIdName:function(name){
    this.idName = name;
    this.setIsIdName(true);
  },
  
  setClassName:function(name) {
    this.className=name;
    this.setIsClassName(true);
  },
  
  setIsTagName: function(set) {
    this.useTagName = set;
  },
  
  isTagName:function() {
    return this.useTagName;
  },
  
  isInternalTag:function() {
    return this.internalTag;
  },

  setIsClassName: function(set) {
    this.useClassName = set;
  },
  
  isClassName:function() {
    if (this.className.length>0)
      return this.useClassName;
    else
      return false;
  },
  
  setIsIdName: function(set) {
    this.useIdName = set;
  },

  isIdName:function() {
    if (this.idName.empty())
      return false;
    else 
      return this.useIdName;
  },  
  
  setIsCounter:function(set) {
    this.useCounter=set;
  },
  
  isCounter:function() {
    if (this.counter >0)
      return this.useCounter;
    else 
    return false;
  },
  
};
