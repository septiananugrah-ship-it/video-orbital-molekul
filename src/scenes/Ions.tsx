import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, rand, ramp, slot} from '../anim';
import {Atom, Bond, Formula, Frac, Glow, Stage, Sub} from '../components/primitives';
import {Label2, MOLevel} from '../components/moC';
import {RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 09: O₂⁺ / O₂ / O₂⁻ / O₂²⁻ — π* 1/2/3/4 elektron, orde 2,5 / 2 / 1,5 / 1, ≈ 112 / 121 / 133 / 149 pm (AUDIT).
const XS = [330, 750, 1170, 1590];
const SP = [
  {sup: '+', name: 'dioksigenil', e: 1, bo: '2,5', pm: 112},
  {sup: '', name: 'oksigen', e: 2, bo: '2', pm: 121},
  {sup: '−', name: 'superoksida', e: 3, bo: '1,5', pm: 133},
  {sup: '2−', name: 'peroksida', e: 4, bo: '1', pm: 149},
];
const Y_LAB = 222;
const Y_PI = 340;
const Y_BO = 432;
const Y_MOL = 536;
const Y_LEN = 606;
const PX = 1.6;

export const Ions: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // kemunculan kolom: O₂ dulu, lalu O₂⁺, O₂⁻, O₂²⁻
  const colIn = [
    ramp(t, wordOf(0, 'Lepaskan') - 0.3, wordOf(0, 'Lepaskan') + 0.6),
    ramp(t, 0.3, 1.3),
    ramp(t, wordOf(2, 'Tambahkan') - 0.3, wordOf(2, 'Tambahkan') + 0.5),
    ramp(t, wordOf(3, 'Tambahkan') - 0.3, wordOf(3, 'Tambahkan') + 0.5),
  ];
  // perubahan elektron π*
  const dE = [
    -ramp(t, wordOf(0, 'Lepaskan') + 0.4, wordOf(0, 'plus') + 0.2, EASE_IN_OUT),
    0,
    ramp(t, wordOf(2, 'satu', 0) - 0.2, wordOf(2, 'superoksida') + 0.2, EASE_IN_OUT),
    2 * ramp(t, wordOf(3, 'dua', 0) - 0.2, wordOf(3, 'peroksida') + 0.4, EASE_IN_OUT),
  ];
  const nameIn = [
    ramp(t, wordOf(0, 'plus') - 0.2, wordOf(0, 'plus') + 0.5),
    ramp(t, 0.8, 1.6),
    ramp(t, wordOf(2, 'superoksida') - 0.2, wordOf(2, 'superoksida') + 0.5),
    ramp(t, wordOf(3, 'peroksida') - 0.2, wordOf(3, 'peroksida') + 0.5),
  ];
  const boIn = [
    ramp(t, wordOf(1, 'setengah') - 0.4, wordOf(1, 'setengah') + 0.4, BACK),
    ramp(t, 1.4, 2.2),
    ramp(t, wordOf(2, 'setengah') - 0.4, wordOf(2, 'setengah') + 0.4, BACK),
    ramp(t, wordOf(3, 'satu') - 0.4, wordOf(3, 'satu') + 0.4, BACK),
  ];
  const lenP = [
    ramp(t, wordOf(1, 'memendek') - 0.3, wordOf(1, 'memendek') + 1.0, EASE_IN_OUT),
    1,
    ramp(t, wordOf(2, 'sekitar') - 0.3, wordOf(2, 'pikometer') + 0.3, EASE_IN_OUT),
    ramp(t, wordOf(3, 'sekitar') - 0.3, wordOf(3, 'pikometer') + 0.3, EASE_IN_OUT),
  ];
  const lenLab = [
    ramp(t, wordOf(1, 'pikometer') - 0.6, wordOf(1, 'pikometer') + 0.2),
    ramp(t, 1.6, 2.4),
    ramp(t, wordOf(2, 'pikometer') - 0.6, wordOf(2, 'pikometer') + 0.2),
    ramp(t, wordOf(3, 'pikometer') - 0.6, wordOf(3, 'pikometer') + 0.2),
  ];
  const antiLit = ramp(t, wordOf(1, 'antiikatan') - 0.3, wordOf(1, 'antiikatan') + 0.4) * (1 - ramp(t, cue(2) - 0.4, cue(2) + 0.2));
  const trend = ramp(t, wordOf(3, 'pikometer') + 0.2, wordOf(3, 'pikometer') + 1.4, EASE_IN_OUT) * (1 - ramp(t, cue(4) + 0.2, cue(4) + 0.8));
  const cell = ramp(t, cue(4) + 0.4, cue(4) + 1.4);
  const ros = ramp(t, wordOf(4, 'reaktif') - 0.4, wordOf(4, 'reaktif') + 0.4);
  const rosLit = ramp(t, cue(4) - 0.2, cue(4) + 0.8);

  const s0 = slot(t, 2.2, wordOf(0, 'Lepaskan') + 0.2);
  const s1 = slot(t, wordOf(1, 'orde') - 0.2, cue(2));
  const s2 = slot(t, wordOf(2, 'orde') - 0.2, cue(3));
  const s3 = slot(t, wordOf(3, 'orde') - 0.2, cue(4) + 0.2);

  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  const bob = 4 * Math.sin(t * 1.3);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {SP.map((s, i) => {
          const x = XS[i];
          const op = colIn[i];
          const e = i === 1 ? 2 : 2 + dE[i];
          const pm = mix(121, s.pm, lenP[i]);
          const d = pm * PX + 2.5 * Math.sin(t * 4.2 + i);
          const lit = i >= 2 ? rosLit : 0;
          const parts: [string, ('sub' | 'sup')?][] = [['O'], ['2', 'sub']];
          if (s.sup) parts.push([s.sup, 'sup']);
          return (
            <g key={i} opacity={op}>
              <Glow x={x} y={Y_MOL} r={170} color="red" opacity={(0.1 + 0.12 * lit * pulse) * op} />
              <RichLabel x={x} y={Y_LAB} parts={parts} size={50} font="serif" color={i === 1 ? C.ink : C.gold} />
              <Label2 x={x} y={Y_LAB + 44} size={22} color={C.muted} opacity={nameIn[i]}>
                {s.name}
              </Label2>
              <MOLevel x={x} y={Y_PI} w={78} n={2} gap={22} color={C.pink} e={e} t={t + i} spin={46} lit={Math.max(antiLit, 0.6 * lit)} />
              <Label2 x={x} y={Y_BO} size={30} font="mono" weight={600} color={C.cyan} opacity={boIn[i]}>
                {`orde ${s.bo}`}
              </Label2>
              <g transform={`translate(0 ${bob * (i % 2 ? 1 : -1)})`}>
                <Bond x1={x - d / 2} y1={Y_MOL} x2={x + d / 2} y2={Y_MOL} order={1} width={[15, 12.5, 10, 8][i]} color={C.muted} />
                <Atom x={x - d / 2} y={Y_MOL} el="O" r={36} />
                <Atom x={x + d / 2} y={Y_MOL} el="O" r={36} />
              </g>
              <Label2 x={x} y={Y_LEN} size={26} font="mono" color={C.ink} opacity={lenLab[i]}>
                {`≈ ${s.pm} pm`}
              </Label2>
            </g>
          );
        })}
        <Label2 x={XS[0] - 160} y={Y_PI} size={24} color={C.pink} anchor="middle" opacity={colIn[1]} font="serif">
          π*
        </Label2>
        {/* tren panjang ikatan */}
        <g opacity={trend}>
          <line x1={XS[0] - 60} y1={648} x2={XS[3] + 60} y2={648} stroke={C.amber} strokeWidth={3} strokeDasharray="10 8" strokeDashoffset={-t * 30} />
          <path d={`M${XS[3] + 76},648 L${XS[3] + 54},636 L${XS[3] + 54},660 Z`} fill={C.amber} />
        </g>
        {/* sel */}
        <g opacity={cell}>
          <ellipse cx={960} cy={772} rx={560} ry={88 + 3 * Math.sin(t * 1.4)} fill="rgba(94,240,176,0.05)" stroke={C.mint} strokeWidth={3} strokeOpacity={0.6} />
          <ellipse cx={620} cy={772} rx={120} ry={44} fill="rgba(255,143,58,0.12)" stroke={C.amber} strokeWidth={3} />
          <path
            d={`M520,772 ${Array.from({length: 8}, (_, k) => `Q${532 + k * 25},${k % 2 ? 750 : 794} ${545 + k * 25},772`).join(' ')}`}
            fill="none"
            stroke={C.amber}
            strokeWidth={2.5}
            opacity={0.8}
          />
          <Label2 x={620} y={838} size={19} color={C.amber}>
            mitokondria
          </Label2>
          {Array.from({length: 7}, (_, k) => {
            const ph = (t * 0.28 + rand(k)) % 1;
            const a = cyc(ph);
            const ang = -0.9 + 1.8 * rand(k + 9);
            const r = 130 + ph * 300;
            const px = 620 + r * Math.cos(ang) * 1.0;
            const py = 772 + r * Math.sin(ang) * 0.2;
            return (
              <g key={k} opacity={a}>
                <circle cx={px - 9} cy={py} r={9} fill={C.red} />
                <circle cx={px + 9} cy={py} r={9} fill={C.red} />
                <circle cx={px} cy={py} r={26} fill="url(#soft-red)" opacity={0.5} />
              </g>
            );
          })}
          <g opacity={ros}>
            <RichLabel x={1250} y={752} parts={[['O'], ['2', 'sub'], ['−', 'sup'], ['  ·  O'], ['2', 'sub'], ['2−', 'sup']]} size={34} font="serif" color={C.red} />
            <Label2 x={1250} y={800} size={26} color={C.mint}>
              spesies oksigen reaktif di sel
            </Label2>
          </g>
        </g>
      </Stage>
      <Formula x={960} y={772} p={s0} accent={C.cyan} caption={<>O<Sub>2</Sub>: 8 elektron ikatan, 4 antiikatan</>} size={56}>
        orde = <Frac n="8 − 4" d="2" /> = 2
      </Formula>
      <Formula x={960} y={772} p={s1} accent={C.cyan} caption="satu elektron π* dilepas" size={56}>
        orde = <Frac n="8 − 3" d="2" /> = 2,5
      </Formula>
      <Formula x={960} y={772} p={s2} accent={C.cyan} caption="satu elektron π* ditambah" size={56}>
        orde = <Frac n="8 − 5" d="2" /> = 1,5
      </Formula>
      <Formula x={960} y={772} p={s3} accent={C.cyan} caption="dua elektron π* ditambah" size={56}>
        orde = <Frac n="8 − 6" d="2" /> = 1
      </Formula>
    </AbsoluteFill>
  );
};
