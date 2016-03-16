
//initialise ports

bool receivedData = false;
String motorVal = '';

void setup() {
  //assign ports for motors + sensors
  Serial.begin(9600);
}

void loop() {
  if(receivedData){
    Serial.println(motorVal);
    receivedData = false;
  }
}

void serialEvent(){
  if(Serial.available()) {
    motorVal = Serial.read();
    receivedData = true;
  }
}