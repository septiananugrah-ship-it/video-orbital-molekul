import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, rand, ramp, win} from '../anim';
import {Atom, Badge, Bond, Formula, Glow, Label, Stage, Sub, Sup} from '../components/primitives';
import {Stamp, TArrow} from '../components/grupD';
import {Diatomic, Flame, MOLevel} from '../components/moD';
import {RichLabel, Spin} from '../components/vbD';
import {wlColor} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 13: O₂ triplet vs molekul organik singlet (terhambat spin) → kayu tidak terbakar sendiri →
// oksigen singlet ¹Δg ≈ 0,98 eV → terapi fotodinamik (skematis).
const RED = wlColor(660);

/** Molekul organik zig-zag (rantai C + H). */
const Organic: React.FC<{x: number; y: number; t: number; opacity?: number}> = ({x, y, t, opacity = 1}) => {
  const pts: [number, number][] = [0, 1, 2, 3].map((k) => [x - 165 + k * 110, y + (k % 2 ? -34 : 34) + 3 * Math.sin(t * 2 + k)]);
  const hs: [number, number, number][] = [];
  pts.forEach(([px, py], k) => {
    const up = k % 2 ? -1 : 1;
    hs.push([px - 30, py + up * 62, k]);
    hs.push([px + 30, py + up * 62, k]);
  });
  return (
    <g opacity={opacity}>
      {hs.map(([hx, hy, k], i) => (
        <Bond key={`hb${i}`} x1={pts[k][0]} y1={pts[k][1]} x2={hx} y2={hy} width={7} />
      ))}
      {pts.slice(1).map((p, k) => (
        <Bond key={k} x1={pts[k][0]} y1={pts[k][1]} x2={p[0]} y2={p[1]} width={10} />
      ))}
      {hs.map(([hx, hy], i) => (
        <Atom key={`h${i}`} x={hx} y={hy} el="H" r={15} label={null} glow={0.3} />
      ))}
      {pts.map(([px, py], k) => (
        <Atom key={k} x={px} y={py} el="C" r={27} glow={0.4} />
      ))}
    </g>
  );
};

/** Molekul O₂ (dua bola merah, ikatan rangkap). */
const O2: React.FC<{x: number; y: number; r?: number; glow?: number; opacity?: number; rot?: number}> = ({x, y, r = 40, glow = 0.5, opacity = 1, rot = 0}) => {
  const d = r * 1.15;
  const c = Math.cos((rot * Math.PI) / 180);
  const s = Math.sin((rot * Math.PI) / 180);
  return (
    <g opacity={opacity}>
      <Bond x1={x - d * c} y1={y - d * s} x2={x + d * c} y2={y + d * s} order={2} width={r * 0.34} />
      <Atom x={x - d * c} y={y - d * s} el="O" r={r} glow={glow} />
      <Atom x={x + d * c} y={y + d * s} el="O" r={r} glow={glow} />
    </g>
  );
};

