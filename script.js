$(document).ready(function(){

	plain = '', formatted = '';
	features = [];
	
	$(document).keypress(function(e){

		var char;
		switch(char = input(e))
		{
		case undefined:
			return;
		case 'backspace':
			plain = plain.substring(0, plain.length - 1);
			break;
		case 'enter':
			plain += '<br>';
			break;
		default:
			plain += char;	
		}
		

		look();
		format();

		output();
	});

	function input(e)
	{
		var pressed;
		if(e.charCode)
			return String.fromCharCode(e.charCode);
		else if(e.keyCode)
			switch(e.keyCode) {
			case 13:
				return 'enter';
			case 8:
				return 'backspace';
			default:
				return undefined;
			}
		else return undefined;
	}

	function look()
	{
		features = [];

		// strong
		var regex = /\*[^\s][^\*]+[^\s]\*/g;
		var i;
		while(i = regex.exec(plain))
			features.push({ type: 'strong', from: i.index, to: i.index + i[0].length });

	}

	function format()
	{
		formatted = plain;

		// to that in parallel to not skrew up indices!
		for(var i = 0; i < features.length; ++i)
			if(features[i].type == 'strong')
				formatted = formatted.substring(0, features[i].from)
				          + '<strong>'
				          + plain.substring(features[i].from, features[i].to)
				          + '</strong>'
				          + formatted.substring(features[i].to);		
	}

	function output()
	{
		$('#sheet').html(formatted);
	}

});
