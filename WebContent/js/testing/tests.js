new Test.Unit.Runner( {
	xPathElement: Object(),
	
	setup: function() { with(this) {
	      this.xPathElement = new XPathElement("test");
	    }},
	
	testToString : function() {
		this.assertEqual("test", this.xPathElement);

		this.xPathElement.counter = 2;
		this.assertEqual("test[2]", this.xPathElement);

		this.xPathElement.className = "testClass";
		this.assertEqual("test[@class='testClass'][2]", this.xPathElement);
    
	    this.xPathElement.isCounter = false;
	    this.assertEqual("test[@class='testClass']", this.xPathElement);
	    },
    
    testGetXPathForNode: function() {
    	this.assertEqual(true, (new Array('hello')) instanceof Array);
    	this.assertEqual(true, (getXPathForNode(document.getElementsByTagName('body')[0])) instanceof Array);
    	this.assertEqual("html/body[1]",(getXPathForNode(document.getElementsByTagName('body')[0])).join("/"));    	
    }
    
	

});