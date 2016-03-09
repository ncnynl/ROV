# ROV
Testing using node.js, socket.io and serialport to control an ROV based off Arduino and Raspberry Pi

The server sends motor values which range from 0 - 255, with 127 as neutral. There are 5 motors on the ROV,
with the values sent in the format of 0,0,0,0,0;