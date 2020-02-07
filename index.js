const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-82c78-firebase-adminsdk-njgie-ea8cc41cd4.json')
const databaseURL = 'https://fcm-82c78.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-82c78/messages:send'
const deviceToken =
  'd8gBflncCoWB5wDM9CpzMh:APA91bG3PUc4Cqi8F9ZR3oSQYuuEtU6echf0vbUbyUOtJwrae00SToWBQxToSKrx561uCHQpN6ZTn53uXae2ksm2shfFCkDWLhXdo48oRDQL1ONXrOaZSD3jx35eMSo0pMXp4g-b-UdQ'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()