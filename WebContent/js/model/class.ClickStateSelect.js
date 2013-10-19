var ClickStateSelect = Class.create(AbstractClickState, {
  
  init:function() {

		try {
			if (documentRoot.id == undefined) throw "Error, documentRoot.id is undefined";

			if (documentRoot.id != MERGE_FRAME) {
        			documentRoot=$(SELECT_FRAME);
				console.log("clickStateSelect: documentRoot.id set to "+documentRoot.id);
			} else {
				console.log("clickStateSelect: documentRoot.id stays at "+documentRoot.id);
			}
			
			this.updateStyleForHoverEffect('#'+documentRoot.id+' *:hover {border: 1px solid yellow !important;}');
		} catch (e) {
			console.error(e);
			this.updateStyleForHoverEffect('*:hover {border: 1px solid yellow !important;}');
		}
		

		//if (bDebug != undefined && bDebug){
		//	alert("bDebug");
		//	removeBGColor(documentRoot);
		//}
		//document.getElementsByTagName("body")[0].onclick = function(e) {

    console.log("Setting onClick on document |"+documentRoot.id+"|");
    this.rewriteDocumentRootOnClick(documentRoot);
    $('generalizationControl').update();
		
	},
	
	process: function(aPath) {
	      var changeArray = this.clickContext.paintXPathRed(aPath.getPath());
		try {
		      if (changeArray.entries().size() > 0) {
			      $(SELECT_FRAME).update(changeArray.first().cloneNode(true).removeClassName("marked"));
			      if (changeArray.entries().size() >1) {
				  $(VALIDATION_FRAME).update(changeArray.entries()[1].cloneNode(true));
			       }
		      };

		} catch(e) {alert(e);}

      aPathInAction = aPath;
      if ($(VALIDATION_FRAME).childNodes.length > 0) 
          documentRoot=$(VALIDATION_FRAME);
  	},
  	
	toString:function() {
      return "Select-State";
  }
	
});
