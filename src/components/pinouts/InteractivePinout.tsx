import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Svg, { Rect, Circle, Text as SvgText, G } from 'react-native-svg';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

type PinDefinition = {
  number: number;
  x: number;
  y: number;
  name: string;
  function: string;
  color?: string;
};

type InteractivePinoutProps = {
  width: number;
  height: number;
  pins: PinDefinition[];
  onPinSelect?: (pin: PinDefinition) => void;
};

// Simplified version without SvgPanZoom
const InteractivePinout: React.FC<InteractivePinoutProps> = ({
  width,
  height,
  pins,
  onPinSelect,
}) => {
  const [selectedPin, setSelectedPin] = useState<PinDefinition | null>(null);

  const handlePinPress = (pin: PinDefinition) => {
    setSelectedPin(pin);
    if (onPinSelect) {
      onPinSelect(pin);
    }
  };

  // Highlight selected pin by changing its color
  const highlightedPins = pins.map(pin => ({
    ...pin,
    color: pin.number === selectedPin?.number ? '#ff5722' : '#ffd700',
  }));

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Board outline */}
        <Rect
          x={10}
          y={10}
          width={width - 20}
          height={height - 20}
          fill="#1e88e5"
          stroke="#0d47a1"
          strokeWidth="2"
          rx={10}
        />
        
        {/* Pins */}
        {highlightedPins.map((pin) => (
          <G key={pin.number} onPress={() => handlePinPress(pin)}>
            <Circle
              cx={pin.x}
              cy={pin.y}
              r={10}
              fill={pin.color || '#ffd700'}
              stroke="#000"
              strokeWidth="1"
            />
            <SvgText
              x={pin.x}
              y={pin.y}
              fontSize="10"
              textAnchor="middle"
              alignmentBaseline="central"
              fill="#000"
            >
              {pin.number}
            </SvgText>
          </G>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default InteractivePinout;
