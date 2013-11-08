$(document).ready(function() {

	plain = '';
	features = [/* { type:'strong', from:3, to:7 } */];
	list = [/* plain:'a', string:'<strong>a' */];
	rendered = '';

	$(document).keypress(function(e) {
		input(e);
		update();
	});

	function update() {
		fetch();
		format();
		render();
		console.log(rendered);
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
			//plain += '<br>';
			break;
		default:
			plain += character;
		}
	}

	function keyevent(e) {
		var pressed;
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
		// reset
		features = [];

		// strong
		var regex = /\*[^\s][^\*]+[^\s]\*/g;
		var i;
		while(i = regex.exec(plain))
			features.push({ type: 'strong', from: i.index, to: i.index + i[0].length - 1 });

		// headline
		var regex = /\#\s.+\n/g;
		var i;
		while(i = regex.exec(plain))
			features.push({ type: 'headline', from: i.index, to: i.index + i[0].length - 1 });
	}

	function format() {
		// reset
		list = $.map(plain.split(''), function(character) {
			return { plain: character, string: character };
		});

		$.each(features, function(index, feature) {
			// strong
			switch(feature.type)
			{
			case 'strong':
				list[feature.from].string = '<strong>' + list[feature.from].plain;
				list[feature.to].string = list[feature.to].plain + '</strong>';
				break;
			case 'headline':
				list[feature.from].string = '<h1>' + list[feature.from].plain;
				list[feature.to].string = list[feature.to].plain + '</h1>';
				break;
			}
		});
	}

	function render() {
		// reset
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
