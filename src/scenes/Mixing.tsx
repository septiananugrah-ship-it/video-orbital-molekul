import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Arrow, Badge, Glow, Stage} from '../components/primitives';
import {HomoDiagram, Label2, homoGeom} from '../components/moC';
import {RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 07: pencampuran 2s–2p → B₂/C₂/N₂ σ2p di atas π2p; B₂ paramagnetik; O₂/F₂ urutan normal.
const LX = 520;
const RX = 1400;
const CY = 480;
const SC = 1;
const AXC = 280;

/** Panah celah energi tegak di kolom orbital atom kiri (2s ↔ 2p). */
const Bracket: React.FC<{x: number; y1: number; y2: number; color: string; opacity: number; label: string; mk: string}> = ({x, y1, y2, color, opacity, label, mk}) =>
  opacity <= 0.001 ? null : (
    <g opacity={opacity}>
      <line x1={x} y1={y1 + 30} x2={x} y2={y2 - 30} stroke={color} strokeWidth={3} markerStart={`url(#arrow-${mk})`} markerEnd={`url(#arrow-${mk})`} />
      <Label2 x={x - 14} y={(y1 + y2) / 2} anchor="end" size={22} color={color}>
        {label}
      </Label2>
    </g>
  );

export const Mixing: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  const inR = ramp(t, 0.2, 1.4);
  const inL = ramp(t, wordOf(0, 'boron') - 0.4, wordOf(0, 'boron') + 0.8);
  const chipC = ramp(t, wordOf(0, 'karbon') - 0.2, wordOf(0, 'karbon') + 0.4);
  const chipN = ramp(t, wordOf(0, 'nitrogen') - 0.2, wordOf(0, 'nitrogen') + 0.4);
  const differ = ramp(t, wordOf(0, 'berbeda') - 0.3, wordOf(0, 'berbeda') + 0.5) * (1 - ramp(t, cue(1) + 0.2, cue(1) + 1));

  // baris 1: 2s & 2p mendekat lalu bercampur
  const close = ramp(t, wordOf(1, 'berdekatan') - 0.6, wordOf(1, 'berdekatan') + 0.8, EASE_IN_OUT);
  const gapL = -48 * close;
  const mixing = ramp(t, wordOf(1, 'bercampur') - 0.4, wordOf(1, 'bercampur') + 0.6) * (1 - ramp(t, cue(3) - 0.6, cue(3) + 0.2));
  // baris 2: σ2p terdorong naik
  const push = ramp(t, wordOf(2, 'terdorong') - 0.3, wordOf(2, 'melewati') + 0.8, EASE_IN_OUT);
  const pushArrow = ramp(t, wordOf(2, 'terdorong') - 0.4, wordOf(2, 'terdorong') + 0.2) * (1 - ramp(t, cue(3) - 0.2, cue(3) + 0.5));
  // baris 3: B₂ diisi 6 elektron valensi
  const fillB = interpolate(t, [cue(3) + 0.6, wordOf(3, 'terpisah') + 0.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bFocus = ramp(t, cue(3) - 0.3, cue(3) + 0.5) * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.6));
  const piLit = ramp(t, wordOf(3, 'terpisah') - 0.2, wordOf(3, 'terpisah') + 0.5);
  const para = ramp(t, wordOf(3, 'paramagnetik') - 0.3, wordOf(3, 'paramagnetik') + 0.5, BACK);
  // baris 4: O₂/F₂ celah melebar, urutan normal
  const widen = ramp(t, wordOf(4, 'celah') - 0.3, wordOf(4, 'melebar') + 0.6, EASE_IN_OUT);
  const gapR = 62 * widen;
  const rFocus = ramp(t, cue(4) - 0.3, cue(4) + 0.5);
  const fillO = interpolate(t, [cue(4) + 0.4, wordOf(4, 'normal') + 0.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const normal = ramp(t, wordOf(4, 'normal') - 0.3, wordOf(4, 'normal') + 0.5);
  const lDim = 1 - 0.45 * rFocus;
  const rDim = 1 - 0.4 * bFocus;

  const gL = homoGeom(push, gapL);
  const gR = homoGeom(0, gapR);
  const Y = (cy: number, v: number) => cy + v * SC;
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);

  // panah pencampuran: lengkung bolak-balik antara σ2s dan σ2p (kiri)
  const mx = LX - 120 * SC;
  const ya = Y(CY, gL.s2);
  const yb = Y(CY, gL.sp);
  const wob = 10 * Math.sin(t * 4);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={LX} y={CY} r={360} color="cyan" opacity={0.07 * inL} />
        <Glow x={RX} y={CY} r={360} color="violet" opacity={0.07 * inR} />
        {/* judul kolom */}
        <g opacity={inL * lDim}>
          <RichLabel x={LX - 150} y={196} parts={[['B'], ['2', 'sub']]} size={40 * (1 + 0.18 * bFocus)} color={interpolateColors(bFocus, [0, 1], [C.ink, C.gold])} font="serif" />
          <g opacity={chipC * (1 - 0.6 * bFocus)}>
            <RichLabel x={LX} y={196} parts={[['C'], ['2', 'sub']]} size={40} font="serif" />
          </g>
          <g opacity={chipN * (1 - 0.6 * bFocus)}>
            <RichLabel x={LX + 150} y={196} parts={[['N'], ['2', 'sub']]} size={40} font="serif" />
          </g>
        </g>
        <g opacity={inR * rDim}>
          <RichLabel x={RX - 80} y={196} parts={[['O'], ['2', 'sub']]} size={40} font="serif" />
          <RichLabel x={RX + 80} y={196} parts={[['F'], ['2', 'sub']]} size={40} font="serif" />
        </g>

        {/* diagram kiri: B₂/C₂/N₂ */}
        <HomoDiagram
          cx={LX}
          cy={CY}
          sc={SC}
          t={t}
          mixP={push}
          gap={gapL}
          e={6 * fillB}
          aoE={3 * (1 - fillB) * bFocus}
          opacity={inL * lDim}
          lit={{sp: Math.max(differ * pulse, mixing * 0.8, pushArrow), p: Math.max(differ * pulse, piLit * (0.6 + 0.4 * pulse)), s2: mixing * 0.8}}
        />
        <Bracket x={LX - AXC * SC} y1={Y(CY, gL.ao2p)} y2={Y(CY, gL.ao2s)} color={C.mint} opacity={close * (1 - bFocus) * (1 - rFocus) * inL} label="celah kecil" mk="mint" />
        {/* lengkung pencampuran 2s–2p */}
        <g opacity={mixing}>
          <path
            d={`M${mx},${ya - 12} C${mx - 60 + wob},${mix(ya, yb, 0.3)} ${mx - 60 - wob},${mix(ya, yb, 0.7)} ${mx},${yb + 12}`}
            fill="none"
            stroke={C.mint}
            strokeWidth={4}
            markerEnd="url(#arrow-mint)"
            markerStart="url(#arrow-mint)"
          />
          <Label2 x={mx - 20} y={ya + 40} anchor="end" size={22} color={C.mint}>
            s–p bercampur
          </Label2>
        </g>
        {/* panah dorong σ2p */}
        <g opacity={pushArrow}>
          <Arrow x1={LX + 150 * SC} y1={Y(CY, 46) + 6} x2={LX + 150 * SC} y2={Y(CY, gL.sp) - 4} color="gold" width={5} />
          <Label2 x={LX + 150 * SC + 16} y={Y(CY, 0) + 4} anchor="start" size={22} color={C.gold}>
            terdorong naik
          </Label2>
        </g>

        {/* diagram kanan: O₂/F₂ */}
        <HomoDiagram
          cx={RX}
          cy={CY}
          sc={SC}
          t={t + 0.7}
          mixP={0}
          gap={gapR}
          e={12 * fillO}
          aoE={6 * (1 - fillO) * rFocus}
          opacity={inR * rDim}
          lit={{sp: normal * (0.6 + 0.4 * pulse) + differ * 0.4, p: normal * 0.5 + differ * 0.4}}
        />
        <Bracket x={RX - AXC * SC} y1={Y(CY, gR.ao2p)} y2={Y(CY, gR.ao2s)} color={C.violet} opacity={widen * (1 - 0.3 * fillO) * inR} label="celah lebar" mk="violet" />
      </Stage>
      <Badge x={LX} y={858} text="B₂ PARAMAGNETIK ✓ cocok eksperimen" color={C.mint} opacity={para * (1 - rFocus * 0.6)} scale={0.9 + 0.1 * para} />
      <Badge x={LX} y={252} text="TERCAMPUR: π2p di bawah σ2p" color={C.cyan} opacity={push * inL * lDim} scale={0.82} />
      <Badge x={RX} y={252} text="NORMAL: σ2p di bawah π2p" color={C.violet} opacity={normal * inR} scale={0.82 + 0.06 * normal} />
    </AbsoluteFill>
  );
};
