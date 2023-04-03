/**
 *  @file : files.ts
 *  @author : Orel Adivi
 *  @date : 04 April 2023
 */
import { existsSync, mkdirSync, readdirSync, lstatSync, readFileSync, writeFileSync} from 'fs';
import { join } from 'path';
import { expect } from 'earl';

export type file_location = {
    input: string;
    output: string;
}

export function* traverse_folder(input: string, output: string): Generator<file_location> {
    const input_list: Array<string> = [input];
    const output_list: Array<string> = [output];
    while(input_list.length != 0) {
        expect(input_list.length).toEqual(output_list.length);
        const curr_input: string = input_list.pop()!;
        const curr_output: string = output_list.pop()!;
        if (! existsSync(curr_output)) {
            mkdirSync(curr_output);
        }
        for(const curr_location of readdirSync(curr_input)) {
            if(lstatSync(join(curr_input, curr_location)).isFile()) {
                const location_data: file_location = {
                    input: join(curr_input, curr_location),
                    output: join(curr_output, curr_location),
                };
                yield location_data;
            } else if(lstatSync(join(curr_input, curr_location)).isDirectory() && ! curr_location.startsWith('.')) {
                input_list.push(join(curr_input, curr_location));
                output_list.push(join(curr_output, curr_location));
            }
        }
    }
    expect(input_list.length).toEqual(0);
    expect(input_list.length).toEqual(0);
}

export function read_file(filename: string): string {
	return readFileSync(filename, 'utf8');
}

export function write_file(filename: string, content: string): void {
	writeFileSync(filename, content);
}
