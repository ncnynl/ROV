
//initialise ports
#include <stdio.h>
#include <stdlib.h>
//#include <string.h>
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

//
float motorValues[MOTOR_NUMBER];

void setup() {
  //assign ports for motors + sensors
  for (int i = 0; i < sizeof(motorList); i++){
    motorList[i].attach(portList[i]);
  }
  //init serial
  Serial.begin(115200);
}

void process_data(const char * data) {
  Serial.println(data);
}

void printString(String str) {
 Serial.print(str+"\n"); 
}

void processIncomingByte(const byte inByte) {
  static char input_line [MAX_INPUT];
  static unsigned int input_pos = 0;
  
  switch(inByte) {
    case '\n':
      input_line[input_pos] = 0;
      
      // reset buffer
      input_pos = 0;
      break;
    
    case '\r':
      break;
    
    default:
      // keep adding if not full
      if (input_pos < (MAX_INPUT - 1))
        input_line [input_pos++] = inByte;
      break;
  } //end of switch
} //end of processIncomingByte

void loop() {
  while(Serial.available() > 0){
    String readin = Serial.readString();
    char arr[readin.length() + 1];
    readin.toCharArray(arr,readin.length() + 1);
    arr[readin.length()] = '\0';
    char *arrp; 
    arrp = arr;
    char *val;
    int counter = 0;
    while((val = strtok_r(arrp,",",&arrp)) != NULL) {
      motorValues[counter] = (atof(val))/200 * 180 + 90; //90 means no movement
      counter++;
    }
    
    for(int i = 0; i < MOTOR_NUMBER; i++) {
      //write values to motors
      motorList[i].write(motorValues[i]);
    }
    delay(10);
  }
}

