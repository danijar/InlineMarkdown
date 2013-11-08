$(document).ready(function() {

	var plain = '';
	var features = [];

	var list = '';
	var indices = [];

	var rendered = '';

	// var cursor = 0; // not yet implemented

	var types = {
		strong: { regex: /\*[^\s][^\*]*[^\s]\*/g, before: '<strong>', after: '</strong>' },
		h1:     { regex: /\n\#{1}[^\#\n]*\n/g,    before: '<h1>',     after: '</h1>'     },
		h2:     { regex: /\n\#{2}[^\#\n]*\n/g,    before: '<h2>',     after: '</h2>'     },
		h3:     { regex: /\n\#{3}[^\#\n]*\n/g,    before: '<h3>',     after: '</h3>'     },
	};

	$(document).keypress(function(e) {
		input(e);
		update();
	});

	function update() {
		fetch();
		format();
		render();
		output();
	}

	update();

	function input(e) {
		var character = keyevent(e);
		switch(character)
		{
		case undefined:
			return;
		case 'backspace':
			plain = plain.substring(0, plain.length - 1);
			break;
		case 'enter':
			plain += '\n';
			break;
		default:
			plain += character;
		}
	}

	function keyevent(e) {
		if(e.charCode)
			return String.fromCharCode(e.charCode);
		else if(e.keyCode)
			switch(e.keyCode)
			{
			case 13:
				return 'enter';
			case 8:
				return 'backspace';
			default:
				return undefined;
			}
		else return undefined;
	}

	function fetch() {
		features = [];

		$.each(types, function(name, type){
			var regex = type.regex;
			var i;
			while(i = regex.exec(plain))
				features.push({ type: name, from: i.index, to: i.index + i[0].length - 1 });
		});
	}

	function format() {
		list = plain;
		indices  = _.range(0, list.length);

		_.each(features, function(feature) {
			if(feature.type in types) {
				var type = types[feature.type];
				insert(feature.from, type.before);
				insert(feature.to + 1, type.after);
			}
		});
	}

	function insert(position, string)
	{
		var index;
		for(var i = 0; i < indices.length; ++i)
			if(indices[i] == position)
				index = i;

		var start = list.length;
		var end = start + string.length;
		list += string;

		indices.splice.apply(indices, [index, 0].concat(_.range(start, end)));
	}

	function render() {
		rendered = '';

		for(var i = 0; i < indices.length; ++i)
			rendered += list[indices[i]];

		rendered = rendered.replace(/\n/g, '<br>');
	}

	function output() {
		$('#sheet').html(rendered == '' ? '...' : rendered);
	}

});
