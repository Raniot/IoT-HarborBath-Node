var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://84.238.67.87:2000');
var resources = require('./resources/model');

// Internal Plugins
var ledsPlugin = require('./plugins/internal/ledsPlugin'),
  pirPlugin = require('./plugins/internal/pirPlugin'),
  dhtPlugin = require('./plugins/internal/DHT22SensorPlugin');

// Internal Plugins for sensors/actuators connected to the PI GPIOs
// If you test this with real sensors do not forget to set simulate to 'false'
var simulate = false//process.env.SIMULATE == "false" ? false : true;
// ToDo COMMENT IN!!!!!!!!!!
console.log('Simulation set to: ' + simulate);

pirPlugin.start({'simulate': simulate, 'frequency': 2000});
ledsPlugin.start({'simulate': simulate, 'frequency': 10000});
dhtPlugin.start({'simulate': simulate, 'frequency': 10000});


var timeInterval = 6000 // in ms 900000 = 15 min
var gateCloseMessage = "Close"
var gateOpenMessage = "Open"

client.on('connect', function () {
  console.log('connected to MQTT')
  client.subscribe('Node/gate')
  setInterval(function() {
    console.log("Prepare message")
    message = '{"Sensors": ['
    message += ' { "Type": "Temperature", "Value": '+ dhtPlugin.getTemperature() +', "Unit": "degrees celcius" },';
    message += ' { "Type": "Humidity", "Value": '+ dhtPlugin.getHumidity() +', "Unit": "percentage" },';
    //message += ' { "Type": "Lux", "Value": 0, "Unit": "???" }'
    message += ']}' 
    client.publish('Gateway/message', message); 
    console.log('Message:' + message)
    console.log('Message Sent');
  }, timeInterval);
});

function checkModel(model, change){
  if (change.type === 'update' && model === change.path.slice(0, -1).reduce((obj, i) => obj[i], resources)) {return true;}
  return false;
}

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