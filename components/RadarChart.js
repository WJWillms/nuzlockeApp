import React from 'react';
import { View } from 'react-native';
import Svg, { G, Line, Polygon, Text as SvgText } from 'react-native-svg';

const RadarChart = ({ data, labels, size = 180 }) => {
    const levels = 4;
    const radius = size / 2;
    const angleStep = (Math.PI * 2) / labels.length;

    const allStats = data.flatMap(d => d.stats);
    const maxStat = Math.max(...allStats, 1); // Avoid divide by zero

    const getPoint = (value, index, scale = 1) => {
        const angle = index * angleStep - Math.PI / 2;
        const scaledValue = (value / maxStat) * radius * scale;
        return [
            radius + scaledValue * Math.cos(angle),
            radius + scaledValue * Math.sin(angle),
        ];
    };

    // Create grid
    const grid = Array.from({ length: levels }, (_, level) => {
        const scale = (level + 1) / levels;
        return labels.map((_, i) => getPoint(maxStat, i, scale).join(',')).join(' ');
    });

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size + 40} height={size + 40}>
                <G x={20} y={20}>
                    {/* Background grid polygons */}
                    {grid.map((points, i) => (
                        <Polygon key={`grid-${i}`} points={points} stroke="#ccc" fill="none" />
                    ))}

                    {/* Axes */}
                    {labels.map((_, i) => {
                        const [x, y] = getPoint(maxStat, i);
                        return <Line key={`axis-${i}`} x1={radius} y1={radius} x2={x} y2={y} stroke="#ccc" />;
                    })}

                    {/* Labels */}
                    {labels.map((label, i) => {
                        const [x, y] = getPoint(maxStat * 1.15, i);
                        return (
                            <SvgText
                                key={`label-${i}`}
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

                    {/* Chart Data Polygons */}
                    {data.map(({ label, stats, color }, idx) => {
                        const points = stats.map((v, i) => getPoint(v, i).join(',')).join(' ');
                        return (
                            <Polygon
                                key={`data-${label}-${idx}`}
                                points={points}
                                fill={color + '66'} // transparent fill
                                stroke={color}
                                strokeWidth="2"
                            />
                        );
                    })}
                </G>
            </Svg>
        </View>
    );
};

export default RadarChart;
