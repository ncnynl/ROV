/*
 * Controls servos & brushless motors based on serial input.
 * 
 * To Do: 
 * Temperature sensor
 * 
 * 
 */

#include <Servo.h>

const int MOTOR_NUMBER = 5;

//ESC pins
const int motorLp = 1;
const int motorRp = 2;
const int motorV1p = 3;
const int motorV2p = 4;
const int motorAp = 5;
const int portList[] = {motorLp,motorRp,motorV1p,motorV2p,motorAp};


//Servos;
Servo motorL, motorR, motorV1, motorV2, motorA;
Servo motorList[] = {motorL,motorR,motorV1,motorV2,motorA};

const unsigned int MAX_INPUT = 50;

void setup() {
  //assign ports for motors + sensors
  for (int i = 0; i < sizeof(motorList); i++){
    motorList[i].attach(portList[i]);
  }
  //init serial
  Serial.begin(115200);
}

float *processData(String input) {
  static float output[MOTOR_NUMBER];

  //copy string to char array
  char arr[input.length() + 1];
  input.toCharArray(arr,input.length() + 1);
  arr[input.length()] = '\0';
  char *arrp; 
  arrp = arr;
  char *val;
  int counter = 0;

  //split string by comma
  while((val = strtok_r(arrp,",",&arrp)) != NULL) {
    //scale joystick values to motor values
    
     
    //max and min boundaries
    if(counter == 4) {
      output[counter] = (atof(val))/200 * 180;
      output[counter] = output[counter] > 180 ? 180 :output[counter]; 
      output[counter] = output[counter] < 0 ? 0 :output[counter];
    }
    else {
      output[counter] = (atof(val))/200 * 800 + 1100;
      output[counter] = output[counter] > 1900 ? 1900 :output[counter]; 
      output[counter] = output[counter] < 1100 ? 1100 :output[counter];
    }
    
    counter++;
  }

  return output;
}

void loop() {
  if(Serial.available() > 0){
    String readin = Serial.readString();
    float *motorValues;
    motorValues = processData(readin);
    
    for(int i = 0; i < MOTOR_NUMBER; i++) {
      //write values to motors
      motorList[i].write(*(motorValues + i));
    }
    delay(10);
  }
}

