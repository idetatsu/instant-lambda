# instant-lambda
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)  
Tiny command line tool to create, run, and deploy [AWS Lambda functions](https://aws.amazon.com/lambda/).

```
$ instant-lambda create your-awesome-lambda
```

## Installation
```
$ npm install -g instant-lambda
```

## Usage/Commands
Invoke 4 commands using either ```instalam``` or  ```instant-lambda```.
```
$ instalam create your-awesome-lambda
$ cd your-awesome-lambda
$ instalam run
$ instalam pack
$ instalam deploy
```

### create
```
$ instalam create <your-lambda-name>
```
Creates a new directory with your AWS Lambda name and sets up template files in the directory. The template files include ```app.js```, ```lambda-config.json```, ```deploy-config.json```, ```event.json```, and ```package.json```.

##### app.js
This is where you write your actuall Lambda function handler. Default handler method name is set to ```main```. However, this can be configured in ```lambda-config.json``` as well as handler file name, which is ```app``` by default.

##### lambda-config.json
This file is used to configure details of your Lambda. The JSON should look like
```
{
  "runtime": "nodejs6.10",
  "role": "arn:aws:iam::XXXXXXXXXXXX:my/iam/role",
  "handlerFile": "app",
  "handlerMethod": "main",
  "description": "My AWS Lambda function.",
  "timeout": "3",
  "memorySize": "128",
  "environment:": {
    "variables": {}
  },
  "functionName": "your-lambda-name"
}
```
See also [AWS.Lambda.createFunction - AWS SDK for JavaScript](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createFunction-property).

##### deploy-config.json
This file contains information which ```instalam deploy``` command uses to upload your Lambda to AWS. Currently ```deploy``` command retrieves only your AWS region from this JSON file.

##### event.json
If you wish to pass an event to your Lambda when you run it locally with ```instalam run``` command, you can do so by defining your event in this JSON file.

##### package.json
Of course you can use node packages in your Lambda!

### run
```
$ instalam run
```
Runs your Lambda locally. Passes an event defined in ```event.json``` to your Lambda.

### pack
```
$ instalam pack
```
Packages necessary files and all the dependencies in a zip file.

### deploy
```
$ instalam deploy
```
Uploads your packaged Lambda function to AWS. You need to run ```instalam pack``` before deploying.

## Test
Currently not configured.

## Contributing
1.Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request

## Author
[Tatsuro Ide](http://blog.theoroy.com)

## License
[MIT](https://opensource.org/licenses/MIT)
