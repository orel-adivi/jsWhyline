/**
 * @date : 07 December 2022
 */
const acorn = require('acorn');
const walk = require('acorn-walk');
const escodegen = require('escodegen');
const fs = require('fs');

const input_file = './assets/example_input.js';
const logger_file = './assets/logger.js';
const output_file = './assets/example_output.js';
 
function read_file(filename) {
	return fs.readFileSync(filename, 'utf8');
}

function write_file(filename, content) {
	fs.writeFileSync(filename, content);
}

function instrument_scope(content, function_name) {
	let result = [];
	for(let i in content) {
		const curr_element = content[i];
		if(curr_element.type === 'ReturnStatement') {
			const curr_start = content[i].argument.start;
			const raw_value = curr_element.argument.raw;
			const return_command = acorn.parse(`Logger.return_function('${function_name}', ${curr_start}, ${raw_value})`).body[0];
			result.push(return_command);
		} else if(curr_element.body != null) {
			curr_element.body.body = instrument_scope(curr_element.body.body, function_name);
		} else if(curr_element.consequent != null) {
			curr_element.consequent.body = instrument_scope(curr_element.consequent.body, function_name);
		}  else if(curr_element.block != null) {
			curr_element.block.body = instrument_scope(curr_element.block.body, function_name);
			if(curr_element.handler != null) {
				curr_element.handler.body.body = instrument_scope(curr_element.handler.body.body, function_name);
			}
			if(curr_element.finalizer != null) {
				curr_element.finalizer.body = instrument_scope(curr_element.finalizer.body, function_name);
			}
		}
		result.push(curr_element);
	}
	return result;
}

function instrument_function_body(node) {
	const name = node.id.name;
	const content = node.body.body;
	const start = node.start;
	const end = node.end;

	const start_command = acorn.parse(`Logger.enter_function('${name}', ${start})`).body[0];
	const end_command = acorn.parse(`Logger.exit_function('${name}', ${end})`).body[0];
	const try_command = acorn.parse(`try{ let x = 0 } finally { let x = 1 }`).body[0];

	try_command.block.body = instrument_scope(content, name);
	try_command.finalizer.body = [end_command];
	return [start_command, try_command];
}

function main() {
	const content = read_file(input_file);
	const logger = read_file(logger_file);
	const ast = acorn.parse(content);

	walk.full(ast, node => {
		if(node.type === 'FunctionDeclaration') {
			node.body.body = instrument_function_body(node);
		}
	})

	const code = logger + '\n' + escodegen.generate(ast);
	write_file(output_file, code);
	console.log('Instrumentation has done!');
}

main();
