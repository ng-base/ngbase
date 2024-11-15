# NodeJs

## NodeJs is a JavaScript runtime built on Chrome's V8 JavaScript engine.

### NodeJs Features

NodeJs has several key features that make it a popular choice for web developers:

- **Asynchronous I/O**: NodeJs is designed to handle asynchronous I/O operations, making it well-suited for building scalable network applications.
- **Event-Driven Architecture**: NodeJs uses an event-driven architecture that allows you to build applications that respond to events in real-time.
- **NPM**: NodeJs comes with npm, a package manager that allows you to easily install and manage dependencies for your projects.
- **Cross-Platform**: NodeJs is cross-platform, meaning that you can run your NodeJs applications on Windows, macOS, and Linux.
- **Single-Threaded**: NodeJs uses a single-threaded event loop model to handle requests, which can make it more efficient for handling I/O-bound operations.
- **Non-Blocking I/O**: NodeJs uses non-blocking I/O operations to handle requests, which can make it more efficient for handling I/O-bound operations.

### NodeJs Architecture

NodeJs has a modular architecture that consists of several key components:

- **V8 Engine**: NodeJs uses the V8 JavaScript engine to execute JavaScript code.
- **Libuv**: NodeJs uses Libuv to handle asynchronous I/O operations.
- **Core Modules**: NodeJs comes with a set of core modules that provide basic functionality for building applications.
- **NPM**: NodeJs uses npm to manage dependencies and packages for your projects.

### NodeJs Example

Here's an example of a simple NodeJs application that creates a web server:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

server.listen(3000, 'foo.bar', () => {
  console.log('Server running at http://foo.bar:3000/');
});
```

In this example, we create an HTTP server that listens on port 3000 and responds with 'Hello, World!' to any requests.

### NodeJs Modules

NodeJs uses a module system that allows you to organize your code into reusable modules. NodeJs modules can be loaded using the `require` function, and can export values using the `module.exports` object.

Here's an example of a simple NodeJs module that exports a function:

```javascript
// greet.js
module.exports = function (name) {
  return `Hello, ${name}!`;
};
```

You can use this module in another file like this:

```javascript
// app.js
const greet = require('./greet');

