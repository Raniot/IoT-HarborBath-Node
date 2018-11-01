# IoT-HarborBath-Node
## Description
This is repository contains the application for the Nodes in the Harborbath solution.

The node will messure different environmental aspects through sensors and count people entering and leaving the harbor bath to make sure that the total amount of visitors does not exeed the maximum amount.

![alt text](https://github.com/Raniot/IoT-Harborbath-Node/blob/master/img/ConnectionDiagram.png "Raspberry node Setup")

## How is the image build?
An automatic build pipeline has been setup, which builds the image on a raspberry Pi and push it to Docker Hub.
The image of this repo is pushed to: https://hub.docker.com/r/raniot/nodes

#### Requirements:
- A raspberry pi with docker installed.
- Connected with a Pir, Lux, Camera, Temperature, Humidity and Ultrasoinc sensor.
- Gateway application for the node to communicate with.

#### Sensor setup:
Pir sensor (HC-SR501):
- VCC 5V (Pin 2)
- GND (Pin 6) 
- GPIO 17 (Pin 11)
- [Datasheet](https://www.mpja.com/download/31227sc.pdf)

Camera:
- Camera Port.
- [Datasheet](http://www.farnell.com/datasheets/2056179.pdf)

Lux sensor (TSL2561):
- VCC 3.3V (Pin 1)
- GND (Pin 6)
- GPIO 2 (Pin 3)
- GPIO 3 (Pin 5)
- [Datasheet](https://cdn-learn.adafruit.com/downloads/pdf/tsl2561.pdf)

Temperature and Humidity (DHT22):
- VCC 3.3V (Pin 1)
- VCC 3.3V (Pin 1) through 10k ohm resistor.
- GPIO 12 (Pin 32)
- GND (Pin 6)
- [Datasheet](https://cdn-shop.adafruit.com/datasheets/Digital+humidity+and+temperature+sensor+AM2302.pdf)

Ultrasonic sensor (HC-SR04):
- VCC 5V (Pin 2)
- GPIO 18 (Pin 12)
- GPIO 24 (Pin 18) through 330 ohm. (connect this to GND through a 470 ohm aswell)
- GND (Pin 6)
- For more information to connect this you can read [this](https://tutorials-raspberrypi.com/wp-content/uploads/2014/05/ultraschall_Steckplatine-768x952.png)
- Datasheet](https://www.mouser.com/ds/2/813/HCSR04-1022824.pdf)

#### How to run the image: 
- docker pull raniot/nodes:latest
- docker run --privileged raniot/nodes:latest