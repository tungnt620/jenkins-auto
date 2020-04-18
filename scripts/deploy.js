const axios = require('axios')
const https = require('https')
const qs = require('qs')

const username = 'tungnguyenthanh'
const token = 'sadsadsadsadsea450aca69a36'
const projectBuildUrl = 'https://jenkins.com/job/project/build'

const sendDeployRequest = parameter => {
  const options = {
    method: 'POST',
    url: projectBuildUrl,
    auth: {
      username,
      password: token,
    },
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(parameter),
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  }

  axios(options)
    .then(res => {
      console.log('Deploy success')
    })
    .catch(err => {
      console.log(err.toString())
      console.log(err)
    })
}


function deploy(parameter) {
  sendDeployRequest({
    json: JSON.stringify(parameter),
  })
}

const args = process.argv
const env = args[2]
const commit = args[3]

const testParam = commit => {
  return {
    parameter: [
      { name: 'Environment', value: 'test' },
      { name: 'COMMIT', value: commit },
    ],
  }
}

const parameters = {
  test: testParam,
}

if (env in parameters) {
  deploy(parameters[env](commit))
} else {
  console.log('Not exist env')
}
