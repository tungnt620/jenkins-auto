# This project do two things:
- Script for deploy to jenkins
- A chrome extension for notify when jobs done

## Pre conditions:
- Have username and api token in jenkins
  - Api token get at Configure tab on account info page

## Deploy to jenkins
  - Change params in script deploy.js:
      ```
        const username = 'tungnguyenthanh'
        const token = 'sadsadsadsadsea450aca69a36'
        const projectBuildUrl = 'https://jenkins.com/job/Admin-FE-UAT/build'
      ```
  - Add any envs as you want, example for test env:
      ```
      const testParam = commit => {
        return {
          parameter: [
            { name: 'Environment', value: 'test' },
            { name: 'COMMIT', value: commit },
          ],
        }
      }
      ```
  - Install packages:
      ```
      npm install
      ```
  - Deploy steps:
    1. Create tag in git
    2. Run command
        ```
        node scripts/deploy.js env_name tag_name
        ```

## Monitor Jenkins jobs
### How it work
 - We have a monitor server which use for interval fetch status of jobs
 - This monitor server also serve a api get notifies which used by chrome-ext-notify
 - Chrome-ext-notify interval fetch notifies from monitor server and display it.
 
### Setup
 - Change variables:
    ```
    const username = 'tungnguyenthanh'
    const token = 'sadsadsadsadsea450aca69a36'
    const jobMonitors = ['https://jenkins.com/job/Admin-FE/']
    ```
    - `jobMonitors` contain jobs you want to monitor
 - Install packages:
      ```
      npm install
      ``` 
 - Run steps:
    1. In Chrome load unpacked extension and source is directory `chrome-ext-notify`
    2. Run command
        ```
        node scripts/monitorServer.js
        ```
