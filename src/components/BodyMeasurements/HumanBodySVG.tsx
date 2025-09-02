import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Text as SvgText, Line, G } from 'react-native-svg';

interface BodyMeasurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  bicep: number;
  thigh: number;
  neck: number;
}

interface HumanBodySVGProps {
  measurements: BodyMeasurements;
  width?: number;
  height?: number;
  showMeasurements?: boolean;
}

const HumanBodySVG: React.FC<HumanBodySVGProps> = ({
  measurements,
  width = 300,
  height = 500,
  showMeasurements = true
}) => {
  const scale = Math.min(width / 300, height / 500);

  // Corpo principal simplificado
  const bodyPath = "M150,80 L140,120 L135,180 L130,240 L125,300 L130,360 L140,420 L160,420 L170,360 L175,300 L170,240 L165,180 L160,120 Z";

  // Cabeça
  const headPath = "M150,30 C165,30 175,40 175,55 C175,70 165,80 150,80 C135,80 125,70 125,55 C125,40 135,30 150,30 Z";

  // Braço esquerdo
  const leftArmPath = "M140,120 L110,140 L90,160 L85,170 L90,175 L110,155 L140,135 Z";

  // Braço direito
  const rightArmPath = "M160,120 L190,140 L210,160 L215,170 L210,175 L190,155 L160,135 Z";

  // Perna esquerda
  const leftLegPath = "M140,300 L135,360 L130,420 L125,480 L135,485 L145,480 L150,420 L155,360 L150,300 Z";

  // Perna direita
  const rightLegPath = "M160,300 L165,360 L170,420 L175,480 L165,485 L155,480 L150,420 L145,360 L150,300 Z";

  const measurementPoints = [
    { x: 150, y: 65, label: 'Pescoço', value: measurements.neck, side: 'right' },
    { x: 150, y: 150, label: 'Peito', value: measurements.chest, side: 'right' },
    { x: 150, y: 210, label: 'Cintura', value: measurements.waist, side: 'left' },
    { x: 150, y: 270, label: 'Quadril', value: measurements.hips, side: 'right' },
    { x: 100, y: 150, label: 'Bíceps', value: measurements.bicep, side: 'left' },
    { x: 140, y: 390, label: 'Coxa', value: measurements.thigh, side: 'left' },
  ];

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#222b38', padding: 10 }}>
      <Svg width={width} height={height} viewBox="0 0 300 500" style={{ backgroundColor: '#222b38' }}>

        {/* Cabeça */}
        <Path
          d={headPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Corpo principal */}
        <Path
          d={bodyPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Braços */}
        <Path
          d={leftArmPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <Path
          d={rightArmPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Pernas */}
        <Path
          d={leftLegPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <Path
          d={rightLegPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Pontos de medição e labels */}
        {showMeasurements && measurementPoints.map((point, index) => {
          const lineEndX = point.side === 'right' ? point.x + 50 : point.x - 50;
          const textX = point.side === 'right' ? lineEndX + 5 : lineEndX - 5;

          return (
            <G key={index}>
              {/* Ponto de medição */}
              <Circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#EF4444"
                stroke="#FFFFFF"
                strokeWidth="2"
              />

              {/* Linha indicativa */}
              <Line
                x1={point.x}
                y1={point.y}
                x2={lineEndX}
                y2={point.y}
                stroke="#6B7280"
                strokeWidth="1"
                strokeDasharray="3,3"
              />

              {/* Label e valor */}
              <SvgText
                x={textX}
                y={point.y - 8}
                fontSize="15"
                fill="#bfc1c4"
                fontWeight="bold"
                textAnchor={point.side === 'right' ? 'start' : 'end'}
              >
                {point.label}
              </SvgText>
              <SvgText
                x={textX + 4}
                y={point.y + 5}
                fontSize="15"
                fill="#6B7280"
                textAnchor={point.side === 'right' ? 'start' : 'end'}
              >
                {point.value}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

export default HumanBodySVG;