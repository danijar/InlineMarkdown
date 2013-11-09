$(document).ready(function() {

	var plain = '';
	var features = [];

	var list = '';
	var indices = [];

	var rendered = '';

	var cursor = 0;

	var types = {
		strong: { regex: /\*[^\*\s]([^\*]|(\*\s))*[^\*\s]\*/g, before: '<strong>', after: '</strong>' },
		h1:     { regex: /^ *#{1}(.*)$/mg,                     before: '<h1>',     after: '</h1>'     },
		h2:     { regex: /^ *#{2}(.*)$/mg,                     before: '<h2>',     after: '</h2>'     },
		h3:     { regex: /^ *#{3}(.*)$/mg,                     before: '<h3>',     after: '</h3>'     },
		h4:     { regex: /^ *#{4}(.*)$/mg,                     before: '<h4>',     after: '</h4>'     },
		h5:     { regex: /^ *#{5}(.*)$/mg,                     before: '<h5>',     after: '</h5>'     },
		h6:     { regex: /^ *#{6}(.*)$/mg,                     before: '<h6>',     after: '</h6>'     },
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
		var char = e.charCode ? String.fromCharCode(e.charCode) : undefined;
		if(e.keyCode)
		{
			console.log(e.keyCode);
			switch(e.keyCode)
			{
			case  8: // backspace
				if(cursor > 0) {
					plain = plain.substring(0, cursor - 1) + plain.substring(cursor);
					cursor--;
				}
				break;
			case 13: // enter
				char = '\n';
				break;
			case 37: // left
				if(cursor > 0) cursor--;
				break;
			case 39: // right
				if(cursor < plain.length - 1) cursor++;
				break;
			case 46: // delete
				if(cursor < plain.length)
					plain = plain.substring(0, cursor) + plain.substring(cursor + 1);
				break;
			default:
				return;
			}
		}
		if(char)
		{
			var array = plain.split('');
			array.splice(cursor, 0, char);
			plain = array.join('');
			cursor++;
		}
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
		$('#sheet').html(rendered == '' ? '<gray>...</gray>' : rendered);
	}

});
