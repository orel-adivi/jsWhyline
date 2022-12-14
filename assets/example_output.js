const node_supported = typeof process != 'undefined';

class logger {
    constructor(input, log = null) {
        // const fs = require('fs');
        this.input = input;
        this.logger = log;
        this.depth = 0;
        this.event_log = [];
        if(this.logger === null) {
            console.log(`----- Logger is running -----\n`);
        } /* else {
            const fs = require('fs')
            fs.writeFileSync(this.logger, `----- Logger is running -----\n`);
        } */
    }

    log(content) {
        if(this.logger === null) {
            console.log(content);
        } /*else {
            const fs = require('fs');
            const curr_content = fs.readFileSync(this.logger, 'utf8');
            const full_content = curr_content + '\n' + content;
            fs.writeFileSync(this.logger, full_content);
        } */

    }

    document_event(content) {
        this.event_log.push([this.depth, content]);
        this.log(`${content}:`);
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

    print_events() {
        console.log('List of events:');
        for(let i in this.event_log) {
            const depth = this.event_log[i][0];
            const message = this.event_log[i][1];
            console.log(`| ${this.pad_line('', depth * 6, ' ')} |${this.pad_line('', 4, '-')} ${message}.`);
        }
        console.log('End of events.');
    }

    print_location(offset) {
        if (node_supported) {
            const fs = require('fs');
            const content = fs.readFileSync(this.input, 'utf8');
            const lines = content.split(/\r\n|\r|\n/);

            const before_content = content.substring(0, offset);
            const before_lines = before_content.split(/\r\n|\r|\n/);
            const line = before_lines.length;
            const line_offset = before_lines[before_lines.length - 1].length;

            this.log(`++++++++++`);
            if (line > 1) {
                this.log(`++ ${this.pad_line(line - 1)} ++ ${lines[line - 2]}`);
            }
            this.log(`++ ${this.pad_line(line)} ++ ${lines[line - 1]}`);
            this.log(`++ HERE ++ ${line_offset > 0 ? (this.pad_line('', line_offset - 1, '-') + ' ') : ''}^`);
            if (line < lines.length - 1) {
                this.log(`++ ${this.pad_line(line + 1)} ++ ${lines[line]}`);
            }
            this.log(`++++++++++\n`);
        }
    }

    enter_function(name, offset) {
        this.document_event(`Entered function '${name}'`);
        this.print_location(offset);
        this.depth++;
    }

    exit_function(name, offset) {
        this.depth--;
        this.document_event(`Exited function '${name}'`);
        this.print_location(offset);
    }

    return_function(name, offset, raw_value) {
        this.document_event(`Function '${name}' has return the value ${raw_value}`);
        this.print_location(offset);
    }
}

let Logger = new logger('./assets/example_input.js');

// require("browser-or-node").isBrowser
if(!node_supported) {
    const targetNode = document.getElementsByTagName("html")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                console.log(mutation)
                Logger.document_event('A child node has been added or removed.');
            } else if (mutation.type === 'attributes') {
                Logger.document_event(`The ${mutation.attributeName} attribute was modified.`);
            }
        }
    });

    observer.observe(targetNode, config);
}

const a = 5;
function not_called(param) {
    Logger.enter_function('not_called', 16);
    try {
        const b = 6;
        const c = 7;
        try {
            Logger.return_function('not_called', 107, 1);
            return 1;
        } catch (e) {
            Logger.return_function('not_called', 145, 2);
            return 2;
        } finally {
            Logger.return_function('not_called', 181, 3);
            return 3;
        }
    } finally {
        Logger.exit_function('not_called', 193);
    }
}
function called(param) {
    Logger.enter_function('called', 197);
    try {
        const d = 8;
        not_called(1);
        if (d > 0) {
            while (1 < 0) {
                for (let i = 1; i < 10; i++) {
                    Logger.return_function('called', 368, 'hello');
                    return 'hello';
                }
                Logger.return_function('called', 411, 8.9);
                return 8.9;
            }
            Logger.return_function('called', 443, 8.5);
            return 8.5;
        }
        Logger.return_function('called', 467, 9);
        return 9;
        Logger.return_function('called', 482, 'a');
        return 'a';
        let e = 10;
    } finally {
        Logger.exit_function('called', 506);
    }
}
let f = 11;
called(12);
Logger.print_events();