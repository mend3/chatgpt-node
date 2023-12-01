import chalk from 'chalk';
import debug from 'debug';

// Define your custom namespace for debugging
const namespace = 'node-gpt';

// Create a debug instance for your namespace
const log = debug(namespace);

// Define custom colors for different log levels
const colors = {
  info: chalk.blue,
  log: chalk.dim,
  warn: chalk.yellow,
  error: chalk.red,
  debug: chalk.cyan,
} as const;

// Define custom logger function
const customLogger = (level: keyof typeof colors, message: string) => {
  const color = colors[level] || chalk.white;
  const coloredMessage = color(message);

  // Log the colored message
  log(coloredMessage);
};

export const logger = {
  log: (message: any) => customLogger('log', message),
  info: (message: any) => customLogger('info', message),
  warn: (message: any) => customLogger('warn', message),
  error: (message: any) => customLogger('error', message),
  debug: (message: any) => customLogger('debug', message),
};
