
//initialise ports

bool receivedData = false;
const unsigned int MAX_INPUT = 50;

void setup() {
  //assign ports for motors + sensors
  Serial.begin(9600);
}

void process_data(const char * data) {
  Serial.println(data);
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
    processIncomingByte (Serial.read());
  }
}

/*void serialEvent(){
  if(Serial.available()) {
    
    receivedData = true;
  }
}*/
