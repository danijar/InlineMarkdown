$(document).ready(function() {

	var plain = '';
	var features = [];

	var list = '';
	var indices = [];

	var rendered = '';

	var cursor = 0;

	var types = {
		bold:   { regex: /\*\*[^\*\s]([^\*]|(\*\s))*[^\*\s]\*\*/g, before: '<b>', after: '</b>' },
		italic: { regex: /\*[^\*\s]([^\*]|(\*\s))*[^\*\s]\*/g, before: '<i>', after: '</i>' },
		h1: { regex: /^#{1}([^#]|$).*$/mg, before: '<h1>', after: '</h1>' },
		h2: { regex: /^#{2}([^#]|$).*$/mg, before: '<h2>', after: '</h2>' },
		h3: { regex: /^#{3}([^#]|$).*$/mg, before: '<h3>', after: '</h3>' },
		h4: { regex: /^#{4}([^#]|$).*$/mg, before: '<h4>', after: '</h4>' },
		h5: { regex: /^#{5}([^#]|$).*$/mg, before: '<h5>', after: '</h5>' },
		h6: { regex: /^#{6}([^#]|$).*$/mg, before: '<h6>', after: '</h6>' },
	};

	$(document).keypress(function(e) {
		input(e);
		update();
	});

	function update() {
		console.clear();
		fetch();
		format();
		render();
		cursor_insert();
		output();
		cursor_display();
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
		indices = _.range(0, list.length);

		_.each(features, function(feature) {
			if(feature.type in types) {
				var type = types[feature.type];
				console.log(type);
				implace(feature.from, type.before);
				implace(feature.to + 1, type.after);
				//var string = plain.substring(feature.from, feature.to + 1);
				//replace(feature.from, feature.to, type.callback(string));
			}
		});

		//console.log(list);
		//console.log(indices);
	}

	function implace(position, string) {
		var index;
		for(var i = 0; i < indices.length; ++i)
			if(indices[i] == position)
				index = i;

		if(index === undefined) { console.log("cannot insert"); return; }
		
		var start = list.length;
		var end = start + string.length;
		list += string;

		var spliced = indices.splice.apply(indices, [index, 0].concat(_.range(start, end)));

		//console.log("from " + from + " to " + to + " spliced " + spliced);
	}

	function replace(plain_from, plain_to, string) {
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
		//rendered = rendered.replace(' ', '&nbsp;'); // only multiple whitespaces and outside of tags
	}

	function cursor_insert()
	{
		var index;
		if(cursor == plain.length)
			index = rendered.length;
		else
			for(var i = 0; i < rendered.length; ++i)
				if(indices[i] == cursor)
					index = i;

		console.log("text   plain " + plain.length + " formatted " + rendered.length);
		console.log("cursor plain " + cursor + " formatted " + index);

		if(index === undefined) { console.log("cursor not found"); index = rendered.length; }
		rendered = insert(rendered, index, '<span class="curpos" at="' + cursor + '"></span>');
	}

	function insert(into, at, string)
	{
		return into.substring(0, at) + string + into.substring(at);
	}

	function cursor_display()
	{
		var streak = $('.cursor');
		if(rendered == '') {streak.hide(); return; }

		var offset = $('.curpos').offset();
		var top = offset.top - streak.outerHeight() * 0.8, left = offset.left;

		streak.show().css({ 'top': top + 'px', 'left': left + 'px' });
	}

	function output() {
		$('.sheet.real').html(rendered == '' ? '<gray>...</gray>' : rendered);
	}

});
