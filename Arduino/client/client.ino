
//initialise ports

bool receivedData = false;
const char startOfArrayDelimiter = '[';
const char endOfArrayDelimiter = ']';
const char startOfNumberDelimiter = '<';
const char endOfNumberDelimiter = '>';

void setup() {
  //assign ports for motors + sensors
  Serial.begin(115200);
}

void processNumber(const int n[]) {
  for(int i = 0; i < 5; i++) {
    Serial.print(n[i]+",");
  }
  Serial.print("\n");
} //end of processNumber

void processInput() {
  static int receivedNumber[5] = {0, 0, 0, 0, 0};
  static int numberIndex = 0;
  byte c = Serial.read();

  switch(c) {
    case endOfArrayDelimiter:
      processNumber(receivedNumber);

    // fall through to start a new array
    case startOfArrayDelimiter:
      numberIndex = 0;
      break;

    case endOfNumberDelimiter:

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
  while(Serial.available()) {
    processInput();
  }
}
