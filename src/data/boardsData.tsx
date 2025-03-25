import { BoardDefinition } from './../types/boards';

// Example of enhanced board data structure
export const boardsData: BoardDefinition[] = [
    {
        id: 'arduino-uno',
        name: 'Arduino Uno',
        manufacturer: 'Arduino',
        category: 'Development Board',
        description: 'Standard Arduino board based on the ATmega328P',
        specs: {
            processor: 'ATmega328P',
            voltage: '5V',
            digitalPins: 14,
            analogInputs: 6,
            clockSpeed: '16 MHz',
            flash: '32 KB',
            ram: '2 KB',
        },
        image: require('../../assets/microp/ArduinoUnoR3.png'),
        documentation: 'https://docs.arduino.cc/hardware/uno-rev3',
        pinoutImage: require('../../assets/microp/ArduinoUnoR3.png'),
        dimensions: {
            width: 400,
            height: 280,
        },
        pins: [
            {
                number: 1,
                x: 50,
                y: 30,
                name: 'Reset',
                function: 'Reset the microcontroller',
                type: 'power',
                voltage: '-',
                alternativeFunctions: ['Reset']
            },
            {
                number: 2,
                x: 50,
                y: 60,
                name: '3.3V',
                function: '3.3V output',
                type: 'power',
                voltage: '3.3V',
                alternativeFunctions: []
            },
            // Add remaining pins...
        ]
    },
    // Add 9 more boards with similar structure
];