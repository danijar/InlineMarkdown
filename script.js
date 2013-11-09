$(document).ready(function() {

	var plain = '';
	var features = [];

	var list = '';
	var indices = [];

	var rendered = '';

	var cursor = 0;

	var types = {
		bold:   { regex: /\*\*[^\*\s]([^\*]|(\*\s))*[^\*\s]\*\*/g, callback: function(match){ return '<b>' + match + '</b>' } },
		italic: { regex: /\*[^\*\s]([^\*]|(\*\s))*[^\*\s]\*/g,     callback: function(match){ return '<i>' + match + '</i>' } },
		h1: { regex: /^#{1}([^#]|$).*$/mg, callback: function(match){ return '<h1>' + match + '</h1>' } },
		h2: { regex: /^#{2}([^#]|$).*$/mg, callback: function(match){ return '<h2>' + match + '</h2>' } },
		h3: { regex: /^#{3}([^#]|$).*$/mg, callback: function(match){ return '<h3>' + match + '</h3>' } },
		h4: { regex: /^#{4}([^#]|$).*$/mg, callback: function(match){ return '<h4>' + match + '</h4>' } },
		h5: { regex: /^#{5}([^#]|$).*$/mg, callback: function(match){ return '<h5>' + match + '</h5>' } },
		h6: { regex: /^#{6}([^#]|$).*$/mg, callback: function(match){ return '<h6>' + match + '</h6>' } },
	};

	$(document).keypress(function(e) {
		input(e);
		update();
		blink();
	});

	function update() {
		console.clear();
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
			//console.log(e.keyCode);
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
				if(cursor < plain.length) cursor++;
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
			var i, n = 0;
			while(i = regex.exec(plain))
			{
				features.push({ type: name, from: i.index, to: i.index + i[0].length - 1 });
				n++;
			}

			//if(n) console.log(n + ' ' + name)
		});
	}

	function format() {
		list = plain;
		indices  = _.range(0, list.length);

		_.each(features, function(feature) {
			if(feature.type in types) {
				var type = types[feature.type];
				var string = plain.substring(feature.from, feature.to + 1);
				replace(feature.from, feature.to, type.callback(string));
			}
		});

		//console.log(list);
		//console.log(indices);
	}

	function replace(plain_from, plain_to, string)
	{
		var from, to;
		for(var i = 0; i < indices.length; ++i)
			if(indices[i] == plain_from)
				from = i;
			else if(indices[i] == plain_to)
				to = i;

		if(from === undefined) { console.log("cannot replace"); return; }
		if(to   === undefined) to = indices.length;
		
		var start = list.length;
		var end = start + string.length;
		list += string;

		var spliced = indices.splice.apply(indices, [from, to - from + 1].concat(_.range(start, end)));

		//console.log("from " + from + " to " + to + " spliced " + spliced);
	}

	function render() {
		rendered = '';

		for(var i = 0; i < indices.length; ++i)
			rendered += list[indices[i]];

		rendered = rendered.replace(/\n/g, '<br>');
		rendered = rendered.replace(' ', '&nbsp;');
	}

	function output() {
		$('.sheet.real').html(rendered == '' ? '<gray>...</gray>' : rendered);
	}

	function blink()
	{
		var streak = $('.sheet + .fake + .cursor');

		if(!rendered)
		{
			streak.hide();
			return;
		}

		console.log(cursor);
		console.log(rendered.substring(0, cursor));
		
		var fake = $('.sheet.fake');
		fake.hide().show();
		fake.html(rendered.substring(0, cursor));
		var height = fake.outerHeight(), width = fake.outerWidth();

		var top = height - streak.outerHeight(), left = width;
		streak.show().css({ 'top': top + 'px', 'left': left + 'px' });
	}

});
