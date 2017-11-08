app.filter('dateFilter', function(){
	return function(dateString){
		return new Date(dateString);
	}
});

app.filter('reverse', function() {
	  return function(items) {
	    return items.slice().reverse();
	  };
});