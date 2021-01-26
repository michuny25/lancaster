const fetch = require('node-fetch');

var messageReceived = {
    deviceId: "string",
    timestampUtc: "2021-01-22T12:01:35.401Z",
    temperature: 0,
    noiseLevel: 0,
    devicesNearby: [
      {
        id: "string",
        duration: 1,
        events: [{
            "type": "movement"
        }]
      }
    ]
  }

//   fetch('https://generictrackandtrace.azurewebsites.net/api/DeviceReport', { method: 'POST', body: messageReceived })
//   .then(res => res.json()) // expecting a json response
//   .then(json => console.log(json));

  fetch('https://generictrackandtrace.azurewebsites.net/api/DeviceReport', {
        method: 'post',
        body:    JSON.stringify(messageReceived),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => console.log(json));

  console.log("sent")