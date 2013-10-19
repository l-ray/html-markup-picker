var ClickStateValidate = Class.create(AbstractClickState,{

	init:function() {

		try {
			if (documentRoot.id == undefined) throw "Error, documentRoot.id is undefined";
			if (documentRoot.id != MERGE_FRAME) {
				documentRoot=$(VALIDATION_FRAME);
				console.log("clickStateValidate: documentRoot.id set to "+documentRoot.id);
			} else {
				console.log("clickStateValidate: documentRoot.id stays at "+documentRoot.id);
			}

			this.updateStyleForHoverEffect('#'+documentRoot.id+' *:hover {border: 1px solid yellow;}');
		} catch (e) {
			console.error(e);
			this.updateStyleForHoverEffect('*:hover {border: 1px solid yellow;}');
		}
		
		//document.getElementsByTagName("body")[0].onclick = function(e) {
	  this.rewriteDocumentRootOnClick(documentRoot);
	},
	
	process:function(aPath) {
     
	var changeArray = this.clickContext.paintXPathRed(aPath.getPath());

	try {
	      if (changeArray.entries().size() > 0) {
		      $(VALIDATION_FRAME).update(changeArray.first().cloneNode(true).removeClassName("marked"));
	      };

	} catch(e) {alert(e);} 

    aPathForValidation = aPath;
     
     aMergedPath = this.mergePathes(aPathForValidation,aPathInAction);
     console.log("path1 |"+aPathForValidation.toString()+"|");
     console.log("path2 |"+aPathInAction.toString()+"|");     
     console.log("merged path |"+aMergedPath.toString()+"|");
   
     var item = this.createPatternElement(aMergedPath);
     
     $('generalizationControl').update(item.getGeneralizationInputForm());
     
  },
	
	mergePathes:function(path1, path2) {
	   
     var newPath = new XPathElementCollection();
     //newPath.setContext(this.clickContext);
     
	   var pathCount = Math.max(path1.size(), path2.size());
	   
	   console.log("pathCount |"+pathCount+"|");
	   
	   var path1 = path1.entries();
	   var path2 = path2.entries();	   
     
     var pathWalker1 = 0;
     var pathWalker2ConfirmedStep = 0;
	   var pathWalker2 = 0;
	   
	   while (pathWalker1 < path1.length) {
        
        console.log("pathWalker1:"+pathWalker1+"| max |"+path1.length+"|");
        
        while(pathWalker2 < path2.length) {
            
            console.log("pathWalker2 |"+pathWalker2+"| max |"+path2.length+"|");
            if (pathWalker2 < pathWalker1 && pathWalker1 < path2.length) pathWalker2 = pathWalker1;
            
            if (path1[pathWalker1].tagName == path2[pathWalker2].tagName) {
                console.log("gleicher tagname |"+path1[pathWalker1].tagName+"|");
    
                var newPathElement = new XPathElement(path1[pathWalker1].tagName);
		newPathElement.internalTag = path1[pathWalker1].internalTag;
                
                pathWalker2ConfirmedStep = pathWalker2;
                
                // check for ID
                if (!(path1[pathWalker1].idName).blank()&& path1[pathWalker1].idName == path2[pathWalker2].idName) {
                    console.log("gleiche ID");
                    
                    newPathElement.idName = path1[pathWalker1].idName;
                    newPathElement.setIsIdName(true); 
                } else {newPathElement.setIsIdName(false);}
    
                // check for className
                if (!(path1[pathWalker1].className).blank()&& path1[pathWalker1].className == path2[pathWalker2].className) {
                    console.log("gleiche Klassenkombination");
                    
                    newPathElement.className = path1[pathWalker1].className;
                    newPathElement.setIsClassName(true); 
                } else {newPathElement.setIsClassName(false);}

                // check for Counter
                if (path1[pathWalker1].counter > 0 && path1[pathWalker1].counter == path2[pathWalker2].counter) {
                    console.log("gleicher counter");
                    newPathElement.counter = path1[pathWalker1].counter;
                    newPathElement.setIsCounter(true); 
                }  else {newPathElement.setIsCounter(false);} 
                
                newPath.elements.push(newPathElement);
            }
            
            pathWalker2++;
         }
         
        pathWalker1++;
        pathWalker2 =  pathWalker2ConfirmedStep;
     }
	   
	   return newPath;
	},
	
	createPatternElement: function(newPath) {
  
    var item = new PatternTreeElement();
  
	  item.setXPathCollection(newPath);
	  
	  var childNode = $(SELECT_FRAME).childNodes[0];
	  while (childNode.nodeType != 1)
		  childNode = childNode.nextSibling;
	  
	  if (childNode == undefined) alert("childNode undefined");
	  
	  var childCompareNode = $(VALIDATION_FRAME).childNodes[0];
	  while (childCompareNode.nodeType != 1)
		  childCompareNode = childCompareNode.nextSibling;
	  
	  if (childCompareNode == undefined) alert("childCompareNode undefined");

	  item.setDocument(childNode.cloneNode(true));

	  item.setCompareDocument(childCompareNode.cloneNode(true));
	  
	  item.setParent(this.clickContext.getActivePatternTreeElement());
	  
	  item.setContext(this.clickContext);
	  
	  this.clickContext._activePatternTreeElement = item;
	  
	  return item;
  
  },
	
	toString:function() {
      return "Validate-State";
  }



});
