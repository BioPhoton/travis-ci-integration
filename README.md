# Continuous integration with angular and travis
#### Implement continuous integration into your angular5 projects with travis and the command line

Travis is a continuous integration platform that provides free usage for open source projects.
Travis CI supports your development process by automatically building and testing code changes,
it provides feedback on the success of the change.
It can also automate other parts of your development process i.e. managing deployments.

This script checks the actual status of your travis project.
If you initialize travis over the cli it automatically checks the connected git repo and enables it in the platform.

In this article we will see how to setup a basic travis integration with angular 5.
We will start from scratch by creating a repository on github and initialize a new angular project.
Mostly of our work is done over the travis/angular/git cli's, so it should be pretty easy to follow.

**Preconditions:**

- github account
If you don't have already create an account on github.com/user
After the confirmation of you account you should be ready to go.

- git bash
You need a git cli running on your machine. If you are on a Windows OS you can use [git bash](https://git-for-windows.github.io/).

- travis-cli
Install travis-cli on your OS.
Find the travis-cli project on GitHub under [travis-ci](https://github.com/travis-ci/travis.rb).

- angular cli
To install the angular cli follow the steps on the [angular-cli](https://github.com/angular/angular-cli) repository.

Ok, ow we have installed all needed cli's and created the required accounts we can start straight away.
We will divide this article into two sections, 
First we will creation an repository and connecting it to travice and second we will implement a little helper script that checks our travis state. 

## Step1 - Create a repository and connect it to travice

Open `github.com` in your browser. 
After log in click on `repositories -> new repository`.
Enter the required information and save it.

**Create an angular project**
Next let's initialize the projects angular and npm setup:
`ng new travis-ci-integration`

Follow the instructions:

Yes, No, Yes... Detailed answers here.

`cd .\travis-ci-integration\`
Test it! `npm start` => should `ng serve` the repo

Show commits =>  `git log`

![Git log initial commit](https://raw.githubusercontent.com/BioPhoton/travis-ci-integration/master/resources/git-log_initial-commit.PNG)


**Connect to github**
Open up your browser again and visit github.com.
On the main page of the repository you will see a button that says clone or download.
Click this button and copy the https url that is displayed.

Now switch to your console and type in following to add a remote url: 
`git remote add origin https://github.com/[YOUR_USERNAME]/[YOUR_PROJECT_NAME].git`

If no errors occur push the changes to git:
`git push -u origin master`

**Setup travis**
First lets create a `.travis-ci.yml` file.
Again we will use the cli for this:

in the root folder of the project type:
`travis init`

You should see a similar output in your console:
```
Detected repository as [YOUR_USERNAME]/[YOUR_PROJECT_NAME], is this correct? |yes| 
```

Type `yes` and hit enter.

```
repository not known to Travis CI (or no access?)
triggering sync: . done

Main programming language used: |Ruby|
```

Type `node` and hit enter

```
.travis.yml file created!
[YOUR_USERNAME]/[YOUR_PROJECT_NAME]: enabled :)
```

Now we should be ready to test it. 
First lets open travis.ci in our browser and switch to the repositories section.
We should see our project in the list of repositories already enabled.

![Travis project enabled](https://raw.githubusercontent.com/BioPhoton/travis-ci-integration/master/resources/travis-ci_project-enabled.PNG)

Ok. Let's see if we did everything right. 
To our setup type `travis status` in the console.

You should get following message:
`no build yet for BioPhoton/travis-ci-integration`

**Configure the .travis.yml file**

Next we will setup the .travis.yml configurations. 

Open up the .travis.yml file and paste in following:
```
language: node_js

node_js:
- '8.6.0'

install:
  - npm install

script:
  - ng build -prod
```

This lines will declare the general languages that we use in this project,
it's versions as well as some additional steps in the travis build lifecycle.

The full list of steps in the build lifecycle looks like this:
1. OPTIONAL Install apt addons
2. OPTIONAL Install cache components
3. before_install
4. install
5. before_script
6. script
7. OPTIONAL before_cache (for cleaning up cache)
8. after_success or after_failure
9. OPTIONAL before_deploy
10. OPTIONAL deploy
11. OPTIONAL after_deploy
12. after_script

But in this small example we will focus on just 2 of them which are the 2 main steps for a build, `install` and `script`.
*install* install any dependencies required
*script* run the build script

Under the step `install` we have listed the `npm install` command. Obviously it installs all the npm packages.
Next we have the `script` step which will execute the `ng build -prod` command. This will build our angular application for production.

So far so good. Lets push our changes in `.travis.yml` to our repository

If we type `git status` into the console we will see that the `.travis.yml` is an iuntracked files in the repository. 
Let's add it be running `git add ./.travis.yml` in the console.

If We now run `git status` again we see that the file is now marked with green and appears under the changes to be committed.

To commit it just type `git commit -m "setup travis.yml"` and if everything is fine push it by running `git push` in the console.

Yay!! We successfully configured travis. Let's see how our job runs. To do so head over to your browser an open `https://travis-ci.org/` under your repositories your should see the running job of our repository.

![Git push initial commit](https://raw.githubusercontent.com/BioPhoton/travis-ci-integration/master/resources/git-push_initial.PNG)

When its done it should turn green like below.

![Travis job passed](https://raw.githubusercontent.com/BioPhoton/travis-ci-integration/master/resources/travis-ci_running-job.PNG)


Now after every new push we should trigger our job at travis again.
To test it just make some changes and `git push` them.

Now we can also test if the `travis-cli` works. Let's check the status of our repository on travis by running `travis status`.
We should see `build #1 passed` in our console.
 
So far so good.

Sets sum up what we did:
- setup an angular project
- connected it with a github repository
- initialized travis and configured it in the `.travis.yml` file
- we start a job on every push
- and are able to check the travis status over a cli command

## Step 2 - Create script and implement check

Now everything works we can setup a script that checks the build status of our repo
and perform other actions based on this result.

In case of invalid status it should exits.

1. checking the job state of or repo on travis.
There are two options one with additional information about the build 
`travis status`
and one without 
`travis status --no-interactive`

Let me explain this command in detail.

Every Travis command takes three global options:

```
-h, --help                       Display help
-i, --[no-]interactive           be interactive and colorful
-E, --[no-]explode               don't rescue exceptions
```

The `--interactive` options determines whether to include additional information and colors in the output or not (no colors on Windows at all).
If you don't set this option explicitly, you will run in interactive mode if you invoke the command directly in a shell and in non-interactive mode if you pipe it somewhere.

`travis` as you know is our command related to the travis cli. 
`status` will check the state of the travis job configured in our `travis.yml` file of the current repository. 
As we want to receive just the state we and no additional information about the build 
we use the flag `--no-interactive`.

If every thing works we should see an output similar to this:
![Travis status command](https://raw.githubusercontent.com/BioPhoton/travis-ci-integration/master/resources/travis-ci_status-commands.PNG)

2. Create travis-check.js file.
Let's create a `chore` folder in the root that groups all our tooling scripts.
`cd` into the folder and create a file called `travis-check.js`. 

Now we need to do some imports and module exports. Just follow the script below:
```javascript
// chore/travis-check.js

'use strict'

// Import utils and promisify exec method
const util = require('util')
const exec = util.promisify(require('child_process').exec)
// Import path and create path to the dist folder
const path = require('path')
const distPath = path.join(__base, 'dist')
// Stor the value of the job state you want to check.
// In this case we want to check if the job state is "passed"
const validState = 'passed'

// Export the function as module
module.exports = travisCheck

function travisCheck () {
  
}

```

3. Implement check
```javascript
// chore/travis-check.js
...

function travisCheck () {
  // checks the status of the last build of the current repository
  // --no-interactive disables the interactive mode
  // source: https://github.com/travis-ci/travis.rb/blob/master/README.md
  return exec('travis status --no-interactive', {cwd: distPath})
      .then((result) => {
        // Check if the job state is "passed"
        if (result.stdout === validState) {
          return Promise.resolve(result)
        } else {
          return Promise.reject(result)
        }
      })      
}
```

Lets test the script. In your console `cd` into the repos root folder and type `node ./chore/travis-check.js`

4. Use the script
What we now are able to do is perform actions based on the travis state. 
For example we could publish to npm only if the travis check passes.

Therefor lets create another script called publish-npm.js
In this file we required the previously created travis-check module and execute our `npm publish` command in the then block.

What we achieved now is that we can only publish on np if the build status of our repository on travis is passed.

```
// chore/release.js

'use strict'
// Import util and promisify exec method
const util = require('util')
const exec = util.promisify(require('child_process').exec)

// import path and build required paths
const path = require('path')
const base = path.join(__base, 'chore', 'scripts', 'tasks')
// Import travisCheck
const travisCheck = require(path.join(base, 'travis-check'))

// set debug mode
process.env.DEBUG = true

// chain travisCheck and npm publish command
return Promise.resolve()
    .then(() => travisCheck())
    .then(() =>  exec('npm publish', {cwd: path.join(config.libPath, 'dist')}))
.catch((err) => console.info('release error'.red, err.red))

```

Done! :-)
We finished a minimal setup with travis, checked the build state and can now release our project based on the build state.

You can find the final code on github.com under [angular5-travis-ci-integreation](https://github.com/BioPhotone/travis-ci-integreation).
I also did some small refactorings and changed the folder structure a bit, so the final code is a tiny bit more organized then here in the post.