console.log(greet('World'));
```

### NodeJs Event Loop

The event loop is a fundamental concept in NodeJs that allows for asynchronous operations to be handled efficiently. Despite NodeJs being single-threaded, the event loop enables it to perform non-blocking operations, making it possible to handle multiple tasks simultaneously without freezing the main thread.

#### Key Components

- **Call Stack**: The call stack is a data structure that keeps track of function calls. When a function is called, it gets pushed onto the stack, and when it returns, it gets popped off the stack.
- **Event Queue**: The event queue is a data structure that holds events to be processed by the event loop. When an asynchronous operation completes, its callback is added to the event queue.
- **Event Loop**: The event loop is responsible for processing events in the event queue and pushing them onto the call stack when the call stack is empty.
- **Microtask Queue**: The microtask queue is a data structure that holds microtasks, which are tasks that need to be executed before the next event loop iteration.

#### Event Loop Phases

1. **Timers**: The event loop starts by processing any timers that have expired.
2. **I/O Polling**: The event loop then checks for I/O events and adds their callbacks to the event queue.
3. **Check Phase**: The event loop executes any callbacks that are scheduled to run after the I/O polling phase.
4. **Close Callbacks**: The event loop executes any callbacks that are scheduled to run when a resource is closed.
5. **Microtasks**: The event loop processes any microtasks that are in the microtask queue.
6. **Next Tick**: The event loop processes any callbacks that are scheduled to run before the next event loop iteration.

### NodeJs Best Practices

When working with NodeJs, there are several best practices that you should follow to ensure that your applications are secure, performant, and maintainable:

- **Use npm**: Use npm to manage dependencies and packages for your projects.
- **Use Modules**: Use NodeJs modules to organize your code into reusable components.
- **Use Asynchronous I/O**: Use asynchronous I/O operations to handle requests efficiently.
- **Error Handling**: Implement error handling to handle exceptions and errors gracefully.
- **Security**: Follow security best practices to protect your applications from common security vulnerabilities.
- **Performance**: Optimize your code for performance by using efficient algorithms and data structures.
- **Testing**: Write unit tests to ensure that your code works as expected and is free of bugs.
- **Logging**: Use logging to track errors, monitor performance, and debug issues in your applications.
- **Monitoring**: Monitor your applications to identify performance bottlenecks, errors, and other issues.
- **Documentation**: Document your code to make it easier for other developers to understand and maintain.

### NodeJs Process

The `process` object is a global object in NodeJs that provides information about the current NodeJs process. You can use the `process` object to access environment variables, command-line arguments, and other information about the NodeJs process.

Here are some common properties and methods of the `process` object:

- `process.argv`: An array that contains the command-line arguments passed to the NodeJs process.
- `process.env`: An object that contains the environment variables for the NodeJs process.
- `process.exit()`: A method that exits the NodeJs process with the specified exit code.
- `process.cwd()`: A method that returns the current working directory of the NodeJs process.
- `process.pid`: A property that contains the process ID of the NodeJs process.
- `process.platform`: A property that contains the platform on which the NodeJs process is running.

### NodeJs Streams

NodeJs streams are a powerful feature that allows you to read and write data in chunks, making it possible to process large amounts of data efficiently. NodeJs streams are implemented using the `stream` module, which provides a set of classes and methods for working with streams.

There are four types of streams in NodeJs:

- **Readable Streams**: Readable streams are used to read data from a source, such as a file or network socket.
- **Writable Streams**: Writable streams are used to write data to a destination, such as a file or network socket.
- **Duplex Streams**: Duplex streams are streams that can be used for both reading and writing data.
- **Transform Streams**: Transform streams are streams that can modify or transform data as it passes through the stream.

Here's an example of reading data from a file using a readable stream:

```javascript
const fs = require('fs');

const readable = fs.createReadStream('file.txt');

readable.on('data', chunk => {
  console.log(chunk.toString());
});

readable.on('end', () => {
  console.log('Finished reading file');
});
```

In this example, we create a readable stream from a file and listen for the `data` event to read chunks of data from the file.

### NodeJs Events

NodeJs uses an event-driven architecture to handle asynchronous operations. Events are emitted by objects in NodeJs, and listeners can be attached to handle these events. The `EventEmitter` class in NodeJs provides a set of methods for working with events.

Here's an example of using the `EventEmitter` class to create a custom event emitter:

```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('Event emitted');
});

myEmitter.emit('event');
```

In this example, we create a custom event emitter by extending the `EventEmitter` class. We then attach a listener to the `event` event and emit the event to trigger the listener.

### NodeJs File System

NodeJs provides a set of modules for working with the file system, such as `fs`, `path`, and `os`. These modules allow you to read, write, and manipulate files and directories on the local file system.

Here's an example of reading a file using the `fs` module:

```javascript
const fs = require('fs');

fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

In this example, we use the `fs.readFile` method to read a file and log its contents to the console.

### NodeJs HTTP Module

NodeJs provides an `http` module that allows you to create HTTP servers and clients. You can use the `http` module to handle incoming HTTP requests, send HTTP responses, and make HTTP requests to other servers.

Here's an example of creating an HTTP server using the `http` module:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

In this example, we create an HTTP server that listens for incoming requests on port 3000 and responds with a simple text message.

### NodeJs Express

Express is a popular web framework for NodeJs that provides a set of features for building web applications and APIs. Express simplifies the process of handling HTTP requests, routing, middleware, and more.

Here's an example of creating a simple Express server:

