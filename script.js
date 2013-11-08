$(document).ready(function() {

	plain = '';
	features = [/* { type:'strong', from:3, to:7 } */];
	list = [/* plain:'a', string:'<strong>a' */];
	rendered = '';

	types = {
		strong: { regex: /\*[^\s][^\*]+[^\s]\*/g, before: '<strong>', after: '</strong>' },
		h1: { regex: /\n\#{1}[^\#\n]*\n/g, before: '<h1>', after: '</h1>' },
		h2: { regex: /\n\#{2}[^\#\n]*\n/g, before: '<h2>', after: '</h2>' },
		h3: { regex: /\n\#{3}[^\#\n]*\n/g, before: '<h3>', after: '</h3>' },
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
		list = $.map(plain.split(''), function(character) {
			return { plain: character, string: character };
		});

		$.each(features, function(index, feature) {
			if(types[feature.type])
			{
				list[feature.from].string = types[feature.type].before + list[feature.from].plain;
				list[feature.to].string = list[feature.to].plain + types[feature.type].after;
			}
		});
	}

	function render() {
		rendered = '';

		$.each(list, function(index, element) {
			rendered += element.string;
		});

		rendered = rendered.replace(/\n/g, '<br>');
	}

	function output() {
		$('#sheet').html(rendered == '' ? '...' : rendered);
	}

});
