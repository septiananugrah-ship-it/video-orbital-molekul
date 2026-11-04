import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {SpinVec} from '../components/grupA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Peta video: tiga bagian (prinsip dasar → implementasi dalam kimia → penerapan).
const sub = (v: string) => (
  <tspan baselineShift="sub" fontSize={17}>
    {v}
  </tspan>
);
const sup = (v: string) => (
  <tspan baselineShift="super" fontSize={17}>
    {v}
  </tspan>
);
const CARDS: {n: string; title: string; items: React.ReactNode[]; words: string[]; color: string; glow: 'cyan' | 'violet' | 'gold'; x: number}[] = [
  {
    n: '1',
    title: 'Prinsip dasar',
    items: ['gabungan orbital atom (LCAO)', 'orbital ikatan & antiikatan', 'orde ikatan'],
    words: ['menggabungkan', 'antiikatan', 'orde'],
    color: C.cyan,
    glow: 'cyan',
    x: 420,
  },
  {
    n: '2',
    title: 'Implementasi dalam kimia',
    items: ['diagram MO periode 2', <>oksigen O{sub('2')}: ↑↑</>, <>ion O{sub('2')}{sup('+')}, O{sub('2')}{sup('−')}, O{sub('2')}{sup('2−')}</>, 'CO: molekul beda atom'],
    words: ['diagram', 'oksigen,', 'ion', 'karbon'],
    color: C.violet,
    glow: 'violet',
    x: 960,
  },
  {
    n: '3',
    title: 'Penerapan',
    items: ['spektroskopi fotoelektron', 'oksigen singlet di medis', <>N{sub('2')} yang sulit dipecah</>],
    words: ['spektroskopi', 'singlet', 'nitrogen'],
    color: C.amber,
    glow: 'gold',
    x: 1500,
  },
];
const Y = 560;
const CW = 480;
const CH = 380;

const Icon: React.FC<{i: number; x: number; y: number; t: number}> = ({i, x, y, t}) => {
  if (i === 0) {
    // diagram MO mini: 1s kiri & kanan, σ turun, σ* naik, dua elektron di σ
    const yA = y - 20;
    const yS = y + 14;
    const yX = y - 60;
    const j = 2 * Math.sin(t * 3);
    return (
      <g>
        <line x1={x - 74} y1={yA} x2={x - 46} y2={yA} stroke={C.blue} strokeWidth={3} strokeLinecap="round" />
        <line x1={x + 46} y1={yA} x2={x + 74} y2={yA} stroke={C.blue} strokeWidth={3} strokeLinecap="round" />
        {[yS, yX].map((yy, k) => (
          <g key={k}>
            <line x1={x - 46} y1={yA} x2={x - 20} y2={yy} stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 4" strokeDashoffset={-t * 8} />
            <line x1={x + 46} y1={yA} x2={x + 20} y2={yy} stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 4" strokeDashoffset={-t * 8} />
          </g>
        ))}
        <line x1={x - 20} y1={yX} x2={x + 20} y2={yX} stroke={C.red} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={x - 20} y1={yS} x2={x + 20} y2={yS} stroke={C.cyan} strokeWidth={3.5} strokeLinecap="round" />
        <SpinVec x1={x - 6} y1={yS + 12 + j} x2={x - 6} y2={yS - 16 + j} color={C.cyan} width={3} head={9} />
        <SpinVec x1={x + 6} y1={yS - 16 - j} x2={x + 6} y2={yS + 12 - j} color={C.pink} width={3} head={9} />
      </g>
    );
  }
  if (i === 1) {
    // O₂ dengan awan menyebar + dua elektron sejajar
    const bob = 4 * Math.sin(t * 2.2);
    const br = 1 + 0.05 * Math.sin(t * 1.7);
    return (
      <g>
        <ellipse cx={x} cy={y - 6} rx={62 * br} ry={34 * br} fill="url(#soft-cyan)" opacity={0.5} />
        <circle cx={x - 24} cy={y - 6} r={19} fill="#ff4d63" />
        <circle cx={x + 24} cy={y - 6} r={19} fill="#ff4d63" />
        <SpinVec x1={x - 16} y1={y - 40 + bob} x2={x - 16} y2={y - 80 + bob} color={C.cyan} width={3.5} head={12} />
        <SpinVec x1={x + 16} y1={y - 40 - bob} x2={x + 16} y2={y - 80 - bob} color={C.cyan} width={3.5} head={12} />
      </g>
    );
  }
  // spektrum fotoelektron mini: tiga puncak yang menyala bergiliran
  const peaks = [-44, -4, 40];
  const base = y + 8;
  const d = Array.from({length: 61}, (_, k) => {
    const xx = x - 70 + (140 * k) / 60;
    const v = peaks.reduce((s, p, m) => s + (m === 1 ? 46 : 36) * Math.exp(-(((xx - x - p) / 7) ** 2)), 0);
    return `${k ? 'L' : 'M'}${xx.toFixed(1)},${(base - v).toFixed(1)}`;
  }).join(' ');
  const lit = (t * 0.8) % 3;
  return (
    <g>
      <line x1={x - 72} y1={base} x2={x + 72} y2={base} stroke={C.faint} strokeWidth={2} />
      <path d={d} fill="none" stroke={C.amber} strokeWidth={3} strokeLinejoin="round" />
      {peaks.map((p, m) => {
        const k = Math.max(0, 1 - Math.abs(lit - m - 0.5) * 1.4);
        return <circle key={m} cx={x + p} cy={base - (m === 1 ? 46 : 36)} r={5 + 3 * k} fill={C.gold} opacity={0.4 + 0.6 * k} />;
      })}
    </g>
  );
};

