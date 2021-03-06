var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://84.238.67.87:2000');
var resources = require('./resources/model');

// Internal Plugins
var ledsPlugin = require('./plugins/internal/ledsPlugin'),
  pirPlugin = require('./plugins/internal/pirPlugin')//,
  // dhtPlugin = require('./plugins/internal/DHT22SensorPlugin');

// Internal Plugins for sensors/actuators connected to the PI GPIOs
// If you test this with real sensors do not forget to set simulate to 'false'
var simulate = false//process.env.SIMULATE == "false" ? false : true;
// ToDo COMMENT IN!!!!!!!!!!
console.log('Simulation set to: ' + simulate);

pirPlugin.start({'simulate': simulate, 'frequency': 2000});
ledsPlugin.start({'simulate': simulate, 'frequency': 10000});
// dhtPlugin.start({'simulate': simulate, 'frequency': 10000});


var timeInterval = 60000 // in ms = 1 min
var gateCloseMessage = "Close"
var gateOpenMessage = "Open"

const spawn = require("child_process").spawn;
const spawn2 = require("child_process").spawn;

const pythonProcessBack = spawn('python3',["BackgroundSubtraction.py"]);
const pythonProcessUltra = spawn2('python3',["UltrasoundDistance.py"]);
var ultraLenThresh = 150;
var test = 0;
var ultraData = []
pythonProcessUltra.stdout.on('data', function(data) {
  ultraData.push(data)
  if(ultraData.length > 5)
    ultraData.shift()

  test = data
  if(data < ultraLenThresh){
    // console.log("Set to True" + data)
    ultraPerson = true;
  }
  else{
    // console.log("Set to False")
    ultraPerson = false;
  }
});

pythonProcessBack.stdout.on('data', function(data) {
  console.log(data.toString());
  var integer = parseInt(data);
  pirPersonValue = pirPlugin.getValue()

  var minUltraData = Math.min.apply(null, ultraData)
  ultraPersonValue = false
  if(minUltraData < ultraLenThresh)
    ultraPersonValue = true

  // console.log("Ultra len: " +test)
  if(ultraPersonValue || pirPersonValue)
  {
    message = '{"Sensors": [ { "Type": "Human counter", "Value": '+ integer +', "Unit": "humans" } ] }';

    //COMMENT IN TO SEND TO MQTT
    client.publish('Gateway/message', message); 
    console.log('Message Sent');
  }
  else{
    console.log('Camera registered' + integer + ', but Pir value was' + pirPersonValue + " and Ultra value was " + ultraPersonValue);
  }
});


client.on('connect', function () {
  console.log('connected to MQTT')
  client.subscribe('Node/gate')

  // setInterval(function() {
  //   console.log("Prepare message")
  //   // message = '{"Sensors": ['
  //   // // message += ' { "Type": "Temperature", "Value": '+ dhtPlugin.getTemperature() +', "Unit": "degrees celcius" },';
  //   // // message += ' { "Type": "Humidity", "Value": '+ dhtPlugin.getHumidity() +', "Unit": "percentage" },';
  //   // message += ' { "Type": "Lux", "Value": 0, "Unit": "lumen" }'
  //   // message += ']}' 
  //   // client.publish('Gateway/message', message); 
  //   // console.log('Message:' + message)
  //   // console.log('Message Sent');
  // }, timeInterval);
});

client.on('message', function (topic, message) {
  if(topic == "Node/gate") {
    if(message == gateCloseMessage){
      //Turn off green LED 
      //Turn on red LED
      ledsPlugin.CloseGateLight()
    } 
    else if(message == gateOpenMessage){
      //Turn On green LED 
      //Turn off red LED
      ledsPlugin.OpenGateLight()
    }
  }
})