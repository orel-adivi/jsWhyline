/**
 *  @file : runner.ts
 *  @author : Orel Adivi
 *  @date : 04 April 2023
 */
import { Command } from 'commander';
import { expect } from 'earl';

import { instrument_directory } from './instrumenter';

const program: Command = new Command();
program
    .name('jsWhyline Instrumentation Tool')
    .description('provide input file and output location for the instrumentation.')
    .version('1.0.0')
    .requiredOption('-i, --input <input>', 'input JavaScript folder')
    .requiredOption('-o, --output <output>', 'output JavaScript folder')

program.parse(process.argv);
const options: any = program.opts();
expect(options === undefined || options.input === undefined || options.output === undefined).toEqual(false);

const input: string = options.input;
const output: string = options.output;
instrument_directory(input, output);
