import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp} from '../anim';
import {Frac, Glow, Stage, Sub} from '../components/primitives';
import {pesSignal} from '../components/moD';
import {HexIcon, Spin} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 15: enam poin rangkuman (2 kolom × 3 baris) dengan ikon bergerak; poin terakhir = teaser video berikutnya.
const COLX = [80, 990];
const CW = 850;
const CH = 196;
const ROWY = [285, 505, 725];
const pos = (i: number) => ({x: COLX[Math.floor(i / 3)], y: ROWY[i % 3]});

const ROWS: {title: React.ReactNode; detail: React.ReactNode; col: string}[] = [
  {title: 'Orbital molekul = LCAO', detail: 'dua orbital atom → satu ikatan + satu antiikatan', col: C.cyan},
  {
    title: 'Orde ikatan',
    detail: (
      <>
        ={' '}
        <Frac n={<>e⁻ ikatan − e⁻ antiikatan</>} d={<>2</>} size={0.95} />
      </>
    ),
    col: C.gold,
  },
  {
    title: (
      <>
        O<Sub>2</Sub> tertarik magnet
      </>
    ),
    detail: 'dua elektron tak berpasangan di π*',
    col: C.pink,
  },
  {title: 'Urutan tertukar (B₂ – N₂)', detail: 'pencampuran s–p · dibuktikan spektroskopi fotoelektron', col: C.amber},
  {title: 'HOMO & LUMO', detail: 'orbital perbatasan menentukan reaksi dan warna', col: C.mint},
  {title: 'Berikutnya', detail: 'orbital molekul banyak atom & peran simetri', col: C.violet},
];

const Icon: React.FC<{i: number; x: number; y: number; t: number}> = ({i, x, y, t}) => {
  if (i === 0) {
    const j = 2 * Math.sin(t * 3);
    return (
      <g>
        {[-1, 1].map((s) => (
          <g key={s}>
            <line x1={x + s * 58 - 14} y1={y} x2={x + s * 58 + 14} y2={y} stroke={C.muted} strokeWidth={4} strokeLinecap="round" />
            <line x1={x + s * 42} y1={y} x2={x + s * 20} y2={y - 36} stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
            <line x1={x + s * 42} y1={y} x2={x + s * 20} y2={y + 36} stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
          </g>
        ))}
        <line x1={x - 20} y1={y - 36} x2={x + 20} y2={y - 36} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
        <line x1={x - 20} y1={y + 36} x2={x + 20} y2={y + 36} stroke={C.cyan} strokeWidth={14} strokeOpacity={0.15 + 0.1 * Math.sin(t * 3)} strokeLinecap="round" />
        <line x1={x - 20} y1={y + 36} x2={x + 20} y2={y + 36} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
        <Spin x={x - 7} y={y + 20 + j} up len={28} width={3.5} />
        <Spin x={x + 7} y={y + 20 - j} up={false} len={28} width={3.5} />
        <text x={x + 26} y={y - 30} fontFamily={FONT.serif} fontSize={18} fill={C.red}>
          σ*
        </text>
        <text x={x + 26} y={y + 50} fontFamily={FONT.serif} fontSize={18} fill={C.cyan}>
          σ
        </text>
      </g>
    );
  }
  if (i === 1) {
    // 8 elektron ikatan (sian) vs 2 antiikatan (merah) → 3
    const fade = 0.5 + 0.5 * Math.sin(t * 2);
    return (
      <g>
        {Array.from({length: 8}, (_, k) => (
          <circle key={k} cx={x - 56 + (k % 4) * 18} cy={y - 26 + Math.floor(k / 4) * 18} r={6.5} fill={C.cyan} opacity={k < 2 ? 1 - 0.7 * fade : 1} />
        ))}
        {[0, 1].map((k) => (
          <circle key={k} cx={x + 38} cy={y - 26 + k * 18} r={6.5} fill={C.red} opacity={1 - 0.7 * fade} />
        ))}
        <text x={x + 20} y={y - 12} textAnchor="middle" fontFamily={FONT.sans} fontSize={24} fill={C.ink}>
          −
        </text>
        <text x={x} y={y + 50} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={34} fill={C.gold}>
          N≡N: 3
        </text>
      </g>
    );
  }
  if (i === 2) {
    const sway = 3 * Math.sin(t * 2);
    return (
      <g>
        <path d={`M${x - 62},${y - 10} L${x - 62},${y + 30} A62,48 0 0 0 ${x + 62},${y + 30} L${x + 62},${y - 10} L${x + 36},${y - 10} L${x + 36},${y + 30} A36,26 0 0 1 ${x - 36},${y + 30} L${x - 36},${y - 10} Z`} fill="#7d879f" />
        <rect x={x - 62} y={y - 34} width={26} height={24} fill={C.red} />
        <rect x={x + 36} y={y - 34} width={26} height={24} fill={C.blue} />
        <circle cx={x} cy={y - 22} r={26} fill="url(#soft-violet)" opacity={0.6} />
        <circle cx={x - 9} cy={y - 22 + sway} r={9} fill={C.red} />
        <circle cx={x + 9} cy={y - 22 + sway} r={9} fill={C.red} />
        {[-1, 1].map((s) => (
          <g key={s}>
            <line x1={x + s * 22 - 12} y1={y - 58} x2={x + s * 22 + 12} y2={y - 58} stroke={C.pink} strokeWidth={4} strokeLinecap="round" />
            <Spin x={x + s * 22} y={y - 72 + 2 * Math.sin(t * 3 + s)} up len={26} width={3.5} />
          </g>
        ))}
      </g>
    );
  }
  if (i === 3) {
    const sweep = ((t * 0.25) % 1 + 1) % 1;
    const E0 = 15;
    const E1 = 19.4;
    const pts: string[] = [];
    for (let k = 0; k <= 160; k++) {
      const E = E0 + ((E1 - E0) * k) / 160;
      pts.push(`${(x - 64 + (128 * k) / 160).toFixed(1)},${(y + 46 - pesSignal(E) * 78).toFixed(1)}`);
    }
    const hx = x - 64 + 128 * sweep;
    return (
      <g>
        <line x1={x - 68} y1={y + 46} x2={x + 68} y2={y + 46} stroke={C.muted} strokeWidth={2} />
        <path d={`M${pts.join(' L')}`} fill="none" stroke={C.gold} strokeWidth={2.5} strokeLinejoin="round" />
        <rect x={hx - 3} y={y - 40} width={6} height={86} fill={C.amber} opacity={0.25} />
        <text x={x - 50} y={y - 46} fontFamily={FONT.serif} fontSize={18} fill={C.cyan}>
          σ
        </text>
        <text x={x - 16} y={y - 46} fontFamily={FONT.serif} fontSize={18} fill={C.amber}>
          π
        </text>
        <text x={x + 36} y={y - 46} fontFamily={FONT.serif} fontSize={18} fill={C.red}>
          σ*
        </text>
      </g>
    );
  }
  if (i === 4) {
    const hop = 0.5 - 0.5 * Math.cos(t * 1.6);
    return (
      <g>
        <line x1={x - 34} y1={y - 34} x2={x + 34} y2={y - 34} stroke={C.mint} strokeWidth={5} strokeLinecap="round" />
        <line x1={x - 34} y1={y + 34} x2={x + 34} y2={y + 34} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
        <Spin x={x - 8} y={y + 18 + 2 * Math.sin(t * 3)} up len={28} width={3.5} />
        <Spin x={x + 8} y={y + 18 - (52 + 2 * Math.sin(t * 3)) * hop} up={false} len={28} width={3.5} />
        <text x={x - 40} y={y - 28} textAnchor="end" fontFamily={FONT.sans} fontWeight={700} fontSize={16} fill={C.mint}>
          LUMO
        </text>
        <text x={x - 40} y={y + 40} textAnchor="end" fontFamily={FONT.sans} fontWeight={700} fontSize={16} fill={C.gold}>
          HOMO
        </text>
      </g>
    );
  }
  // i === 5: molekul banyak atom + bidang cermin berputar
  const rot = t * 0.3;
  return (
    <g>
      <circle cx={x} cy={y} r={70} fill="url(#soft-violet)" opacity={0.25 + 0.1 * Math.sin(t * 2)} />
      <HexIcon x={x} y={y} r={52} mode="ring" width={5} rot={-Math.PI / 2 + rot} />
      <line
        x1={x + 70 * Math.cos(rot * 0.5)}
        y1={y + 70 * Math.sin(rot * 0.5)}
        x2={x - 70 * Math.cos(rot * 0.5)}
        y2={y - 70 * Math.sin(rot * 0.5)}
        stroke={C.violet}
        strokeWidth={3}
        strokeDasharray="8 6"
      />
    </g>
  );
};

