// Biểu đồ nhẹ, không phụ thuộc thư viện chart. Dùng react-native-svg cho đường cong.
import React, { useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline, Text as SvgText } from 'react-native-svg';
import { colors, font } from '../theme';
import { ProgressBar, Row } from './ui';

export function BarChart({
  data,
  height = 120,
  showValues = true,
}: {
  data: { label: string; value: number; highlight?: boolean }[];
  height?: number;
  showValues?: boolean;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View>
      <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
        {data.map((d, i) => (
          <View key={d.label + i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            {showValues ? <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text, marginBottom: 2 }}>{d.value}</Text> : null}
            <View
              style={{
                width: '100%',
                height: Math.max(2, (d.value / max) * (height - 18)),
                backgroundColor: d.highlight ? colors.primary : colors.primaryMid,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
        {data.map((d, i) => (
          <Text key={d.label + i} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: colors.muted, fontWeight: d.highlight ? '700' : '400' }}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function useWidth() {
  const [w, setW] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);
  return { w, onLayout };
}

export function LineChart({
  values,
  labels,
  height = 140,
  maxValue,
  showPoints = true,
}: {
  values: number[];
  labels?: string[];
  height?: number;
  maxValue?: number;
  showPoints?: boolean;
}) {
  const { w, onLayout } = useWidth();
  const max = maxValue ?? Math.max(...values) * 1.1;
  const padX = 16;
  const padTop = 20;
  const innerH = height - padTop - 8;
  const step = values.length > 1 ? (w - padX * 2) / (values.length - 1) : 0;
  const pts = values.map((v, i) => [padX + i * step, padTop + innerH - (v / max) * innerH] as const);
  return (
    <View onLayout={onLayout}>
      {w > 0 ? (
        <Svg width={w} height={height}>
          {[0, 0.5, 1].map((g) => (
            <Line key={g} x1={padX} x2={w - padX} y1={padTop + innerH * g} y2={padTop + innerH * g} stroke={colors.border} strokeWidth={1} />
          ))}
          <Polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={colors.primary} strokeWidth={2.5} />
          {showPoints &&
            pts.map((p, i) => (
              <React.Fragment key={i}>
                <Circle cx={p[0]} cy={p[1]} r={4} fill={colors.primary} />
                {values.length <= 6 ? (
                  <SvgText x={p[0]} y={p[1] - 8} fontSize={12} fontWeight="700" fill={colors.text} textAnchor="middle">
                    {String(values[i])}
                  </SvgText>
                ) : null}
              </React.Fragment>
            ))}
        </Svg>
      ) : (
        <View style={{ height }} />
      )}
      {labels ? (
        <Row style={{ justifyContent: 'space-between', paddingHorizontal: 4 }}>
          {labels.map((l, i) =>
            labels.length > 6 && i % 2 === 1 ? null : (
              <Text key={l + i} style={font.tiny}>
                {l}
              </Text>
            ),
          )}
        </Row>
      ) : null}
    </View>
  );
}

/** Đường quên: độ nhớ giảm dần, mỗi lần ôn đúng quay về 100% */
export function ForgettingCurve({ height = 160 }: { height?: number }) {
  const { w, onLayout } = useWidth();
  const y = (r: number) => 10 + (1 - (r - 0.6) / 0.4) * (height - 30);
  const seg = (x0: number, x1: number, k: number) => {
    let d = '';
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = x0 + (x1 - x0) * t;
      const r = Math.exp(-k * t);
      d += `${i === 0 ? 'M' : 'L'}${x},${y(Math.max(0.6, r))}`;
    }
    return d;
  };
  const x = (f: number) => 8 + f * (w - 16);
  return (
    <View onLayout={onLayout}>
      {w > 0 ? (
        <Svg width={w} height={height}>
          <Line x1={x(0)} x2={x(1)} y1={y(0.9)} y2={y(0.9)} stroke="#4C5F55" strokeDasharray="4 4" />
          <SvgText x={x(0)} y={y(0.9) - 4} fontSize={10} fill="#9FB1A7">90%</SvgText>
          <Path d={seg(x(0), x(0.2), 0.35)} stroke={colors.primaryMid} strokeWidth={2} fill="none" />
          <Path d={seg(x(0.2), x(0.45), 0.22)} stroke={colors.primaryMid} strokeWidth={2} fill="none" />
          <Path d={seg(x(0.45), x(0.75), 0.12)} stroke={colors.primaryMid} strokeWidth={2} fill="none" />
          <Path d={seg(x(0.75), x(1), 0.35)} stroke="#E8A35F" strokeWidth={2} strokeDasharray="5 4" fill="none" />
          <Circle cx={x(0.75)} cy={y(Math.exp(-0.12))} r={5} fill={colors.white} />
          <SvgText x={x(0.2)} y={height - 4} fontSize={10} fill="#9FB1A7" textAnchor="middle">ôn lần 1</SvgText>
          <SvgText x={x(0.45)} y={height - 4} fontSize={10} fill="#9FB1A7" textAnchor="middle">ôn lần 2</SvgText>
          <SvgText x={x(0.75)} y={height - 4} fontSize={10} fill={colors.white} textAnchor="middle">hôm nay</SvgText>
        </Svg>
      ) : (
        <View style={{ height }} />
      )}
    </View>
  );
}

export function HBar({
  label,
  value,
  right,
  color = colors.primary,
  secondary,
}: {
  label: string;
  value: number;
  right?: string;
  color?: string;
  secondary?: number;
}) {
  return (
    <View style={{ gap: 6, marginBottom: 12 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 14, color: colors.text, flex: 1 }}>{label}</Text>
        {right ? <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{right}</Text> : null}
      </Row>
      {secondary !== undefined ? (
        <View style={{ height: 8, backgroundColor: colors.surfaceMuted, borderRadius: 8, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${value * 100}%`, backgroundColor: '#F2C48C' }} />
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${secondary * 100}%`, backgroundColor: color }} />
        </View>
      ) : (
        <ProgressBar value={value} color={color} height={8} />
      )}
    </View>
  );
}

/** Ô nhiệt: màu đậm dần theo giá trị 0..1 */
export function heatColor(v: number) {
  const scale = ['#EEF0EC', '#D3EBDC', '#A9D9BB', '#6FBF8F', '#2E8B5A'];
  return scale[Math.max(0, Math.min(scale.length - 1, Math.round(v * (scale.length - 1))))];
}
