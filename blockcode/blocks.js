(function(global){
	'use strict';

	function createBlock(name, value, contents){
		var item = elem('div', {'class': 'block', draggable: true, 'data-name': name}, [name]);
		if (value !== undefined){
			item.appendChild(elem('input', {type: 'number', value: value}));
		}
		if (Array.isArray(contents)){
			item.appendChild(elem('div', {'class': 'container'}, contents.map(function(block){
				return createBlock.apply(null, block);
			})));
		}
		return item;		
	}

	function blockContents(block){
		var container = block.querySelector('.container');
		return container ? [].slice.call(container.children) : null;
	}

	function blockValue(block){
		var input = block.querySelector('input');
		return input ? Number(input.value) : null;
	}

	function blockScript(block){
		var script = [block.dataset.name];
		script.push(blockValue(block));
		var contents = blockContents(block);
		if (contents){script.push(contents.map(blockScript));}
		return script.filter(function(notNull){ return notNull !== null; });
	}

	function runBlocks(blocks){
		blocks.forEach(function(block){ trigger('run', block); });
	}

	global.Block = {
		create: createBlock,
		value: blockValue,
		contents: blockContents,
		script: blockScript,
		run: runBlocks,
		trigger: trigger
	};

	window.addEventListener('unload', file.saveLocal, false);
	window.addEventListener('load', file.restoreLocal, false);
})(window);