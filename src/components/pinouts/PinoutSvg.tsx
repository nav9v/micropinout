import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Text as SvgText, G } from 'react-native-svg';

type PinDefinition = {
  number: number;
  x: number;
  y: number;
  name: string;
  function: string;
  color?: string;
};

type PinoutSvgProps = {
  width: number;
  height: number;
  pins: PinDefinition[];
  onPinPress?: (pin: PinDefinition) => void;
};

const PinoutSvg: React.FC<PinoutSvgProps> = ({
  width,
  height,
  pins,
  onPinPress
}) => {
  return (
    <View style={styles.container}>
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
        {pins.map((pin) => (
          <G key={pin.number} onPress={() => onPinPress?.(pin)}>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PinoutSvg;
