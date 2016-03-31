#include <Servo.h>

//initialise ports
const int MOTOR_NUMBER = 5;

//ESC pins
const int motorLp = 3;
const int motorRp = 5;
const int motorV1p = 6;
const int motorV2p = 9;
const int motorAp = 10;
const int portList[] = {motorLp,motorRp,motorV1p,motorV2p,motorAp};

//Servos;
Servo motorL, motorR, motorV1, motorV2, motorA;
Servo motorList[] = {motorL,motorR,motorV1,motorV2,motorA};

bool receivedData = false;
const char startOfArrayDelimiter = '[';
const char endOfArrayDelimiter = ']';
const char startOfNumberDelimiter = '<';
const char endOfNumberDelimiter = '>';

void setup() {
  // assign ports for motors + sensors
  for (int i = 0; i < sizeof(motorList); i++){
    motorList[i].attach(portList[i]);
  }
  motorList[0].writeMicroseconds(1500);
  motorList[1].writeMicroseconds(1500);
  motorList[2].writeMicroseconds(1500);
  motorList[3].writeMicroseconds(1500);
  
  // Serial Init
  Serial.begin(115200);
}

void processNumber(const int receivedNumber[]) {
  motorList[0].writeMicroseconds(receivedNumber[0]*4+1100);
  motorList[1].writeMicroseconds(receivedNumber[0]*4+1100);
  motorList[2].writeMicroseconds(receivedNumber[0]*4+1100);
  motorList[3].writeMicroseconds(receivedNumber[0]*4+1100);
  delay(50);
} //end of processNumber

void processInput() {
  static int receivedNumber[5] = {0, 0, 0, 0, 0};
  static int numberIndex = -1;
  byte c = Serial.read();

  switch (c) {
    case endOfArrayDelimiter:
      processNumber(receivedNumber);
    break;

    // fall through to start a new array
    case startOfArrayDelimiter:
      numberIndex = -1;
      break;

    case endOfNumberDelimiter:
      led(3);
    break;
    
    // fall through to start a new number
    case startOfNumberDelimiter:
      numberIndex++;
      receivedNumber[numberIndex] = 0;
      break;

    case '0' ... '9':
      receivedNumber[numberIndex] *= 10;
      receivedNumber[numberIndex] += c - '0';
      break;
  } //end of switch
} //end of processInput

void loop() {
  while (Serial.available()) {
    processInput();
    //Serial.print("hi");
  }
}
