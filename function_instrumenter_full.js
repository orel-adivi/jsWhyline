/**
 * @date : 30 November 2022
 */
const acorn = require('acorn')
const walk = require('acorn-walk')
const escodegen = require('escodegen')
const fs = require('fs')

const input_file = './assets/example_input.js'
const logger_file = './assets/logger.js'
const output_file = './assets/example_output.js'
 
function read_file(filename) {
	return fs.readFileSync(filename, 'utf8')
}

function write_file(filename, content) {
	fs.writeFileSync(filename, content)
}

function generate_new_body(node) {
	console.log(node)
	const name = node.id.name
	const content = node.body.body
	const start = node.start
	const end = node.end

	const start_command = acorn.parse(`Logger.enter_function('${name}', ${start})`).body[0]
	const end_command = acorn.parse(`Logger.exit_function_implicitly('${name}', ${end})`).body[0]

	let result = [start_command]
	for(let i in content) {
		const curr_element = content[i]
		if(curr_element.type === 'ReturnStatement') {
			const curr_start = content[i].argument.start
			const raw_value = curr_element.argument.raw
			const return_command = acorn.parse(`Logger.exit_function_explicitly('${name}', ${curr_start}, ${raw_value})`).body[0]
			result.push(return_command)
		}
		result.push(curr_element)
	}
	result.push(end_command)
	return result
}

function main() {
	const content = read_file(input_file)
	const logger = read_file(logger_file)
	const ast = acorn.parse(content)

	walk.full(ast, node => {
		if(node.type === 'FunctionDeclaration') {
			node.body.body = generate_new_body(node)
		}
	})

	const code = logger + '\n' + escodegen.generate(ast)
	write_file(output_file, code)
	console.log('Instrumentation has done!')
}

main()
