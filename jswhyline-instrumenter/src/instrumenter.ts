/**
 *  @file : instrumenter.ts
 *  @author : Orel Adivi
 *  @date : 18 April 2023
 */
import { parse, Node } from 'acorn';
import { generate } from 'escodegen';

import { traverse_folder, read_file, write_file } from './files'


type has_body = {
	body: object[];
}

type has_consequent = {
	consequent: Node;
}

type has_consequent_list = {
	consequent_list: object[];
}

type has_alternate = {
    alternate: Node | null;
}

type has_cases = {
	cases: Node[];
}


export function instrument_try_catch(node: Node, context?: object[], index?: number): void {
	// todo
}

export function instrument_function(node: Node, context?: object[], index?: number): void {
	// todo
}

export function instrument_body(context: object[]): void {
	for(let i: number = context.length; i >= 0; i--) {
		instrument_node(context[i] as Node, context, i);
	}
}

// See https://github.com/estree/estree/blob/master/es5.md for documentation
export function instrument_node(node: Node, context?: object[], index?: number): void {
	switch(node.type) {

		// --- Nodes with 'body' ---
		// Note: 'FunctionBody' is treated differently
		case 'Program':
		case 'BlockStatement':
		case 'WithStatement':
			instrument_body((<unknown>node as has_body).body)
			break;
		
		// --- Flow-Changing Statements ---
		case 'ReturnStatement':
			// todo
		case 'BreakStatement':
			// todo
		case 'ContinueStatement':
			// todo
		case 'ThrowStatement':
			// todo
			break;
		
		// --- Control Flow ---
		case 'IfStatement':
			instrument_node((<unknown>node as has_consequent).consequent, context, index);
			if((<unknown>node as has_alternate).alternate !== null) {
				instrument_node((<unknown>node as has_alternate).alternate!, context, index);
			}
			break;
		case 'SwitchStatement':
			for(const element of (<unknown>node as has_cases).cases) {
				instrument_node(element, context, index);
			}
			break;
		case 'SwitchCase':
			instrument_body((<unknown>node as has_consequent_list).consequent_list);
			break;
		
		// --- Loops ---
		case 'WhileStatement':
		case 'DoWhileStatement':
		case 'ForStatement':
		case 'ForInStatement':
			// todo
			break
		
		// --- Functions: ---
		case 'FunctionDeclaration':
			// todo
			break
		case 'FunctionExpression':
			// todo
			break
	}

}

export function instrument_file(input: string, output: string): void {
    const content: string = read_file(input);
    const ast = parse(content, {
        ecmaVersion: 6,
        ranges: true,
    });
	instrument_node(ast);
	console.log(ast);
    const code: string = generate(ast);
    write_file(output, code);
}

export function instrument_directory(input: string, output: string): void {
    let counter: number = 0;
    for(const file of traverse_folder(input, output)) {
        const curr_input: string = file.input;
        const curr_output: string = file.output;
        instrument_file(curr_input, curr_output);
        counter++;
    }
    console.log('Instrumentation has done (' + counter + ' file(s) were instrumented)!')
}



/*

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
	const logger = read_file(logger_file);

	walk.full(ast, node => {
		if(node.type === 'FunctionDeclaration') {
			node.body.body = instrument_function_body(node);
		}
	})

	const code = logger + '\n' + escodegen.generate(ast);
}

*/
