
//initialise ports
//#include <stdio.h>
//#include <string.h>
#include <Servo.h>


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
float motorValues[5];

void setup() {
  //assign ports for motors + sensors
  for (int i = 0; i < sizeof(motorList); i++){
    motorList[i].attach(portList[i]);
  }
  //init serial
  Serial.begin(9600);
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
    char *arr;
    readin.toCharArray(arr,readin.length());
    char *val;
    int counter = 0;
    while((val = strtok_r(arr,",",&arr)) != NULL) {
      motorValues[counter] = atof(val) + 90; //90 means no movement
      counter++;
    }
    
    for(int i = 0; i < sizeof(motorValues); i++) {
      //write values to motors
      motorList[i].write(motorValues[i]);
    }   
  }
}

