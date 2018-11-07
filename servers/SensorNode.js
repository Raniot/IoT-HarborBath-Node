var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.0.114:2000');
var resources = require('./../resources/model');

  var pirModel = resources.pi.sensors.pir;
  var tempModel = resources.pi.sensors.temperature;
  var humiModel = resources.pi.sensors.humidity;
  var luxModel = resources.pi.sensors.lux;
  var counterModel = resources.pi.sensors.counter;
  var led1Model = resources.pi.actuators.leds['1'];
  var led2Model = resources.pi.actuators.leds['2'];
  var firstReading = true

client.on('connect', function () {
  sensorsetInterval(function() {
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
          message += ' { "Type": "Human counter", "Value": -3, "Unit": "Humans" }'
        }
        else if(checkModel(CounterModel,change)){
          if(!firstReading) {
             message += ','; 
             firstReading = false;
          }
          message += ' { "Type": "Human counter", "Value": -3, "Unit": "Humans" }'
        }
      });
    });
    message += ']"}' 
    jsonMessage = JSON.stringify(message)
    client.publish('Gateway/message', jsonMessage); 
    console.log('Message Sent');
  }, 60000);
});

function checkModel(model, change){
  if (change.type === 'update' && model === change.path.slice(0, -1).reduce((obj, i) => obj[i], resources)) {return true;}
  return false;
}