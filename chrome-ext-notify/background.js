function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const sendRequest = (url, method = 'GET', cb) => {
  let xhr = new XMLHttpRequest()
  xhr.open(method, url)

  xhr.send()

  xhr.onload = function () {
    if (xhr.status === 200) {
      if (cb) cb(xhr.responseText)
    }
  }
  xhr.onerror = function (err) {
    showNotify({
      title: 'Failed',
      message: 'Cant get status from monitor server'
    })
  }
}

const showNotify = (opt) => {
  const { url, ...rest } = opt
  const linkMap = {};

  chrome.notifications.create(uuidv4(), {
    type: 'basic',
    iconUrl: 'popup/images/jenkins.png',
    ...rest
  }, (notificationID) => {
    linkMap[notificationID] = url
  })

  if (url) {
    chrome.notifications.onClicked.addListener((notificationId, byUser) => {
      chrome.tabs.create({ url: linkMap[notificationId] })
    })
  }
}

function run () {
  console.log('call server to check')

  sendRequest('http://localhost:5678/notifies/', 'GET', (respText) => {
    const notifies = JSON.parse(respText)
    notifies.forEach(notify => {
      console.log(notify)
      showNotify(notify)
    })
  })
}

let intervalID
chrome.storage.onChanged.addListener((changes) => {
  if (!intervalID) {
    intervalID = setInterval(() => {
      run()
    }, 1000)
  }
})

