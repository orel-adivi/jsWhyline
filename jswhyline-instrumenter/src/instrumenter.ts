/**
 *  @file : instrumenter.ts
 *  @author : Orel Adivi
 *  @date : 04 April 2023
 */
const acorn = require('acorn');
const walk = require('acorn-walk');
const escodegen = require('escodegen');

import { traverse_folder, read_file, write_file } from './files'



export function instrument_file(input: string, output: string): void {
    console.log(input);
    const content: string = read_file(input);
    const code: string = content;
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
