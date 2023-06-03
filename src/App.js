import React from 'react';

import './App.css';
import { ZoomMtg } from '@zoomus/websdk';
import { useParams } from 'react-router-dom';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.12.2/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');


function App() {
  const { user } = useParams()

  var authEndpoint = process.env.REACT_APP_SIGNATURE_ENDPOINT
  var sdkKey = process.env.REACT_APP_SDK_KEY
  var meetingNumber = process.env.REACT_APP_MEETING_ID
  var passWord = process.env.REACT_APP_MEETING_PASSWORD
  var role = 0
  var userName = user
  var userEmail = process.env.REACT_APP_MEETING_EMAIL
  var registrantToken = ''
  var zakToken = ''
  var leaveUrl = process.env.REACT_APP_LEAVE_URL

  function getSignature(e) {
    e.preventDefault();

    fetch(authEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
      .then(response => {
        startMeeting(response.signature)
      }).catch(error => {
        console.error(error)
      })
  }

  function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          sdkKey: sdkKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  return (
    <div className="App flex items-center justify-center min-h-screen">
      <main>
        <h1 className='font-bold text-2xl'>Join offerletter zoom meeting?</h1>

        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}

export default App;
