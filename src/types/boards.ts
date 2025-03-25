export type PinType = 'digital' | 'analog' | 'power' | 'ground' | 'communication' | 'special';

export type PinDefinition = {
    number: number;
    x: number;
    y: number;
    name: string;
    function: string;
    type: PinType;
    voltage?: string;
    alternativeFunctions?: string[];
    color?: string;
};

export type BoardSpecs = {
    processor: string;
    voltage: string;
    digitalPins?: number;
    analogInputs?: number;
    clockSpeed?: string;
    flash?: string;
    ram?: string;
    connectivity?: string[];
};

export type BoardDefinition = {
    id: string;
    name: string;
    manufacturer: string;
    category: string;
    description: string;
    specs: BoardSpecs;
    image: any; // Image resource
    pinoutImage?: any; // Optional detailed pinout image
    documentation: string;
    dimensions: {
        width: number;
        height: number;
    };
    pins: PinDefinition[];
};