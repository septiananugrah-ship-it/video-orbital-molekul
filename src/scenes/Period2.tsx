import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp, slot, smoothPath} from '../anim';
import {Atom, Bond, DrawPath, Formula, Glow, Stage, Sub, V} from '../components/primitives';
import {HBar} from '../components/vbB';
import {Label2} from '../components/moC';
import {RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 08: orde ikatan Li₂…Ne₂ (1,0,1,2,3,2,1,0); N₂/O₂/F₂: 110/121/142 pm, ≈ 945/498/158 kJ/mol (AUDIT).
const MOLS = [
  {el: 'Li', bo: 1},
  {el: 'Be', bo: 0},
  {el: 'B', bo: 1},
  {el: 'C', bo: 2},
  {el: 'N', bo: 3},
  {el: 'O', bo: 2},
  {el: 'F', bo: 1},
  {el: 'Ne', bo: 0},
];
const X0 = 300;
const STEP = 190;
const BY = 548;
const UNIT = 92;
const BW = 92;
const colX = (i: number) => X0 + i * STEP;
const barCol = (bo: number) => (bo >= 3 ? C.gold : bo === 2 ? C.amber : bo === 1 ? C.cyan : C.muted);

const ROWS = [
  {el: 'N', atom: 'N', pm: 110, kj: 945, order: 3, label: '945'},
  {el: 'O', atom: 'O', pm: 121, kj: 498, order: 2, label: '498'},
  {el: 'F', atom: 'Cl', pm: 142, kj: 158, order: 1, label: '158'},
];
const ROW_Y = [700, 772, 844];
const MOL_X = 560;
const PX_PM = 1.5;

export const Period2: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  const words = [
    wordOf(1, 'litium'),
    wordOf(1, 'berilium'),
    wordOf(1, 'boron'),
    wordOf(1, 'karbon'),
    wordOf(1, 'nitrogen'),
    wordOf(2, 'oksigen'),
    wordOf(2, 'fluor'),
    wordOf(2, 'neon'),
  ];
  const chip = (i: number) => ramp(t, 0.4 + i * 0.32, 1.1 + i * 0.32);
  const meramal = ramp(t, wordOf(0, 'meramal') - 0.3, wordOf(0, 'meramal') + 0.6);
  const grow = (i: number) => ramp(t, words[i] - 0.1, words[i] + 0.9, BACK);
  const peak = ramp(t, wordOf(1, 'puncaknya') - 0.2, wordOf(1, 'puncaknya') + 0.6);
  const curve = ramp(t, wordOf(2, 'neon') + 0.3, wordOf(2, 'neon') + 1.8, EASE_IN_OUT);
  const focus = ramp(t, cue(3) - 0.3, cue(3) + 0.6);
  const sRule = slot(t, wordOf(3, 'pendek') - 0.6, cue(4) + 0.1);
  const header = ramp(t, cue(4) + 0.1, cue(4) + 0.8);
  const rowIn = [ramp(t, wordOf(4, 'Nitrogen') + 0.1, wordOf(4, 'Nitrogen') + 0.8), ramp(t, wordOf(4, 'oksigen') - 0.3, wordOf(4, 'oksigen') + 0.4), ramp(t, wordOf(4, 'fluor') - 0.3, wordOf(4, 'fluor') + 0.4)];
  const lenIn = [0, 1, 2].map((k) => ramp(t, wordOf(4, 'pikometer', k) - 0.9, wordOf(4, 'pikometer', k) + 0.3));
  const enT = [wordOf(4, 'kilojoule') - 1.6, wordOf(4, 'delapan', 0) - 1.4, wordOf(4, 'hanya') - 0.1];
  const enIn = enT.map((a) => ramp(t, a, a + 1.4));

  const tops = MOLS.map((m, i) => [colX(i), BY - m.bo * UNIT * grow(i)] as [number, number]);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={colX(4)} y={BY - 3 * UNIT} r={260} color="gold" opacity={0.18 * peak * (0.7 + 0.3 * pulse)} />
        <Label2 x={X0 - 110} y={BY - 3 * UNIT - 40} size={22} color={C.muted} anchor="start" opacity={meramal}>
          orde ikatan
        </Label2>
        {/* garis dasar + jejak batang */}
        <line x1={X0 - 80} y1={BY} x2={colX(7) + 80} y2={BY} stroke={C.faint} strokeWidth={3} opacity={meramal} />
        {[1, 2, 3].map((k) => (
          <line key={k} x1={X0 - 80} y1={BY - k * UNIT} x2={colX(7) + 80} y2={BY - k * UNIT} stroke={C.faint} strokeWidth={1.5} strokeDasharray="4 10" strokeDashoffset={-t * 10} opacity={0.5 * meramal} />
        ))}
        {MOLS.map((m, i) => {
          const x = colX(i);
          const g = grow(i);
          const h = m.bo * UNIT * g;
          const dim = 1 - 0.55 * focus * (i >= 4 && i <= 6 ? 0 : 1);
          const col = barCol(m.bo);
          const shimmer = 0.1 * Math.sin(t * 2.4 + i);
          const zero = m.bo === 0 ? ramp(t, words[i] + 0.1, words[i] + 0.7) : 0;
          return (
            <g key={m.el} opacity={chip(i) * dim}>
              <rect x={x - BW / 2} y={BY - 3 * UNIT} width={BW} height={3 * UNIT} rx={10} fill="rgba(20,28,56,0.35)" stroke={C.faint} strokeWidth={1.5} strokeDasharray="5 7" />
              {h > 0.5 ? (
                <>
                  <rect x={x - BW / 2} y={BY - h} width={BW} height={h} rx={10} fill={col} opacity={0.78 + shimmer} />
                  <rect x={x - BW / 2 + 10} y={BY - h + 8} width={12} height={Math.max(0, h - 16)} rx={6} fill="#fff" opacity={0.22} />
                </>
              ) : null}
              <Label2 x={x} y={BY - h - 30} size={34} weight={700} font="mono" color={m.bo === 0 ? C.red : col} opacity={Math.min(1, g * 1.5)}>
                {String(m.bo)}
              </Label2>
              <RichLabel x={x} y={BY + 44} parts={[[m.el], ['2', 'sub']]} size={36} font="serif" color={i === 4 ? C.gold : C.ink} />
              {m.bo === 0 ? (
                <g opacity={zero}>
                  <line x1={x - 50} y1={BY + 20} x2={x + 50} y2={BY + 68} stroke={C.red} strokeWidth={4} strokeLinecap="round" />
                  <Label2 x={x} y={BY - 112} size={21} color={C.red}>
                    tidak stabil
                  </Label2>
                </g>
              ) : null}
            </g>
          );
        })}
        {/* lengkung naik–turun */}
        <DrawPath d={smoothPath(tops.map(([x, y]) => [x, y - 58]))} p={curve} stroke={C.gold} width={3} opacity={0.7 * (1 - 0.5 * focus)} />
        <g opacity={peak * (1 - focus * 0.5)}>
          <Label2 x={colX(4)} y={BY - 3 * UNIT - 98} size={24} color={C.gold}>
            puncak
          </Label2>
        </g>

        {/* panel bawah: N₂ / O₂ / F₂ */}
        <g opacity={header}>
          <Label2 x={MOL_X} y={650} size={21} color={C.muted}>
            panjang ikatan
          </Label2>
          <Label2 x={1310} y={650} size={21} color={C.muted}>
            energi ikatan
          </Label2>
        </g>
        {ROWS.map((r, k) => {
          const y = ROW_Y[k];
          const op = rowIn[k];
          const d = r.pm * PX_PM + (3 + k) * Math.sin(t * (5 - k) + k);
          return (
            <g key={r.el} opacity={op}>
              <RichLabel x={250} y={y} parts={[[r.el], ['2', 'sub']]} size={36} font="serif" />
              <Bond x1={MOL_X - d / 2} y1={y} x2={MOL_X + d / 2} y2={y} order={r.order} width={9} />
              <Atom x={MOL_X - d / 2} y={y} el={r.atom} r={24} label={r.el} glow={0.6} />
              <Atom x={MOL_X + d / 2} y={y} el={r.atom} r={24} label={r.el} glow={0.6} />
              <Label2 x={MOL_X + 160} y={y} size={26} font="mono" anchor="start" color={C.cyan} opacity={lenIn[k]}>
                {`${r.pm} pm`}
              </Label2>
              <HBar x={1000} y={y} w={620} v={(r.kj / 1000) * enIn[k]} color={k === 0 ? C.gold : k === 1 ? C.amber : C.cyan} h={24} opacity={Math.min(1, enIn[k] * 3)} value={`≈ ${r.label} kJ/mol`} />
            </g>
          );
        })}
      </Stage>
      <Formula x={960} y={768} p={sRule} accent={C.gold} caption="makin pendek dan makin kuat">
        orde ↑ ⇒ <V>r</V> ↓ , <V>E</V>
        <Sub>ikatan</Sub> ↑
      </Formula>
    </AbsoluteFill>
  );
};