```javascript
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

In this example, we create an Express server that listens for incoming requests on port 3000 and responds with a simple text message.

### NodeJs NPM

NPM (Node Package Manager) is a package manager for NodeJs that allows you to install, manage, and publish packages for your NodeJs projects. NPM provides a command-line interface for working with packages and dependencies.

Here are some common NPM commands:

- `npm install <package>`: Installs a package in your project.
- `npm install -g <package>`: Installs a package globally on your system.
- `npm init`: Initializes a new NodeJs project.
- `npm start`: Starts the NodeJs application.
- `npm test`: Runs the tests for the NodeJs application.
- `npm publish`: Publishes a package to the NPM registry.

### NodeJs multi-threading

NodeJs is single-threaded, meaning that it runs on a single thread and uses non-blocking I/O operations to handle multiple requests concurrently. However, you can use the `cluster` module in NodeJs to create multiple worker processes that run on separate threads.

Here's an example of using the `cluster` module to create a multi-threaded NodeJs application:

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end('Hello, World!');
    })
    .listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

In this example, we create multiple worker processes using the `cluster` module, each running on a separate thread. The master process manages the worker processes and distributes incoming requests to them.

## Nodejs child process

NodeJs provides a set of modules for working with child processes, such as `child_process`, `cluster`, and `worker_threads`. These modules allow you to create new processes, execute commands in separate processes, and communicate between parent and child processes.

List of events in NodeJs child process:

- `close`: Emitted when the child process exits.
- `disconnect`: Emitted when the child process disconnects from the parent process.
- `error`: Emitted when an error occurs in the child process.
- `exit`: Emitted when the child process exits.
- `message`: Emitted when the child process sends a message to the parent process.

Here's an example of using the `child_process` module to create a new process and execute a command:

### NodeJs spawn

The `spawn` method in NodeJs is used to create a new process and execute a command in that process. The `spawn` method is part of the `child_process` module in NodeJs.

Here's an example of using the `spawn` method to execute a command in a new process:

```javascript
const { spawn } = require('child_process');

const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', data => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('error', data => {
  console.error(`stderr: ${data}`);
});

ls.on('close', code => {
  console.log(`child process exited with code ${code}`);
});
```

In this example, we use the `spawn` method to execute the `ls -lh /usr` command in a new process. We then listen for the `data` event on the `stdout` and `stderr` streams to read the output of the command.

### NodeJs exec

The `exec` method in NodeJs is used to create a new process and execute a command in that process. The `exec` method is part of the `child_process` module in NodeJs.

Here's an example of using the `exec` method to execute a command in a new process:

```javascript
const { exec } = require('child_process');

exec('ls -lh /usr', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

In this example, we use the `exec` method to execute the `ls -lh /usr` command in a new process. We then log the output of the command to the console.

### NodeJs fork

The `fork` method in NodeJs is used to create a new process and execute a NodeJs module in that process. The `fork` method is part of the `child_process` module in NodeJs.

Here's an example of using the `fork` method to execute a NodeJs module in a new process:

```javascript
const { fork } = require('child_process');

const child = fork('child.js');

child.on('message', message => {
  console.log(`Message from child: ${message}`);
});

child.send('Hello, child!');

child.on('exit', (code, signal) => {
  console.log(`Child process exited with code ${code}`);
});

// child.js
child.on('message', message => {
  console.log(`Message from parent: ${message}`);
});

process.send('Hello, parent!');
```

In this example, we use the `fork` method to execute the `child.js` module in a new process. We then listen for the `message` event to communicate between the parent and child processes.

### NodeJs Streams

Streams in NodeJs are objects that allow you to read or write data sequentially. Streams are used to process large amounts of data efficiently, without loading the entire data into memory.

There are four types of streams in NodeJs:

- Readable: Used to read data from a source.
- Writable: Used to write data to a destination.
- Duplex: Used to read and write data.
- Transform: Used to modify data as it is being read or written.

Here's an example of using streams in NodeJs:

```javascript
const fs = require('fs');

const readableStream = fs.createReadStream('input.txt');

const writableStream = fs.createWriteStream('output.txt');

readableStream.pipe(writableStream);
```

In this example, we create a readable stream to read data from the `input.txt` file and a writable stream to write data to the `output.txt` file. We then use the `pipe` method to transfer data from the readable stream to the writable stream.