export const Roadmap: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const head = ramp(t, -0.2, 0.9);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center', opacity: head, translate: `0px ${(1 - head) * 20}px`}}>
        <div style={{fontFamily: FONT.mono, fontSize: 22, letterSpacing: 6, color: C.gold}}>PETA PERJALANAN · PERTEMUAN 10</div>
        <div style={{fontFamily: FONT.sans, fontSize: 60, fontWeight: 700, color: C.ink, marginTop: 6}}>Teori Orbital Molekul</div>
      </div>
      <Stage>
        {/* benang penghubung antarkartu */}
        {[0, 1].map((k) => {
          const p = ramp(t, cue(k + 2) - 0.5, cue(k + 2) + 0.4, EASE_IN_OUT);
          const x1 = CARDS[k].x + CW / 2 + 6;
          const x2 = CARDS[k + 1].x - CW / 2 - 6;
          return (
            <g key={k} opacity={ramp(t, cue(0) + 0.6, cue(0) + 1.4)}>
              <line x1={x1} y1={Y} x2={x2} y2={Y} stroke={C.faint} strokeWidth={3} strokeDasharray="5 6" strokeDashoffset={-t * 16} />
              <circle cx={x1 + (x2 - x1) * p} cy={Y} r={6} fill={C.gold} opacity={p * (1 - ramp(t, cue(k + 2) + 0.6, cue(k + 2) + 1.2))} />
            </g>
          );
        })}
        {CARDS.map((c, i) => {
          const p = ramp(t, cue(0) + 0.2 + i * 0.25, cue(0) + 1.0 + i * 0.25, BACK);
          const on = ramp(t, cue(i + 1) - 0.1, cue(i + 1) + 0.5);
          const off = i < 2 ? ramp(t, cue(i + 2) - 0.1, cue(i + 2) + 0.5, EASE_IN_OUT) : 0;
          const lit = on * (1 - off);
          const dim = 0.55 + 0.45 * Math.max(lit, 1 - ramp(t, cue(1) - 0.2, cue(1) + 0.4));
          const top = Y - CH / 2;
          const left = c.x - CW / 2;
          const float = 4 * Math.sin(t * 0.9 + i * 1.3);
          return (
            <g key={i} opacity={p * dim} transform={`translate(0 ${(1 - p) * 40 - 10 * lit + float})`}>
              <Glow x={c.x} y={Y} r={280} color={c.glow} opacity={0.2 * lit} />
              <rect x={left} y={top} width={CW} height={CH} rx={28} fill="rgba(12,18,40,0.85)" stroke={c.color} strokeOpacity={0.3 + 0.6 * lit} strokeWidth={2.5} />
              <text x={left + 36} y={top + 66} fontFamily={FONT.mono} fontSize={64} fontWeight={600} fill={c.color} dominantBaseline="central">
                {c.n}
              </text>
              <Icon i={i} x={left + CW - 100} y={top + 90} t={t} />
              <text x={left + 36} y={top + 150} fontFamily={FONT.sans} fontSize={31} fontWeight={700} fill={C.ink}>
                {c.title}
              </text>
              <rect x={left + 36} y={top + 172} width={(CW - 72) * on} height={2} fill={c.color} opacity={0.6} />
              {c.items.map((it, k) => {
                const w = ramp(t, wordOf(i + 1, c.words[k]) - 0.25, wordOf(i + 1, c.words[k]) + 0.35);
                const yy = top + 216 + k * 40;
                return (
                  <g key={k} opacity={0.35 + 0.65 * w}>
                    <circle cx={left + 46} cy={yy} r={5 + 2 * w} fill={c.color} />
                    <text x={left + 66} y={yy} dominantBaseline="central" fontFamily={FONT.sans} fontSize={25} fill={C.ink}>
                      {it}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};