/** Kayu gelondong + kertas. */
const Wood: React.FC<{x: number; y: number; burn: number}> = ({x, y, burn}) => (
  <g>
    <rect x={x - 190} y={y - 46} width={300} height={92} rx={44} fill={`rgb(${mix(140, 60, burn)},${mix(92, 40, burn)},${mix(52, 30, burn)})`} />
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M${x - 150 + k * 80},${y - 30} q30,${10 + k * 4} 60,0`} fill="none" stroke="#5b3a20" strokeWidth={3} opacity={0.7} />
    ))}
    <ellipse cx={x + 110} cy={y} rx={30} ry={46} fill={`rgb(${mix(196, 80, burn)},${mix(150, 54, burn)},${mix(98, 40, burn)})`} />
    {[14, 26, 38].map((r) => (
      <ellipse key={r} cx={x + 110} cy={y} rx={r * 0.62} ry={r} fill="none" stroke="#7b5230" strokeWidth={2} opacity={0.8} />
    ))}
    {/* kertas */}
    <path d={`M${x - 330},${y + 46} L${x - 310},${y - 70} L${x - 210},${y - 60} L${x - 226},${y + 46} Z`} fill={`rgb(${mix(236, 70, burn)},${mix(232, 60, burn)},${mix(220, 56, burn)})`} />
    {[0, 1, 2, 3].map((k) => (
      <line key={k} x1={x - 304 + k * 2} y1={y - 44 + k * 20} x2={x - 232 + k * 2} y2={y - 38 + k * 20} stroke="#8c96bb" strokeWidth={2} opacity={0.6 * (1 - burn)} />
    ))}
  </g>
);

export const Singlet: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // ---------- fase A: triplet vs singlet ----------
  const phA = win(t, cue(0) - 0.6, cue(2) - 0.7, 0.8, 0.6);
  const org = ramp(t, wordOf(1, 'singlet', 0) - 0.3, wordOf(1, 'singlet', 0) + 0.6);
  const t0 = wordOf(1, 'Reaksi');
  const push = ramp(t, t0 - 0.2, t0 + 0.6) * (0.5 - 0.5 * Math.cos((2 * Math.PI * Math.max(0, t - t0)) / 2.4));
  const block = ramp(t, wordOf(1, 'terhambat') - 0.1, wordOf(1, 'terhambat') + 0.5);
  const oBase = mix(960, 560, org);
  const oX = oBase + 210 * push;

  // ---------- fase B: kayu tidak terbakar sendiri ----------
  const phB = win(t, cue(2) - 0.5, cue(3) - 0.35, 0.8, 0.5);
  const tm = wordOf(2, 'pemantik');
  const matchIn = ramp(t, tm - 1.4, tm - 0.3, EASE_IN_OUT);
  const ignite = ramp(t, tm - 0.2, tm + 1.3);
  const relE = ramp(t, wordOf(2, 'energi') - 0.2, wordOf(2, 'energi') + 0.8);
  const roll = ramp(t, tm - 0.1, tm + 1.4, EASE_IN_OUT);

  // ---------- fase C: oksigen singlet ----------
  const phC = win(t, cue(3) - 0.35, cue(4) - 0.7, 0.8, 0.6);
  const pair = ramp(t, wordOf(3, 'berpasangan') - 0.3, wordOf(3, 'berpasangan') + 0.9);
  const gap = ramp(t, wordOf(3, 'nol') - 0.2, wordOf(3, 'nol') + 0.8);
  const fo = ramp(t, wordOf(3, 'singlet') - 0.2, wordOf(3, 'singlet') + 0.6, BACK);
  const react = ramp(t, wordOf(3, 'reaktif') - 0.3, wordOf(3, 'reaktif') + 0.5, BACK);

  // ---------- fase D: terapi fotodinamik ----------
  const phD = ramp(t, cue(4) - 0.5, cue(4) + 0.4);
  const ps = ramp(t, wordOf(4, 'zat') - 0.2, wordOf(4, 'zat') + 0.6);
  const light = ramp(t, wordOf(4, 'disinari') - 0.2, wordOf(4, 'disinari') + 0.6);
  const so = ramp(t, wordOf(4, 'membentuk') - 0.2, wordOf(4, 'membentuk') + 0.8);
  const burst = ramp(t, wordOf(4, 'merusak') - 0.1, wordOf(4, 'merusak') + 1.6);

  const CANCER = [
    {x: 700, y: 690, r: 62},
    {x: 980, y: 660, r: 70},
    {x: 1260, y: 700, r: 60},
  ];

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={520} r={640} color="red" opacity={0.05 + 0.02 * Math.sin(t)} />

        {/* ================= FASE A ================= */}
        <g opacity={phA}>
          <Glow x={oX} y={430} r={220} color="red" opacity={0.25} />
          <O2 x={oX} y={430} r={54} rot={6 * Math.sin(t * 1.4)} />
          <RichLabel x={oBase} y={290} parts={[['O'], ['2', 'sub'], [' triplet']]} size={40} color={C.red} />
          {/* π* ↑ ↑ */}
          <MOLevel x={oBase} y={640} kind="piStar" sub="2p" elec={['u', 'u']} w={180} t={t} lit={0.6 + 0.4 * Math.sin(t * 3)} size={32} />
          <RichLabel x={oBase} y={710} parts={[['3', 'sup'], ['Σ'], ['g', 'sub'], ['−', 'sup'], ['  · dua elektron sejajar']]} size={28} color={C.ink} font="sans" />

          <g opacity={org}>
            <Organic x={1400} y={430} t={t} />
            <Label x={1400} y={262} size={36} color={C.ink} weight={600}>
              molekul organik
            </Label>
            <line x1={1350} y1={640} x2={1450} y2={640} stroke={C.muted} strokeWidth={5} strokeLinecap="round" />
            <Spin x={1391} y={620 + 2 * Math.sin(t * 3)} up len={38} width={4} />
            <Spin x={1409} y={620 - 2 * Math.sin(t * 3)} up={false} len={38} width={4} />
            <Label x={1400} y={710} size={28}>
              singlet · semua berpasangan
            </Label>
          </g>
          {/* percikan "tidak cocok" saat O₂ menyentuh */}
          <g opacity={block}>
            <text x={960} y={580} textAnchor="middle" fontFamily={FONT.sans} fontWeight={700} fontSize={44} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 5}}>
              <tspan fill={C.cyan}>↑↑</tspan>
              <tspan fill={C.ink}> + </tspan>
              <tspan fill={C.cyan}>↑</tspan>
              <tspan fill={C.pink}>↓</tspan>
              <tspan fill={C.ink}> → </tspan>
              <tspan fill={C.red}>✗</tspan>
            </text>
            {[0, 1, 2, 3, 4, 5].map((k) => {
              const a = (k / 6) * Math.PI * 2 + t;
              const rr = 30 + 26 * push;
              return <circle key={k} cx={oX + 120 + rr * Math.cos(a)} cy={430 + rr * Math.sin(a)} r={4} fill={C.red} opacity={push * 0.8} />;
            })}
          </g>
        </g>

        {/* ================= FASE B ================= */}
        <g opacity={phB}>
          <Wood x={640} y={700} burn={ignite * 0.7} />
          {/* O₂ melayang di udara di sekitar kayu */}
          {Array.from({length: 8}, (_, k) => {
            const x = 300 + rand(k * 3.1) * 640 + 30 * Math.sin(t * 0.6 + k);
            const y = 330 + rand(k * 7.7) * 230 + 20 * Math.cos(t * 0.7 + k * 1.3);
            return <Diatomic key={k} x={x} y={y} d={24} r={11} order={2} color="#ff4d63" rot={t * 30 * (rand(k) - 0.5) + k * 40} opacity={0.85} />;
          })}
          <Label x={620} y={290} size={30} color={C.muted}>
            {'O₂ di udara · triplet'}
          </Label>
          {/* api tumbuh setelah pemantik */}
          <Flame x={600} y={656} s={ignite} t={t} />
          <Flame x={480} y={660} s={ignite * 0.8} t={t} seed={3} />
          <Flame x={700} y={656} s={ignite * 0.7} t={t} seed={5} />
          {/* korek api */}
          <g opacity={matchIn} transform={`translate(${mix(260, 0, matchIn)} ${mix(-60, 0, matchIn)})`}>
            <line x1={960} y1={520} x2={830} y2={612} stroke="#e9c48a" strokeWidth={10} strokeLinecap="round" />
            <circle cx={830} cy={612} r={11} fill="#c0392b" />
            <Flame x={830} y={606} s={0.4} t={t} seed={7} />
          </g>
          <g opacity={1 - ignite}>
            <Label x={560} y={820} size={30} color={C.ink} weight={600}>
              tidak terbakar sendiri
            </Label>
          </g>

          {/* profil energi */}
          {(() => {
            const X0 = 1090;
            const X1 = 1760;
            const yR = 480;
            const yP = 800;
            const prof = (u: number) => {
              const base = yR + (yP - yR) * (1 / (1 + Math.exp(-(u - 0.62) * 14)));
              return base - 150 * Math.exp(-(((u - 0.42) / 0.09) ** 2));
            };
            const pts = Array.from({length: 121}, (_, i) => {
              const u = i / 120;
              return `${(X0 + u * (X1 - X0)).toFixed(1)},${prof(u).toFixed(1)}`;
            });
            const wob = 0.12 + 0.03 * Math.sin(t * 3);
            const u = mix(wob, 0.88, roll);
            const bx = X0 + u * (X1 - X0);
            const by = prof(u) - 16;
            return (
              <g>
                <line x1={X0 - 20} y1={yP + 40} x2={X0 - 20} y2={300} stroke={C.muted} strokeWidth={3} />
                <path d={`M${X0 - 28},312 L${X0 - 20},296 L${X0 - 12},312`} fill={C.muted} />
                <Label x={X0 - 6} y={300} size={22} color={C.muted} anchor="start">
                  energi
                </Label>
                <path d={`M${pts.join(' L')}`} fill="none" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
                <Label x={X0 + 70} y={yR - 50} size={24} color={C.ink}>
                  {'kayu + O₂'}
                </Label>
                <Label x={X1 - 70} y={yP + 30} size={24} color={C.ink}>
                  {'CO₂ + H₂O'}
                </Label>
                <Label x={X0 + 0.42 * (X1 - X0)} y={yR - 190} size={22} color={C.pink}>
                  terhambat spin
                </Label>
                <g opacity={relE}>
                  <TArrow x1={X1 - 30} y1={yR} x2={X1 - 30} y2={yP - 20} color={C.amber} p={relE} width={5} />
                  <Label x={X1 - 50} y={(yR + yP) / 2} size={22} color={C.amber} anchor="end">
                    banyak energi
                  </Label>
                </g>
                <circle cx={bx} cy={by} r={30} fill="url(#soft-gold)" opacity={0.6} />
                <circle cx={bx} cy={by} r={14} fill={C.gold} />
              </g>
            );
          })()}
        </g>

        {/* ================= FASE C ================= */}
        <g opacity={phC}>
          {/* keadaan dasar */}
          <MOLevel x={560} y={770} kind="piStar" sub="2p" elec={['u', 'u']} w={180} t={t} label="none" />
          <RichLabel x={690} y={770} parts={[['3', 'sup'], ['Σ'], ['g', 'sub'], ['−', 'sup'], ['  triplet (dasar)']]} size={30} anchor="start" />
          {/* oksigen singlet */}
          <g opacity={pair}>
            <MOLevel x={560} y={420} kind="piStar" sub="2p" elec={['ud', '']} w={180} t={t} label="none" lit={0.5 + 0.5 * Math.sin(t * 4)} />
            <RichLabel x={690} y={420} parts={[['1', 'sup'], ['Δ'], ['g', 'sub'], ['  singlet']]} size={30} anchor="start" color={C.gold} />
          </g>
          {/* elektron yang dibalik & dipindah */}
          {(() => {
            const p = ramp(t, wordOf(3, 'berpasangan') - 0.6, wordOf(3, 'berpasangan') + 0.6, EASE_IN_OUT);
            const x = mix(610, 528, p);
            const y = mix(750, 400, p);
            const g = Math.min(p * 4, 1) * (1 - ramp(p, 0.85, 1));
            return (
              <g opacity={g * phC}>
                <Spin x={x} y={y} up opacity={1 - p} len={38} width={4} />
                <Spin x={x} y={y} up={false} opacity={p} len={38} width={4} />
              </g>
            );
          })()}
          <g opacity={gap}>
            <TArrow x1={380} y1={760} x2={380} y2={432} color={C.gold} p={gap} width={5} />
            <Label x={360} y={596} size={32} color={C.gold} weight={700} anchor="end">
              ≈ 0,98 eV
            </Label>
          </g>
          <Label x={560} y={250} size={28} color={C.muted}>
            {'dua keadaan O₂ (π* saja)'}
          </Label>
          {/* molekul singlet yang bersemangat */}
          <g opacity={react}>
            {Array.from({length: 10}, (_, k) => {
              const ph = (((t * 0.6 + k / 10) % 1) + 1) % 1;
              const a = (k / 10) * Math.PI * 2;
              const rr = 70 + 90 * ph;
              return <circle key={k} cx={1400 + rr * Math.cos(a)} cy={720 + rr * 0.6 * Math.sin(a)} r={5} fill={C.gold} opacity={cyc(ph)} />;
            })}
            <Glow x={1400} y={720} r={170} color="gold" opacity={0.35 + 0.2 * Math.sin(t * 5)} />
            <O2 x={1400 + 4 * Math.sin(t * 13)} y={720} r={38} rot={8 * Math.sin(t * 7)} glow={0.9} />
          </g>
        </g>

        {/* ================= FASE D ================= */}
        <g opacity={phD}>
          {/* jaringan (skematis) */}
          <path d="M140,560 C460,520 760,600 1100,560 C1380,528 1600,580 1780,550 L1780,860 L140,860 Z" fill="#3a2350" opacity={0.7} />
          <path d="M140,560 C460,520 760,600 1100,560 C1380,528 1600,580 1780,550" fill="none" stroke="#c9a6ff" strokeWidth={3} opacity={0.6} />
          {Array.from({length: 22}, (_, k) => {
            const x = 190 + k * 72 + 12 * rand(k);
            const y = 640 + 150 * rand(k * 4.1);
            const near = CANCER.some((c) => Math.hypot(c.x - x, c.y - y) < c.r + 36);
            if (near) return null;
            const r = 26 + 6 * rand(k * 2.3);
            return (
              <g key={k}>
                <circle cx={x} cy={y + 2 * Math.sin(t + k)} r={r} fill="#6b4c8f" stroke="#c9a6ff" strokeWidth={2} opacity={0.75} />
                <circle cx={x + 4} cy={y - 3 + 2 * Math.sin(t + k)} r={r * 0.32} fill="#9a7fc4" opacity={0.8} />
              </g>
            );
          })}
          {/* cahaya merah */}
          <g opacity={light}>
            <path d={`M930,300 L990,300 L1340,600 L600,600 Z`} fill={RED} opacity={0.14 + 0.05 * Math.sin(t * 6)} />
            <path d={`M945,300 L975,300 L1200,600 L740,600 Z`} fill={RED} opacity={0.12} />
          </g>
          <rect x={910} y={236} width={100} height={64} rx={12} fill="#2a3150" stroke={RED} strokeWidth={3} opacity={0.4 + 0.6 * light} />
          <circle cx={960} cy={300} r={18} fill={RED} opacity={light} />
          <g opacity={light}>
            <Label x={1060} y={268} size={28} color={RED} weight={600} anchor="start">
              cahaya merah
            </Label>
          </g>
          {/* sel kanker */}
          {CANCER.map((c, i) => {
            const b = ramp(burst, i * 0.15, 0.55 + i * 0.15);
            const whole = 1 - b;
            return (
              <g key={i}>
                <path
                  d={Array.from({length: 13}, (_, k) => {
                    const a = (k / 12) * Math.PI * 2;
                    const rr = c.r * (1 + 0.1 * Math.sin(a * 3 + i + t * 1.5));
                    return `${k === 0 ? 'M' : 'L'}${(c.x + rr * Math.cos(a)).toFixed(1)},${(c.y + rr * Math.sin(a)).toFixed(1)}`;
                  }).join(' ') + 'Z'}
                  fill="#8d3f7a"
                  stroke="#ff9ad5"
                  strokeWidth={3}
                  opacity={whole}
                />
                <circle cx={c.x + 8} cy={c.y - 6} r={c.r * 0.38} fill="#b05a98" opacity={whole} />
                {/* pecahan */}
                {Array.from({length: 7}, (_, k) => {
                  const a = (k / 7) * Math.PI * 2 + i;
                  const d = 20 + 80 * b;
                  return <circle key={k} cx={c.x + d * Math.cos(a)} cy={c.y + d * Math.sin(a)} r={c.r * 0.22 * (1 - 0.5 * b)} fill="#8d3f7a" stroke="#ff9ad5" strokeWidth={2} opacity={Math.min(1, b * 5) * (1 - 0.6 * ramp(b, 0.6, 1))} />;
                })}
                {/* zat peka cahaya */}
                {Array.from({length: 6}, (_, k) => (
                  <circle key={`p${k}`} cx={c.x + (c.r * 0.6) * Math.cos(k * 1.1 + t * 0.6)} cy={c.y + (c.r * 0.6) * Math.sin(k * 1.1 + t * 0.6)} r={6} fill={C.mint} opacity={ps * whole} />
                ))}
                {/* oksigen singlet */}
                {Array.from({length: 8}, (_, k) => {
                  const ph = (((t * 0.9 + k / 8 + i * 0.2) % 1) + 1) % 1;
                  const a = k * 0.8 + i;
                  const rr = c.r * (0.3 + 0.9 * ph);
                  return (
                    <g key={`s${k}`} opacity={so * cyc(ph) * (1 - ramp(b, 0.5, 1))}>
                      <circle cx={c.x + rr * Math.cos(a)} cy={c.y + rr * Math.sin(a)} r={14} fill="url(#soft-gold)" />
                      <circle cx={c.x + rr * Math.cos(a)} cy={c.y + rr * Math.sin(a)} r={4.5} fill="#fff6d0" />
                    </g>
                  );
                })}
              </g>
            );
          })}
          {/* label */}
          <g opacity={ps}>
            <line x1={560} y1={470} x2={655} y2={655} stroke={C.mint} strokeWidth={2} opacity={0.7} />
            <Label x={500} y={450} size={26} color={C.mint} anchor="middle">
              zat peka cahaya
            </Label>
          </g>
          <g opacity={so}>
            <line x1={1430} y1={470} x2={1300} y2={660} stroke={C.gold} strokeWidth={2} opacity={0.7} />
            <RichLabel x={1460} y={450} parts={[['oksigen singlet '], ['1', 'sup'], ['O'], ['2', 'sub']]} size={26} color={C.gold} />
          </g>
          <Label x={1660} y={830} size={20} color={C.muted} anchor="end">
            ilustrasi skematis
          </Label>
          <g opacity={ramp(t, wordOf(4, 'kanker') - 0.2, wordOf(4, 'kanker') + 0.4)}>
            <Label x={980} y={835} size={26} color="#ff9ad5" weight={600}>
              sel kanker rusak
            </Label>
          </g>
        </g>
      </Stage>

      {/* ---------- HTML di luar Stage ---------- */}
      <Stamp x={960} y={250} p={block * phA} text="TERHAMBAT ATURAN SPIN" sub="triplet + singlet → lambat" />
      <Formula x={1400} y={400} p={fo * phC} accent={C.gold} caption="≈ 94 kJ/mol di atas keadaan dasar">
        <V>E</V>(<Sup>1</Sup>Δ<Sub>g</Sub>) − <V>E</V>(<Sup>3</Sup>Σ<Sub>g</Sub>
        <Sup>−</Sup>) ≈ 0,98 eV
      </Formula>
      <Badge x={1400} y={570} text="jauh lebih reaktif" color={C.gold} opacity={react * phC} scale={0.85 + 0.15 * react} icon="⚡" />
      <Badge x={960} y={180} text="terapi fotodinamik" color={C.pink} opacity={ramp(t, wordOf(4, 'terapi') - 0.3, wordOf(4, 'terapi') + 0.5)} />
    </AbsoluteFill>
  );
};

const V: React.FC<{children: React.ReactNode}> = ({children}) => <span style={{fontStyle: 'italic'}}>{children}</span>;
