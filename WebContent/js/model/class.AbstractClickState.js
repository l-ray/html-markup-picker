var AbstractClickState = Class.create();

AbstractClickState.prototype = {

	clickContext : Object(),
  
  initialize : function(context) {
    this.clickContext = context;
	},
	
	rewriteDocumentRootOnClick:function(documentRoot) {
  	
    	 documentRoot.onclick = function(e) {
			try {
				 
         console.log("Setting onClick on document |"+documentRoot.id+"|");
         
         var aPath;
         
         var evt=window.event || e;
		 if (!evt.target) //if event obj doesn't support e.target, presume it does e.srcElement
		 evt.target=evt.srcElement; //extend obj with custom e.target prop
		 
		 Event.stop(evt);
	
		 // hole Klickpfad und setze entsprechenden Kontext
 			 aPath = new XPathElementCollection(getXPathForNode(evt.target));
		 //aPath.setContext(this.clickContext);
	
		// stelle neuen Pfad dar
			// $('generalizationControl').update(aPath.getGeneralizationInputForm());
			
		// this.clickContext.paintXPathRed(aPath.getPath());
		documentRoot = this.clickContext.getActivePatternTreeElement().getDocument();
		documentRoot.onclick = undefined;
		this.updateStyleForHoverEffect('');
			
        this.process(this.cleanPath(aPath));
        
        switch (this.clickContext.getStateMode()) {
        
          case this.clickContext._IN_SELECT_STATE:
            this.clickContext.setValidateState();
            break;
        
          case this.clickContext._IN_VALIDATE_STATE:
            this.clickContext.setEditState();
            break; 
            
          case this.clickContext._IN_EDIT_STATE:
            this.clickContext.setSelectState();
            break;
        }
        
      } catch (e) {
				alert(e);
			}
			
			this.onclick = null;
			
		}.bind(this);
  },
  
  cleanPath:function(aPath) {
	console.log("cleanPath:"+aPath.entries()[0].idName);
	if (documentRoot.id == MERGE_FRAME && aPath.entries()[0].idName == MERGE_FRAME) {
		aPath.entries()[0].setIsTagName(false);
	}
	return aPath;
  },	

  updateStyleForHoverEffect:function(sStyle) {
   var styleForHoverEffect = $('styleforHoverEffect');
   if (styleForHoverEffect == undefined) {
   	var head = $(document.getElementsByTagName("head")[0]);
   	styleForHoverEffect = new Element("style", { type:"text/css", id:"styleforHoverEffect"});	 
	head.insert({top:styleForHoverEffect});
   }
   styleForHoverEffect.innerHTML = sStyle; 
  }
};// JavaScript Document
