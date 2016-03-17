
//initialise ports

bool receivedData = false;
String motorVal;

void setup() {
  //assign ports for motors + sensors
  Serial.begin(9600);
}

void loop() {
  while(Serial.available()){
    motorVal = Serial.readString();
    Serial.println(motorVal);
  }
}

/*void serialEvent(){
  if(Serial.available()) {
    
    receivedData = true;
  }
}*/
