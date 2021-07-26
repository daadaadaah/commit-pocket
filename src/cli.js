
"use strict"
import program from 'commander';
import pjson from '../package.json';
import start from "./index";

program.on('--help', () => {
    console.log('                  Git Commit Pocket CLI');
    console.log('                  Usage: commit-pocket [Option]');
    console.log('                  Option: ');
    console.log('                      -h:  Display this help message');
})

program
    .version(pjson.version)
    .description('this is a simple git commit pocket.')
    .action((options) => {
        start()
    })

// 해당되는 command가 없을 경우 실행되는 command
program.command('*', { noHelp: true }).action(() => {
    console.log('cannot find commander.');
    program.help();
})

program.parse(process.argv);