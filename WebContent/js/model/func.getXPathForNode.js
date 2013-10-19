function getXPathForNode(node) {
   try {
		// if there is no node at all, we are at the root
		if (node == undefined || node == null || node.tagName == undefined) {
			//alert("returning 1 "+new Array())
			return (new Array());
		}
		
		var tagName;
		tagName = node.tagName.toLowerCase();

		var tmpTagName = new XPathElement(tagName);

		if (tagName == "html") {
			//alert("returning 2 "+(new Array(tmpTagName)));
			return (new Array(tmpTagName));
		}

		var tagClass;

  	    // if we found a root, that's fine, let s stop here
		if (node.id != undefined && node.id != "") {
			tmpTagName.setIdName(node.id);
			//alert("returning 3 "+new Array(tmpTagName));
			return (new Array(tmpTagName));
		}
			

			// if we have a class, let us use it
		if (node.className != undefined && node.className != "") {
			tmpTagName.setClassName(node.className);
		} 
		else 
		// no className, so let's check out the position in the parentnode
		{

			var nodeParent = node.parentNode;
			var nodeIndexArray = nodeParent.childNodes;
			var nodeIndex = -1;
			var j=0;

			for (var i=0; i < nodeIndexArray.length; i++) {

				if (typeof(nodeIndexArray[i].tagName)== "string" && tagName == nodeIndexArray[i].tagName.toLowerCase()) {
					j++;
				}

				if (nodeIndexArray[i] == node) {
					nodeIndex = j;
				}

			}
			tmpTagName.counter = nodeIndex;		
		}
		
		var myArray = getXPathForNode(node.parentNode);
		// alert("returning myArray "+ myArray + " with parentNode "+node.parentNode+" and tagName"+tmpTagName);
		myArray.push(tmpTagName);
		return myArray;
  	} catch (e) {alert("getXPathNode"+e);}	
}