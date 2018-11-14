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


var tempModel = resources.pi.sensors.temperature;
var humiModel = resources.pi.sensors.humidity;
var luxModel = resources.pi.sensors.lux;
var counterModel = resources.pi.sensors.counter;
var led1Model = resources.pi.actuators.leds['1'];
var led2Model = resources.pi.actuators.leds['2'];
var firstReading = true
var gateCloseMessage = "Close"
var gateOpenMessage = "Open"

client.on('connect', function () {
  console.log('connected to MQTT')
  client.subscribe('Node/gate')
  setInterval(function() {
    console.log("Prepare message")
    message = '{"Sensors": ['
    resources.observe(changes => {
      changes.forEach(change => {
        if(checkModel(tempModel,change)){
          if(!firstReading) {
             message += ','; 
             firstReading = false;
          }
          message += ' { "Type": "Temperature", "Value": '+ change +', "Unit": "degrees celcius" }';
        }
        else if(checkModel(humiModel,change)){
          if(!firstReading) {
             message += ','; 
             firstReading = false;
          }
          message += ' { "Type": "Humidity", "Value": '+ change +', "Unit": "percentage" }';
        }
        else if(checkModel(luxModel,change)){
          if(!firstReading) {
             message += ','; 
             firstReading = false;
          }
          message += ' { "Type": "Lux", "Value": -3, "Unit": "Humans" }'
        }
        /* else if(checkModel(CounterModel,change)){
          if(!firstReading) {
             message += ','; 
             firstReading = false;
          }
          message += ' { "Type": "Human counter", "Value": -3, "Unit": "Humans" }'
        } */
      });
    });
    message += ']}' 
    client.publish('Gateway/message', message); 
    firstReading = true;
    console.log('Message:' + message)
    console.log('Message Sent');
  }, 6000);
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
    } 
    else if(message == gateOpenMessage){
      //Turn On green LED 
      //Turn off red LED
    }
  }
})