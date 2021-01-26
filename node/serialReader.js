//All objects which hold serial port data required
const SerialPort = require('serialport')
const fetch = require('node-fetch');
const bindings = require('@serialport/bindings')
const Readline = require('@serialport/parser-readline');
const { send } = require('process');

var listOfPorts=[];     //Array which holds all ports which the computer is currently using

//Called automatically by bindings.list()
function list(ports) {
  listOfPorts = ports;

  //Outputs the list of ports as objects
  console.log(listOfPorts);

  //Code which iterates through each object of the ports and finds the microbit productId which is always "0204"
  for(var i = 0; i < listOfPorts.length; i++) {
    for(const productId of Object.keys(listOfPorts[i])) {
      if(listOfPorts[i][productId] === "0204") {

        //Once the productId is found iterate through the object again to find the path
        for(const path of Object.keys(listOfPorts[i])) {
          if(path === "path") {

            //Once the path has been found convert the value to a string without the ""
            const portName = JSON.stringify(listOfPorts[i][path]).replace(/['"]+/g, '')
            console.log("Microbit Found!");
            return(portName);
          }
        }
      }
    }
  }
  console.log("Microbit Missing!")
  return(null)
}

//Calls function if there's an error exits the program
var portName = bindings.list().then(list, err => {
  process.exit(1)
})

portName.then(function(result){
    if(result != null){
        listen(result)
    } else {
        listen('COM5')
        process.exit(1)
    }
})

function listen(portName){
  var port = new SerialPort(portName, {
      baudRate: 115200,
      parser: new SerialPort.parsers.Readline('/n')
  })

  var counter = 0   //counts how many elements a message has
  var devicecounter = 0
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

  //const parser = port.pipe(new Readline({delimeter: '\n'})) 
  port.on('open', function(){
      console.log("open")
  })
  port.on('data', receiverFunction)

  function receiverFunction(data) {
    console.log(data);

    //Here I will split up the data depending what it looks like 


  }



  //Here implement the post method to the api
  const recievedData = JSON.stringify({
      messageReceived
  })
  console.log(recievedData)

  // fetch('https://github.com/')
  //   .then(res => res.text())
  //   .then(body => console.log(body))

  fetch('https://generictrackandtrace.azurewebsites.net/api/DeviceReport', { method: 'POST', body: JSON.stringify(messageReceived) })
  .then(res => res.json()) // expecting a json response
  .then(json => console.log(json));

  console.log("sent")

  /*
  var sendInSixtySec = setInterval(function() {
    messageReceived.time = admin.firestore.Timestamp.fromDate(new Date());
    return db.collection('sampleData').doc() //here you can specify to which collection you want to add a record to. A randomly generated Document ID is generated to every record.
          .set(messageReceived).then(() =>       //set the JSON object, this would overwrite the existing document, but as it has a randomly generated ID it wont overwrite anything
          console.log('data has been written to database'));

  }, 60 * 1000);
  */
//clearInterval(send); // The setInterval it cleared and doesn't run anymore.

}

module.exports = list