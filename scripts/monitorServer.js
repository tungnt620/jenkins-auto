const axios = require('axios')
const https = require('https')

const express = require('express')
const app = express()
const port = 5678

const username = 'tungnguyenthanh' // Your jenkins username
const token = '11c0aca69a36'  // Your jenkins api token, find at https://jenkins.com/user/{username}/configure
const jobMonitors = [
  'https://jenkins.com/job/Admin-API-UAT/',
  'https://jenkins.com/job/Admin-FE-UAT/',
] // Add jobs you want to monitor

const oldJobsData = {}
let notifies = []

const sendRequest = (url, method = 'POST', cb) => {
  const options = {
    method: method,
    url: url,
    auth: {
      username: username,
      password: token,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  }

  axios(options)
    .then(res => {
      if (res.status === 200) {
        cb(res.data)
      } else {
        console.log(res.data)
      }
    })
    .catch(err => {
      console.log(err.toString())
    })
}

function getJobResultNotify (jobData) {
  const jobLinkRegex = /.+(\/job\/(.+)\/)\d+\//
  const matchGroups = jobData.url.match(jobLinkRegex)

  const jobName = matchGroups[2].replace(/%20/g, ' ')

  return {
    title: jobData.result,
    message: jobName,
    url: `https://jenkins.com${matchGroups[1]}`,
  }
}

function getLastBuildStatus (jobLink) {
  const apiUrl = `${jobLink}lastBuild/api/json`

  const lastJobData = oldJobsData[jobLink]
  sendRequest(apiUrl, 'POST', respData => {
    const newJobData = respData
    oldJobsData[jobLink] = newJobData

    if (lastJobData && (newJobData.id !== lastJobData.id || newJobData.result !== lastJobData.result)) {
      if (newJobData.result) {
        const notify = getJobResultNotify(newJobData)
        console.log(notify.message + ' ' + notify.title)
        notifies.push(notify)
      }
    }
  })
}

setInterval(() => {
  jobMonitors.forEach(jobLink => {
    getLastBuildStatus(jobLink)
  })
}, 3000)

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*, Authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', 'POST,GET,DELETE,PATCH,OPTIONS,PUT')
  res.header('Access-Control-Allow-Credentials', 'true')

  if ('OPTIONS' === req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.get('/notifies/', (req, res) => {
  res.json(notifies)
  notifies = []
})

app.listen(port, () => console.log(`Monitor Jenkins server run at port ${port}!`))
