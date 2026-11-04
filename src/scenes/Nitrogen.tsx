import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, rand, ramp, slot, win} from '../anim';
import {Atom, Badge, Bond, Formula, Frac, Glow, Label, Stage, Sub} from '../components/primitives';
import {Bacterium, Diatomic, Flame, MOStack, N2_MO, flowPt} from '../components/moD';
import {RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 14: 78 % udara = N₂ → N≡N orde 3 (diagram MO) → ≈ 945 kJ/mol (palu memantul) →
// Haber–Bosch (reaktor, N₂ + 3H₂ → 2NH₃, pupuk, ≈ 1–2 % energi dunia) → bakteri bintil akar (nitrogenase, suhu kamar).

const NH3: React.FC<{x: number; y: number; s?: number; rot?: number; opacity?: number}> = ({x, y, s = 1, rot = 0, opacity = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
    {[0, 1, 2].map((k) => {
      const a = (k / 3) * Math.PI * 2 + Math.PI / 2;
      return <line key={`b${k}`} x1={0} y1={0} x2={18 * Math.cos(a)} y2={18 * Math.sin(a)} stroke="#c9d2ea" strokeWidth={3} />;
    })}
    {[0, 1, 2].map((k) => {
      const a = (k / 3) * Math.PI * 2 + Math.PI / 2;
      return <circle key={k} cx={20 * Math.cos(a)} cy={20 * Math.sin(a)} r={7} fill="#f2f5ff" />;
    })}
    <circle cx={0} cy={0} r={12} fill={C.blue} />
  </g>
);

/** Tanaman kecil (batang + daun) — sway halus. */
const Plant: React.FC<{x: number; y: number; t: number; s?: number; roots?: boolean}> = ({x, y, t, s = 1, roots}) => {
  const sw = 4 * Math.sin(t * 1.1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0,0 C${sw},-60 ${-sw},-120 ${sw * 1.5},-190`} fill="none" stroke="#5fbf6a" strokeWidth={8} strokeLinecap="round" />
      {[
        [-1, 60],
        [1, 100],
        [-1, 140],
        [1, 175],
      ].map(([sd, h], k) => (
        <path
          key={k}
          d={`M${sw * (h / 190)},${-h} q${sd * 40},${-30} ${sd * 80},${-8} q${-sd * 36},${26} ${-sd * 80},${8}`}
          fill="#4fae5c"
          stroke="#8be09a"
          strokeWidth={2}
          transform={`rotate(${sd * 6 * Math.sin(t * 1.3 + k)} 0 ${-h})`}
        />
      ))}
      {roots
        ? [-1, -0.4, 0.3, 1].map((sd, k) => (
            <path key={`r${k}`} d={`M0,0 C${sd * 30},60 ${sd * 90},120 ${sd * 120},${200 + 30 * (k % 2)}`} fill="none" stroke="#c8a77a" strokeWidth={5} strokeLinecap="round" />
          ))
        : null}
    </g>
  );
};

export const Nitrogen: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // ---------- fase 1a: udara ----------
  const ph1a = win(t, cue(0) - 0.6, cue(1) - 0.4, 0.8, 0.6);
  const pie = ramp(t, wordOf(0, 'tujuh') - 0.4, wordOf(0, 'persen') + 0.6, EASE_IN_OUT);
  const plant = ramp(t, wordOf(0, 'tumbuhan') - 0.3, wordOf(0, 'tumbuhan') + 0.6);

  // ---------- fase 1b: N≡N + MO + palu ----------
  const ph1b = win(t, cue(1) - 0.5, cue(3) - 0.7, 0.8, 0.6);
  const ep = mix(0, 10, ramp(t, cue(1) + 0.2, wordOf(1, 'terisi') + 0.2, EASE_IN_OUT));
  const filled = ramp(t, wordOf(1, 'terisi') - 0.2, wordOf(1, 'terisi') + 0.6);
  const stable = ramp(t, wordOf(1, 'stabil') - 0.3, wordOf(1, 'stabil') + 0.5, BACK);
  const oOrde = slot(t, wordOf(1, 'Orde') - 0.2, wordOf(2, 'sembilan') - 0.2);
  const oE = slot(t, wordOf(2, 'sembilan') - 0.2, cue(3) - 0.5);
  const hm0 = wordOf(2, 'Memecah') - 0.3;
  const hammer = ramp(t, hm0 - 0.4, hm0 + 0.2);
  const sPh = Math.max(0, t - hm0) / 1.3;
  const swing = hammer * (0.5 - 0.5 * Math.cos(2 * Math.PI * sPh));
  const hit = hammer * Math.exp(-((((sPh % 1) - 0.5) / 0.08) ** 2));

  // ---------- fase 2: Haber–Bosch ----------
  const ph2 = win(t, cue(3) - 0.5, cue(4) - 0.7, 0.8, 0.6);
  const hot = ramp(t, wordOf(3, 'suhu') - 0.3, wordOf(3, 'tinggi') + 0.4);
  const eq = ramp(t, wordOf(3, 'hidrogen') - 0.3, wordOf(3, 'hidrogen') + 0.5, BACK);
  const ammo = ramp(t, wordOf(3, 'amonia') - 0.3, wordOf(3, 'amonia') + 0.5);
  const sack = ramp(t, wordOf(3, 'pupuk') - 0.3, wordOf(3, 'pupuk') + 0.6, BACK);
  const meter = ramp(t, wordOf(3, 'memakan') - 0.3, wordOf(3, 'memakan') + 0.5);
  const cells = ramp(t, wordOf(3, 'satu') - 0.2, wordOf(3, 'dua') + 0.5);

  // ---------- fase 3: bakteri tanah ----------
  const ph3 = ramp(t, cue(4) - 0.5, cue(4) + 0.4);
  const bac = ramp(t, wordOf(4, 'Bakteri') - 0.2, wordOf(4, 'Bakteri') + 0.8);
  const enz = ramp(t, wordOf(4, 'nitrogenase') - 0.3, wordOf(4, 'nitrogenase') + 0.5, BACK);
  const copy = ramp(t, wordOf(4, 'meniru') - 0.4, wordOf(4, 'meniru') + 0.5);

  // pie
  const PX = 520;
  const PY = 560;
  const PR = 230;
  const arc = (a0: number, a1: number, r = PR) => {
    const p0 = [PX + r * Math.sin(a0), PY - r * Math.cos(a0)];
    const p1 = [PX + r * Math.sin(a1), PY - r * Math.cos(a1)];
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${PX},${PY} L${p0[0]},${p0[1]} A${r},${r} 0 ${large} 1 ${p1[0]},${p1[1]} Z`;
  };
  const TAU = Math.PI * 2;
  const aN = TAU * 0.78 * pie;
  const aO = TAU * 0.21 * pie;

  // molekul N≡N
  const MX = 560;
  const MY = 620;
  const shake = hit * 10 * Math.sin(t * 60);

  // palu: poros kanan bawah
  const pivot = [930, 760];
  const ang = mix(-118, -158, swing) * (Math.PI / 180);
  const head = [pivot[0] + 330 * Math.cos(ang), pivot[1] + 330 * Math.sin(ang)];

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={540} r={680} color="cyan" opacity={0.05 + 0.02 * Math.sin(t)} />

        {/* ================= 1a: udara ================= */}
        <g opacity={ph1a}>
          <circle cx={PX} cy={PY} r={PR + 8} fill="none" stroke={C.faint} strokeWidth={3} />
          {pie > 0.001 ? <path d={arc(0, aN)} fill={C.blue} opacity={0.85} /> : null}
          {pie > 0.001 ? <path d={arc(aN, aN + aO)} fill={C.red} opacity={0.8} /> : null}
          {pie > 0.001 ? <path d={arc(aN + aO, aN + aO + TAU * 0.01 * pie)} fill={C.muted} opacity={0.8} /> : null}
          <g opacity={ramp(pie, 0.6, 1)}>
            <RichLabel x={PX + 50} y={PY + 50} parts={[['78 % N'], ['2', 'sub']]} size={52} color="#fff" weight={800} />
            <RichLabel x={PX - 190} y={PY - 230} parts={[['21 % O'], ['2', 'sub']]} size={32} color={C.red} anchor="end" />
            <Label x={PX + 10} y={PY - 262} size={24} color={C.muted} anchor="start">
              ≈ 1 % lainnya
            </Label>
          </g>
          <Label x={PX} y={PY + PR + 46} size={30} color={C.muted}>
            komposisi udara
          </Label>
          {/* tanaman dikelilingi N₂ yang tak terpakai */}
          <g opacity={plant}>
            <rect x={1040} y={740} width={520} height={20} rx={10} fill="#5b3a20" opacity={0.8} />
            <Plant x={1300} y={740} t={t} s={1.3} />
            {Array.from({length: 9}, (_, k) => {
              const ph = (((t * 0.12 + rand(k * 2.7)) % 1) + 1) % 1;
              const a = rand(k * 1.3) * Math.PI * 2;
              const rr = 140 + 120 * ph;
              const x = 1300 + rr * Math.cos(a + t * 0.1);
              const y = 520 + rr * 0.6 * Math.sin(a + t * 0.1);
              return <Diatomic key={k} x={x} y={y} d={24} r={11} order={3} rot={t * 50 * (rand(k) - 0.5)} opacity={0.4 + 0.6 * cyc(ph)} />;
            })}
            <Label x={1300} y={810} size={28} color={C.ink}>
              {'tumbuhan tak bisa memakai N₂ langsung'}
            </Label>
          </g>
        </g>

        {/* ================= 1b: N≡N ================= */}
        <g opacity={ph1b}>
          <Glow x={MX} y={MY} r={220} color="cyan" opacity={0.2 + 0.25 * filled} />
          <ellipse cx={MX + shake} cy={MY} rx={120} ry={46} fill={C.cyan} opacity={0.12 + 0.12 * filled * (0.6 + 0.4 * Math.sin(t * 3))} />
          <Bond x1={MX - 62 + shake} y1={MY} x2={MX + 62 + shake} y2={MY} order={3} width={18} />
          <Atom x={MX - 66 + shake} y={MY} el="N" r={56} />
          <Atom x={MX + 66 + shake} y={MY} el="N" r={56} />
          <Label x={MX} y={MY + 110} size={30} color={C.blue} weight={700}>
            N≡N
          </Label>
          {/* riak tumbukan palu */}
          {[0, 1].map((k) => (
            <circle key={k} cx={MX + 30} cy={MY - 40} r={30 + 80 * ((hit + k * 0.4) % 1)} fill="none" stroke={C.gold} strokeWidth={3} opacity={hit * (1 - k * 0.4)} />
          ))}
          {/* palu */}
          <g opacity={hammer}>
            <line x1={pivot[0]} y1={pivot[1]} x2={head[0]} y2={head[1]} stroke="#c89a5a" strokeWidth={16} strokeLinecap="round" />
            <g transform={`translate(${head[0]} ${head[1]}) rotate(${(ang * 180) / Math.PI + 90})`}>
              <rect x={-60} y={-30} width={120} height={60} rx={10} fill="#9aa6c8" stroke="#e1e7fb" strokeWidth={3} />
              <rect x={-60} y={-30} width={22} height={60} rx={6} fill="#6c7898" />
            </g>
          </g>
          <MOStack
            x={1450}
            y={830}
            levels={N2_MO}
            scale={0.98}
            w={116}
            t={t}
            ep={ep}
            size={26}
            lit={(i) => (N2_MO[i].kind === 'sigma' || N2_MO[i].kind === 'pi' ? filled * (0.7 + 0.3 * Math.sin(t * 3 + i)) : 0)}
            opacity={(i) => (N2_MO[i].kind === 'sigmaStar' || N2_MO[i].kind === 'piStar' ? (N2_MO[i].sub === '2p' ? 1 - 0.4 * filled : 1) : 1)}
            ao={{dy2s: 40, dy2p: 225, label: 'N', dx: 230}}
          />
          <g opacity={filled}>
            <Label x={1450} y={340} size={26} color={C.cyan} weight={600}>
              semua orbital ikatan terisi
            </Label>
          </g>
        </g>

        {/* ================= 2: Haber–Bosch ================= */}
        <g opacity={ph2}>
          {/* pipa masuk */}
          <path d="M150,600 L390,600" stroke="#59627e" strokeWidth={34} strokeLinecap="round" />
          <path d="M570,600 L1000,600" stroke="#59627e" strokeWidth={34} strokeLinecap="round" />
          {Array.from({length: 6}, (_, k) => {
            const ph = (((t * 0.35 + k / 6) % 1) + 1) % 1;
            const [x, y] = flowPt(ph, [
              [150, 600],
              [400, 600],
            ]);
            return k % 2 ? (
              <Diatomic key={k} x={x} y={y} d={22} r={10} order={3} rot={t * 60} opacity={cyc(ph)} />
            ) : (
              <Diatomic key={k} x={x} y={y} d={16} r={7} color="#f2f5ff" rot={-t * 80} opacity={cyc(ph)} />
            );
          })}
          {Array.from({length: 5}, (_, k) => {
            const ph = (((t * 0.3 + k / 5) % 1) + 1) % 1;
            const [x, y] = flowPt(ph, [
              [560, 600],
              [1010, 600],
            ]);
            return <NH3 key={k} x={x} y={y} s={0.85} rot={t * 50 + k * 40} opacity={ammo * cyc(ph)} />;
          })}
          {/* reaktor */}
          <rect x={390} y={410} width={180} height={380} rx={80} fill="#4a5470" stroke="#c9d2ea" strokeWidth={3} />
          <rect x={410} y={430} width={40} height={340} rx={20} fill="#fff" opacity={0.08} />
          <rect x={390} y={410} width={180} height={380} rx={80} fill={C.red} opacity={0.25 * hot * (0.8 + 0.2 * Math.sin(t * 4))} />
          <Flame x={440} y={830} s={0.5 * hot} t={t} />
          <Flame x={520} y={830} s={0.45 * hot} t={t} seed={4} />
          {/* termometer */}
          <rect x={300} y={430} width={26} height={220} rx={13} fill="#1a2240" stroke="#c9d2ea" strokeWidth={2} />
          <rect x={306} y={640 - 200 * (0.2 + 0.75 * hot)} width={14} height={200 * (0.2 + 0.75 * hot)} rx={7} fill={C.red} />
          <circle cx={313} cy={660} r={20} fill={C.red} />
          <Label x={313} y={706} size={22} color={C.red}>
            suhu
          </Label>
          {/* pengukur tekanan */}
          <circle cx={650} cy={480} r={50} fill="#1a2240" stroke="#c9d2ea" strokeWidth={3} />
          {(() => {
            const a = mix(-130, 110, hot) + 3 * Math.sin(t * 9) * hot;
            const r = (a * Math.PI) / 180;
            return <line x1={650} y1={480} x2={650 + 38 * Math.sin(r)} y2={480 - 38 * Math.cos(r)} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />;
          })()}
          <Label x={650} y={555} size={22} color={C.gold}>
            tekanan
          </Label>
          <RichLabel x={170} y={555} parts={[['N'], ['2', 'sub'], [' + H'], ['2', 'sub']]} size={26} color={C.ink} anchor="start" />
          <g opacity={ammo}>
            <RichLabel x={780} y={555} parts={[['NH'], ['3', 'sub']]} size={28} color={C.blue} />
          </g>
          {/* karung pupuk */}
          <g opacity={sack} transform={`translate(1080 ${680 + (1 - sack) * 40})`}>
            <path d="M-80,-90 Q0,-120 80,-90 L100,110 Q0,130 -100,110 Z" fill="#d9c79a" stroke="#f3e6c2" strokeWidth={3} />
            <path d="M-80,-90 Q0,-70 80,-90" fill="none" stroke="#a8925c" strokeWidth={4} />
            <text x={0} y={10} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={30} fill="#5b4520">
              PUPUK
            </text>
            <Plant x={0} y={78} t={t} s={0.3} />
          </g>
          {/* meter energi dunia: 100 kotak, 1–2 menyala */}
          <g opacity={meter}>
            <Label x={1520} y={385} size={28} color={C.ink} weight={600}>
              konsumsi energi dunia
            </Label>
            {Array.from({length: 100}, (_, k) => {
              const cx = 1340 + (k % 10) * 37;
              const cy = 420 + Math.floor(k / 10) * 37;
              const on = k === 0 ? cells : k === 1 ? cells * (0.45 + 0.35 * Math.sin(t * 3)) : 0;
              return (
                <g key={k}>
                  <rect x={cx} y={cy} width={30} height={30} rx={5} fill="#1a2240" stroke={C.faint} strokeWidth={1.5} />
                  {on > 0 ? <rect x={cx} y={cy} width={30} height={30} rx={5} fill={C.gold} opacity={on} /> : null}
                </g>
              );
            })}
            <g opacity={cells}>
              <Label x={1520} y={820} size={44} color={C.gold} weight={800}>
                ≈ 1–2 %
              </Label>
            </g>
          </g>
        </g>

        {/* ================= 3: bakteri bintil akar ================= */}
        <g opacity={ph3}>
          <path d="M120,470 L1800,470 L1800,860 L120,860 Z" fill="#3a2716" opacity={0.75} />
          <line x1={120} y1={470} x2={1800} y2={470} stroke="#7a5a3a" strokeWidth={4} />
          {Array.from({length: 26}, (_, k) => (
            <circle key={k} cx={140 + rand(k * 3.7) * 1640} cy={500 + rand(k * 1.9) * 340} r={3 + 4 * rand(k)} fill="#6b4c30" opacity={0.6} />
          ))}
          <Plant x={600} y={470} t={t} s={1.4} roots />
          {/* bintil */}
          {[
            [540, 600],
            [680, 640],
            [470, 690],
            [730, 730],
            [600, 760],
          ].map(([x, y], k) => (
            <g key={k}>
              <circle cx={x} cy={y} r={20 + 2 * Math.sin(t * 2 + k)} fill="#e58fb5" stroke="#ffc2dc" strokeWidth={2} />
              {k === 1 ? <circle cx={x} cy={y} r={34} fill="none" stroke={C.mint} strokeWidth={3} strokeDasharray="6 6" strokeDashoffset={-t * 20} opacity={bac} /> : null}
            </g>
          ))}
          <g opacity={bac}>
            <line x1={714} y1={630} x2={1110} y2={520} stroke={C.mint} strokeWidth={2} opacity={0.6} />
            <line x1={714} y1={652} x2={1110} y2={790} stroke={C.mint} strokeWidth={2} opacity={0.6} />
            <Label x={350} y={780} size={26} color="#ffc2dc">
              bintil akar
            </Label>
            {/* zoom bintil */}
            <circle cx={1300} cy={660} r={190} fill="#4a1f3a" stroke={C.mint} strokeWidth={4} />
            {Array.from({length: 9}, (_, k) => (
              <Bacterium key={k} x={1300 + 120 * (rand(k * 2.1) - 0.5) * 2} y={660 + 100 * (rand(k * 4.3) - 0.5) * 2} t={t} seed={k} s={1.4} />
            ))}
            {/* N₂ masuk → NH₃ keluar */}
            {Array.from({length: 4}, (_, k) => {
              const ph = (((t * 0.3 + k / 4) % 1) + 1) % 1;
              const x = mix(1060, 1300, ph);
              const y = mix(500, 650, ph);
              return <Diatomic key={k} x={x} y={y} d={22} r={10} order={3} rot={t * 40} opacity={cyc(ph)} />;
            })}
            {Array.from({length: 4}, (_, k) => {
              const ph = (((t * 0.3 + k / 4 + 0.5) % 1) + 1) % 1;
              const x = mix(1300, 1560, ph);
              const y = mix(670, 520, ph);
              return <NH3 key={k} x={x} y={y} s={0.8} rot={t * 40 + k * 30} opacity={cyc(ph)} />;
            })}
            <Label x={1300} y={445} size={26} color={C.mint}>
              bakteri dalam bintil
            </Label>
          </g>
          <g opacity={copy}>
            <Label x={1300} y={880} size={26} color={C.cyan}>
              {'kunci: memahami orbital N₂'}
            </Label>
          </g>
        </g>
      </Stage>

      {/* ---------- HTML ---------- */}
      <Formula x={MX} y={290} p={oOrde * ph1b} accent={C.cyan}>
        orde ={' '}
        <Frac n={<>8 − 2</>} d={<>2</>} /> = 3
      </Formula>
      <Formula x={MX} y={290} p={oE * ph1b} accent={C.gold} caption="energi untuk memutus N≡N">
        ≈ 945 kJ/mol
      </Formula>
      <Badge x={1450} y={270} text="salah satu molekul paling stabil" color={C.cyan} opacity={stable * ph1b * (1 - ramp(t, cue(2) - 0.4, cue(2) + 0.2))} scale={0.9 + 0.1 * stable} />
      <Formula x={960} y={260} p={eq * ph2} accent={C.blue} size={56}>
        N<Sub>2</Sub> + 3H<Sub>2</Sub> → 2NH<Sub>3</Sub>
      </Formula>
      <Badge x={480} y={360} text="suhu & tekanan tinggi" color={C.red} opacity={hot * ph2} />
      <Badge x={1300} y={360} text="nitrogenase · suhu kamar" color={C.mint} opacity={enz * ph3} scale={0.85 + 0.15 * enz} />
    </AbsoluteFill>
  );
};

