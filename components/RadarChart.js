import React from 'react';
import { View } from 'react-native';
import Svg, { G, Line, Polygon, Text as SvgText } from 'react-native-svg';

const RadarChart = ({ stats, labels, size = 180, stroke = '#007AFF', fill = 'rgba(0,122,255,0.4)' }) => {
    const levels = 4;
    const radius = size / 2;
    const angleStep = (Math.PI * 2) / stats.length;
    const maxStat = Math.max(...stats, 1); // prevent divide by zero

    const getPoint = (value, index, scale = 1) => {
        const angle = index * angleStep - Math.PI / 2;
        const scaledValue = (value / maxStat) * radius * scale;
        return [
            radius + scaledValue * Math.cos(angle),
            radius + scaledValue * Math.sin(angle),
        ];
    };

    const shapePoints = stats.map((v, i) => getPoint(v, i).join(',')).join(' ');

    const grid = Array.from({ length: levels }, (_, level) => {
        const scale = (level + 1) / levels;
        return stats.map((_, i) => getPoint(maxStat, i, scale).join(',')).join(' ');
    });

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size + 40} height={size + 40}>
                <G x={20} y={20}>
                    {/* Grid polygons */}
                    {grid.map((points, i) => (
                        <Polygon key={i} points={points} stroke="#ccc" fill="none" />
                    ))}

                    {/* Axes */}
                    {stats.map((_, i) => {
                        const [x, y] = getPoint(maxStat, i);
                        return <Line key={i} x1={radius} y1={radius} x2={x} y2={y} stroke="#ccc" />;
                    })}

                    {/* Labels */}
                    {labels.map((label, i) => {
                        const [x, y] = getPoint(maxStat * 1.15, i); // push labels a little further out
                        return (
                            <SvgText
                                key={i}
                                x={x}
                                y={y}
                                fontSize="10"
                                fill="#333"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                            >
                                {label}
                            </SvgText>
                        );
                    })}

                    {/* Data shape */}
                    <Polygon points={shapePoints} fill={fill} stroke={stroke} strokeWidth="2" />
                </G>
            </Svg>
        </View>
    );
};

export default RadarChart;
