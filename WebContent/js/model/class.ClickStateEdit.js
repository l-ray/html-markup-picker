var ClickStateEdit = Class.create(AbstractClickState,{
	
	init: function() {
    
    console.log("activePatternTreeElement is |" + this.clickContext.getActivePatternTreeElement()+
                "| clickPath is |"+this.clickContext.getActivePatternTreeElement().getFullXPath()+"|");

    documentRoot = this.clickContext.getActivePatternTreeElement().getDocument();
    // documentCompareRoot = this.clickContext.getActivePatternTreeElement().getCompareDocument();

    removeBGColor(documentRoot);
		this.clickContext.paintXPathRed(this.clickContext.getActivePatternTreeElement().getFullXPath());
		$(SELECT_FRAME).update(this.clickContext.getActivePatternTreeElement().getDocument());
		$(VALIDATION_FRAME).update(this.clickContext.getActivePatternTreeElement().getCompareDocument());
  },
  
  process: function(aPath) {
	var changeArray = this.clickContext.paintXPathRed(aPath.getPath());      
	try {
	      if (changeArray.entries().size() > 0) {
		      $(SELECT_FRAME).update(changeArray.first().cloneNode(true));
		      if (changeArray.entries().size() >1) {
			  $(VALIDATION_FRAME).update(changeArray.entries()[1].cloneNode(true));
		       }
	      };

	} catch(e) {alert(e);}
	aPathBeingSaved = aPath;
  },
	
	toString:function() {
      return "Edit-State";
  }
	
});
