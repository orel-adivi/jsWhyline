class logger {

    constructor(input, log = null) {
        const fs = require('fs')
        this.input = input
        this.logger = log
        if(this.logger === null) {
            console.log(`----- Logger is run -----\n`)
        } else {
            const fs = require('fs')
            fs.writeFileSync(this.logger, `----- Logger is run -----\n`)
        }
    }

    log(content) {
        if(this.logger === null) {
            console.log(content)
        } else {
            const fs = require('fs')
            const curr_content = fs.readFileSync(this.logger, 'utf8')
            const full_content = curr_content + '\n' + content
            fs.writeFileSync(this.logger, full_content)
        }

    }

    pad_line(val, size = 4, filler = '0') {
        if('number' == typeof val) {
            val = val.toString()
        }
        while (val.length < size) {
            val = filler + val
        }
        return val
    }

    pad_line(val, size = 4, filler = '0') {
        if('number' === typeof val) {
            val = val.toString();
        }
        while (val.length < size) {
            val = filler + val;
        }
        return val;
    }

    print_location(offset) {
        const fs = require('fs')
        const content = fs.readFileSync(this.input, 'utf8')
        const lines = content.split(/\r\n|\r|\n/)

        const before_content = content.substring(0, offset)
        const before_lines = before_content.split(/\r\n|\r|\n/)
        const line = before_lines.length
        const line_offset = before_lines[before_lines.length - 1].length

        this.log(`+++++++++`)
        if(line > 1) {
            this.log(`++ ${this.pad_line(line - 1)} ++ `, `${lines[line - 2]}`)
        }
        this.log(`++ ${this.pad_line(line)} ++ `, `${lines[line - 1]}`)
        this.log(`++ HERE ++ `, `${line_offset > 0 ? (this.pad_line('', line_offset - 1, '-') + ' ') : ''}^`)
        if(line < lines.length - 1) {
            this.log(`++ ${this.pad_line(line + 1)} ++ ${lines[line]}`)
        }
        this.log(`+++++++++\n`)
    }

    enter_function(name, offset) {
        this.log(`Entered function '${name}':`)
        this.print_location(offset)
    }

    exit_function_implicitly(name, offset) {
        this.log(`Exited function '${name}' without an explicit return:`)
        this.print_location(offset)
    }

    exit_function_explicitly(name, offset, raw_value) {
        this.log(`Exited function '${name}' with an explicit return of value ${raw_value}:`)
        this.print_location(offset)
    }
}

let Logger = new logger('./assets/example_input.js')

/*
const targetNode = document.getElementsByTagName("html")[0];

const config = { attributes: true, childList: true, subtree: true };

const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            Logger.log('A child node has been added or removed.');
        } else if (mutation.type === 'attributes') {
            Logger.log(`The ${mutation.attributeName} attribute was modified.`);
        }
    }
});

observer.observe(targetNode, config);
*/
