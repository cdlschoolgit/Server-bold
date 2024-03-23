const pino = require('pino');
const { exec } = require('child_process');

// Create a child process for pino-pretty
const child = exec('pino-pretty');

// Pipe the child process output to process.stdout
child.stdout.pipe(process.stdout);

// Create a pino logger
const logger = pino({
  name: 'Student Assessment',
  // Pipe the logger output to the child process input
  stream: child.stdin,
});

module.exports = logger;
