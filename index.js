const { exec } = require('node:child_process');
const color = require('colors/safe');
const util = require('util');

const asyncExec = util.promisify(exec);

const commands = [
    {tool: 'Git', command: 'git -v'},
    {tool: 'Docker', command: 'docker -v'},
    {tool: 'Node.js', command: 'node -v'},
    {tool: 'npm', command: 'npm -v'},
    {tool: 'nvm', command: 'nvm -v'}
];

async function checkTool(tool) {
    try {
        const {stdout, stderr} = await asyncExec(tool.command);
        const version = (stdout || stderr).trim();
        console.log(color.green(`${tool.tool}'s version is ${version}`));
    }
    catch (error) {
        throw new Error(`${tool.tool} was not found.`)
    }
}

async function checkTools() {
    for(const tool of commands){
        try{
            await checkTool(tool);
        }
        catch (error){
            console.error(color.red(error.message));
            process.exitCode = 1;
            return;
        }
    }
}

checkTools().then(() => {
    if (process.exitCode === 1){
        console.error(color.red('Not all tools installed.'));
    }
    else {
        console.log(color.green('All the tools are installed.'));
    }
});