export const Recap: React.FC = () => {
  const {t, cue, dur} = useScene();
  const intro = ramp(t, cue(0) - 0.4, cue(0) + 0.6);
  const lit = ROWS.map((_, i) => ramp(t, cue(i + 1) - 0.3, cue(i + 1) + 0.5, BACK));
  const cur = (i: number) => Math.min(1, ramp(t, cue(i + 1) - 0.3, cue(i + 1) + 0.4)) * (1 - 0.35 * ramp(t, cue(i + 2) - 0.3, cue(i + 2) + 0.4));
  const finale = ramp(t, cue(6) - 0.3, cue(6) + 0.6);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={500} r={700} color="cyan" opacity={0.05 + 0.03 * Math.sin(t)} />
        {ROWS.map((r, i) => {
          const p = pos(i);
          const hot = cur(i);
          return (
            <g key={i} opacity={intro * (0.12 + 0.88 * lit[i])}>
              <rect
                x={p.x}
                y={p.y - CH / 2}
                width={CW}
                height={CH}
                rx={22}
                fill="rgba(12,18,40,0.72)"
                stroke={r.col}
                strokeWidth={2.5}
                strokeOpacity={0.25 + 0.6 * hot + (i === 5 ? 0.3 * finale * (0.6 + 0.4 * Math.sin(t * 4)) : 0)}
              />
              <rect x={p.x} y={p.y - CH / 2 + 24} width={6} height={CH - 48} rx={3} fill={r.col} opacity={0.4 + 0.6 * hot} />
              <circle cx={p.x + 120} cy={p.y} r={84} fill="rgba(6,10,24,0.8)" stroke={r.col} strokeOpacity={0.3 + 0.4 * hot} strokeWidth={2} />
              <g opacity={lit[i]}>
                <Icon i={i} x={p.x + 120} y={p.y} t={t} />
              </g>
            </g>
          );
        })}
        <Glow x={pos(5).x + 120} y={pos(5).y} r={150} color="violet" opacity={0.4 * finale} />
      </Stage>
      {ROWS.map((r, i) => {
        const p = pos(i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + 232,
              top: p.y,
              width: CW - 262,
              transform: `translate(${(1 - lit[i]) * -24}px, -50%)`,
              opacity: lit[i] * intro * (0.6 + 0.4 * cur(i)),
            }}
          >
            <div style={{fontFamily: FONT.sans, fontSize: 38, fontWeight: 700, color: r.col, lineHeight: 1.15}}>{r.title}</div>
            <div style={{fontFamily: FONT.sans, fontSize: 30, color: C.ink, lineHeight: 1.3, marginTop: 6}}>{r.detail}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
