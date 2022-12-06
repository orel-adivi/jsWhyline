/**
 * @date : 30 November 2022
 */
const acorn = require('acorn')
const walk = require('acorn-walk')
const escodegen = require('escodegen')
const fs = require('fs');

const input_file = './assets/example_input.js'
const output_file = './assets/example_output.js'

function read_file(filename) {
	return fs.readFileSync(filename, 'utf8');
}

function write_file(filename, content) {
	fs.writeFileSync(filename, content);
}

function generate_new_body(name, content) {
	const start_command = acorn.parse(`console.log(\"Entered function '${name}'.\")`).body[0]
	const end_command = acorn.parse(`console.log(\"Exited function '${name}'.\")`).body[0]
	const try_command = acorn.parse(`try{ let x = 0 } finally { let x = 1 }`).body[0]
	try_command.block.body = content
	try_command.finalizer.body = [end_command]
	return [start_command, try_command]
}

function main() {
	let content = read_file(input_file)
	let ast = acorn.parse(content)
	walk.full(ast, node => {
		if(node.type === 'FunctionDeclaration') {
			node.body.body = generate_new_body(node.id.name, node.body.body);
		}
	})
	let code = escodegen.generate(ast)
	write_file(output_file, code)
	console.log('Instrumentation has done!')
}

main()
