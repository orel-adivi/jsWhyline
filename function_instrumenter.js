const acorn = require('acorn')
const walk = require('acorn-walk')
const escodegen = require('escodegen')
const fs = require('fs');
const input_file = './example_input.js'
const output_file = './example_output.js'
 
function read_file(filename) {
	return data = fs.readFileSync(filename, 'utf8');
}

function write_file(filename, content) {
	fs.writeFileSync(filename, content);
}

function generate_new_body(name, content) {
	const start_command = acorn.parse(`console.log(\"Entered function '${name}'.\")`).body[0]
	const end_command = acorn.parse(`console.log(\"Exited function '${name}' without an explicit return.\")`).body[0]
	var result = [start_command]
	for(i in content) {
		const curr_element = content[i]
		if(curr_element.type == 'ReturnStatement') {
			const return_command = acorn.parse(`console.log(\"Exited function '${name}' with an explicit return of value ${curr_element.argument.raw}.\")`).body[0]
			result.push(return_command)
		}
		result.push(curr_element)
	}
	result.push(end_command)
	return result
}

function main() {
	content = read_file(input_file)
	ast = acorn.parse(content)
	walk.full(ast, node => {
		if(node.type == 'FunctionDeclaration') {
			node.body.body = generate_new_body(node.id.name, node.body.body);
		}
	})
	code = escodegen.generate(ast)
	write_file(output_file, code)
	console.log('Instrumentation has done!')
}

main()
