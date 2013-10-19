var XPathElementCollection = Class.create(Enumerable, {  

	initialize: function() {

		var args = $A(arguments).flatten();
    
		if (!args.all( function(arg) { return arg instanceof XPathElement; }))
		      throw "Only XPathElements in here!";

		this.elements = args;
		this.elements.each(this.markInternalTag);
  	},
	
	markInternalTag:function(n) {
		if (XPathElementCollection.internalTagIDs.indexOf(n.idName)>-1) {
			n.internalTag = true;
			console.log("marking |"+n.idName+"| as internal tag");	
		};
	},

  // implement _each to use Enumerable methods
  _each: function(iterator) {
    return this.elements._each(iterator);
  },
   
  // implement _each to use Enumerable methods
  push: function(item) {
    this.markInternalTag(item);
    return this.elements.push(item);
  },

  /**
   * Returns correct xPath as a String
   *
   * @param bNotRootPath - path is not a root path and so needs just a single "/" as praefix
   * @param bNotEndPath - path is not an end path and so needs kind of "/" in back
   * @param bWithoutInternalTags - tags marked as "internal" are wiped out, makes problems when still in test-environment
   */
  getPath:function(bNotRootPath,bNotEndPath,bWithoutInternalTags) {
  	
  	if (this.elements.size() == 0)
  	 return "";
    
    var bLastOneWasEmpty = false;
    var trimmedPathPraefix = false;	
    
    
    // find the first element holding content
    var i;
    for (i=0; i< this.elements.length; i++) {
      if (this.elements[i].isTagName()) break;
    }
    
    // removing unused elements from the beginning
    if (i>0) trimmedPathPraefix = true;
    var aXPathStrings = this.elements.slice(i);

    // replacing all unseen elements after one already unseen element by a null-value
    aXPathStrings = aXPathStrings.collect(
  		function(s) {
				if (s.isTagName()) {
  					bLastOneWasEmpty = false;
  					return s;
  				} else {
  					if (bLastOneWasEmpty) {
  						return null;
  					} else {
  						bLastOneWasEmpty = true;
  						return s;
  					}
  				}
  		}
  	).reject(function(s) { return (s == null);});
  	
    // remove unused Tags from the end	
    while (aXPathStrings.last() != undefined &&  !aXPathStrings.last().isTagName) aXPathStrings.pop();

    // reducing occasions/clusters of more then one unused tag to the number of one (marked as null-value)
    var lastWasEmptyToo = false;    
    aXPathStrings = aXPathStrings.reject(
          function (s) { 
            var deleteElement = !s.isTagName()&&lastWasEmptyToo;
            lastWasEmptyToo = !s.isTagName();
            return deleteElement;
          }
        );

   
    var last =  aXPathStrings.last();
    var bShortened = false;
    if (last && !last.isTagName()) {
         aXPathStrings = aXPathStrings.without(last);
         bShortened = true; 
    }
    
    var sXPath = aXPathStrings.join("/");

	// if element on begin of the root were skipped, add another slash
    if (bNotRootPath) {
	if (trimmedPathPraefix) {sXPath = "/"+sXPath;};        
	if (!aXPathStrings[0].isTagName()) {sXPath = "/"+sXPath;}
    } else {
	var doubleSlashNeeded = (trimmedPathPraefix||aXPathStrings[0].isIdName());
    	sXPath = (doubleSlashNeeded?"//":"/")+sXPath;
    }	

    if (bNotEndPath && bShortened) {sXPath = sXPath+"/";}

    return sXPath; 
  },
  
  toString: function() {
    return this.getPath(false);
  },
  
});

XPathElementCollection.internalTagIDs = $A([SELECT_FRAME, VALIDATION_FRAME, MERGE_FRAME]);