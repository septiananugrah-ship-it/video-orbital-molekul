import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Atom, Badge, Bond, Formula, Frac, Glow, Stage} from '../components/primitives';
import {Stamp} from '../components/grupD';
import {Dash, KIND_COL, Label2, MOLevel, PiLobes, fillSeq, type MOKind} from '../components/moC';
import {RichLabel, lobePath} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 10: MO heteronuklir CO — orbital O lebih rendah, MO terpolarisasi, 10 e⁻ valensi (= N₂), orde 3,
// HOMO σ terpusat di C → CO mengikat Fe heme lewat C, ≈ 200–250× lebih kuat daripada O₂ (AUDIT).
const DX = 640;
const CY = 480;
const AX = 290;
const PX = 1500;

type Lv = {k: string; kind: MOKind; n: number; y: number; lab: [string, ('sub' | 'sup')?][]; from: ['2s' | '2p', '2s' | '2p']};
// energi kualitatif (px relatif, + = lebih rendah)
const C2P = -120;
const C2S = 120;
const O2P = -10;
const O2S = 285;
const LV: Lv[] = [
  {k: 's2', kind: 's', n: 1, y: 330, lab: [['σ'], ['2s']], from: ['2s', '2s']},
  {k: 's2s', kind: 's*', n: 1, y: 82, lab: [['σ*'], ['2s']], from: ['2s', '2s']},
  {k: 'p', kind: 'p', n: 2, y: 40, lab: [['π'], ['2p']], from: ['2p', '2p']},
  {k: 'sp', kind: 's', n: 1, y: -52, lab: [['σ'], ['2p']], from: ['2p', '2p']},
  {k: 'ps', kind: 'p*', n: 2, y: -172, lab: [['π*'], ['2p']], from: ['2p', '2p']},
  {k: 'sps', kind: 's*', n: 1, y: -250, lab: [['σ*'], ['2p']], from: ['2p', '2p']},
];

export const Hetero: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  const aoIn = ramp(t, 0.3, 1.3);
  const shift = ramp(t, wordOf(0, 'elektronegatif') - 0.4, wordOf(0, 'rendah') + 0.6, EASE_IN_OUT);
  const enLab = ramp(t, wordOf(0, 'rendah') - 0.2, wordOf(0, 'rendah') + 0.6) * (1 - ramp(t, cue(1) + 1, cue(1) + 1.8));
  const moIn = ramp(t, cue(1) - 0.2, cue(1) + 1.2);
  const bondLit = ramp(t, wordOf(1, 'ikatan', 0) - 0.3, wordOf(1, 'ikatan', 0) + 0.4) * (1 - ramp(t, wordOf(1, 'antiikatan') - 0.4, wordOf(1, 'antiikatan')));
  const antiLit = ramp(t, wordOf(1, 'antiikatan') - 0.2, wordOf(1, 'antiikatan') + 0.4) * (1 - ramp(t, wordOf(1, 'Elektron') - 0.2, wordOf(1, 'Elektron') + 0.3));
  const sPiB = slot(t, wordOf(1, 'ikatan', 0) - 0.3, wordOf(1, 'antiikatan') - 0.1);
  const sPiA = slot(t, wordOf(1, 'antiikatan') - 0.1, wordOf(1, 'Elektron') + 0.1);
  const sPi = slot(t, wordOf(1, 'ikatan', 0) - 0.3, wordOf(1, 'Elektron') + 0.1);
  const sRata = slot(t, wordOf(1, 'Elektron') + 0.1, cue(2) + 0.2);
  const fill = ramp(t, cue(2) + 0.2, wordOf(2, 'nitrogen') + 0.6, (x) => x);
  const sIso = slot(t, wordOf(2, 'sama') - 0.3, cue(3) + 0.3);
  const sOrde = slot(t, wordOf(2, 'Orde') - 0.1, cue(3) + 0.3);
  const homo = ramp(t, wordOf(3, 'HOMO') - 0.3, wordOf(3, 'HOMO') + 0.5);
  const hand = ramp(t, wordOf(3, 'tangan') - 0.6, wordOf(3, 'tangan') + 0.6, BACK);
  const sHand = slot(t, wordOf(3, 'terpusat') - 0.4, cue(4) + 0.2);
  // baris 4: heme
  const toHeme = ramp(t, cue(4) - 0.3, cue(4) + 0.9, EASE_IN_OUT);
  const heme = ramp(t, cue(4) + 0.2, cue(4) + 1.2);
  const dock = ramp(t, wordOf(4, 'melalui') - 0.3, wordOf(4, 'karbonnya') + 0.6, EASE_IN_OUT);
  const o2 = ramp(t, wordOf(4, 'jauh') - 0.6, wordOf(4, 'kuat') + 0.6, EASE_IN_OUT);
  const repel = ramp(t, wordOf(4, 'daripada') - 0.1, wordOf(4, 'oksigen') + 0.9, EASE_IN_OUT);
  const ratio = ramp(t, wordOf(4, 'kuat') - 0.2, wordOf(4, 'kuat') + 0.6, BACK);
  const poison = ramp(t, wordOf(4, 'keracunan') - 0.3, wordOf(4, 'keracunan') + 0.4);

  const diag = 1 - toHeme;
  const Y = (v: number) => CY + v;
  const o2p = mix(C2P, O2P, shift);
  const o2s = mix(C2S, O2S, shift);
  const aoY = {L: {'2s': C2S, '2p': C2P}, R: {'2s': o2s, '2p': o2p}};
  // isi seperti N₂ (urutan tercampur): σ2s, σ*2s, π, σ2p
  const f = fillSeq(10 * fill, [2, 2, 4, 2, 0, 0]);
  const occ: Record<string, number> = {s2: f[0], s2s: f[1], p: f[2], sp: f[3], ps: 0, sps: 0};
  const litOf: Record<string, number> = {p: bondLit, ps: antiLit};
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
  const aoHalf = (n: number) => (n === 3 ? 1.5 * 42 + 12 : 21);

  // heme geometry
  const HX = 900;
  const HY = 690;
  const FeY = HY - 6;
  const cY = mix(330, FeY - 92, dock);
  const oY = cY - 104;
  const o2x = mix(1560, 1180, o2) + 260 * repel;
  const o2y = mix(360, 470, o2) - 60 * repel;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* ---------------- diagram MO heteronuklir ---------------- */}
        <g opacity={diag}>
          <Glow x={DX - AX} y={Y(C2P)} r={200} color="white" opacity={0.05 * aoIn} />
          <Glow x={DX + AX} y={Y(o2p)} r={200} color="red" opacity={0.1 * aoIn} />
          <g opacity={aoIn}>
            <Atom x={DX - AX} y={212} el="C" r={34} />
            <Atom x={DX + AX} y={212} el="O" r={34} />
          </g>
          {/* penghubung (miring: ikatan dekat O, antiikatan dekat C) */}
          {LV.map((L) => {
            const h = L.n === 2 ? 60 + 9 : 40;
            const nA = L.from[0] === '2p' ? 3 : 1;
            return (
              <g key={`d${L.k}`}>
                <Dash x1={DX - AX + aoHalf(nA) + 6} y1={Y(aoY.L[L.from[0]])} x2={DX - h - 8} y2={Y(L.y)} t={t} opacity={moIn} />
                <Dash x1={DX + AX - aoHalf(nA) - 6} y1={Y(aoY.R[L.from[1]])} x2={DX + h + 8} y2={Y(L.y)} t={t} opacity={moIn} />
              </g>
            );
          })}
          {/* orbital atom */}
          {(['L', 'R'] as const).map((s) => {
            const x = DX + (s === 'L' ? -AX : AX);
            const anchor = s === 'L' ? 'end' : 'start';
            const sg = s === 'L' ? -1 : 1;
            return (
              <g key={s} opacity={aoIn}>
                <MOLevel x={x} y={Y(aoY[s]['2s'])} w={42} color={C.muted} t={t} width={4} e={2 * (1 - fill)} spin={36} />
                <MOLevel x={x} y={Y(aoY[s]['2p'])} w={42} n={3} gap={12} color={C.muted} t={t} width={4} e={(s === 'L' ? 2 : 4) * (1 - fill)} spin={36} />
                <Label2 x={x + sg * (aoHalf(3) + 14)} y={Y(aoY[s]['2p'])} anchor={anchor} size={24} color={C.muted}>
                  2p
                </Label2>
                <Label2 x={x + sg * (aoHalf(1) + 14)} y={Y(aoY[s]['2s'])} anchor={anchor} size={24} color={C.muted}>
                  2s
                </Label2>
              </g>
            );
          })}
          {/* panah energi: O lebih rendah */}
          <g opacity={enLab}>
            <line x1={DX + AX + 120} y1={Y(C2P)} x2={DX + AX + 120} y2={Y(o2p) - 12} stroke={C.red} strokeWidth={3} markerEnd="url(#arrow-red)" />
            <Label2 x={DX + AX + 136} y={Y((C2P + O2P) / 2) - 4} anchor="start" size={22} color={C.red}>
              O lebih elektronegatif
            </Label2>
          </g>
          {/* orbital molekul */}
          {LV.map((L) => {
            const isHomo = L.k === 'sp';
            const col = KIND_COL[L.kind];
            return (
              <g key={L.k} opacity={moIn}>
                {isHomo ? <Glow x={DX} y={Y(L.y)} r={110} color="gold" opacity={homo * (0.35 + 0.25 * pulse)} /> : null}
                <MOLevel
                  x={DX}
                  y={Y(L.y)}
                  w={L.n === 2 ? 60 : 80}
                  n={L.n}
                  gap={18}
                  color={col}
                  e={occ[L.k]}
                  t={t}
                  lit={Math.max(litOf[L.k] ?? 0, isHomo ? homo : 0)}
                  litColor={isHomo ? C.gold : undefined}
                />
                <RichLabel x={DX + (L.n === 2 ? 69 : 40) + 14} y={Y(L.y)} parts={L.lab} size={24} color={col} anchor="start" font="serif" />
                {isHomo ? (
                  <Label2 x={DX + 116} y={Y(L.y)} anchor="start" size={26} weight={800} color={C.gold} opacity={homo}>
                    HOMO
                  </Label2>
                ) : null}
              </g>
            );
          })}

          {/* ---------------- panel kanan ---------------- */}
          <g opacity={sPiB}>
            <PiLobes x={PX} y={440} d={150} sL={0.72} sR={1.12} t={t} />
            <Label2 x={PX} y={268} size={26} color={C.amber}>
              orbital π ikatan
            </Label2>
          </g>
          <g opacity={sPiA}>
            <PiLobes x={PX} y={440} d={150} sL={1.12} sR={0.72} ph={-1} t={t} />
            <Label2 x={PX} y={268} size={26} color={C.pink}>
              orbital π* antiikatan
            </Label2>
          </g>
          <g opacity={sPi}>
            <Atom x={PX - 75} y={440} el="C" r={20} glow={0} />
            <Atom x={PX + 75} y={440} el="O" r={20} glow={0} />
            <Label2 x={PX} y={624} size={23} color={C.muted}>
              lobus besar = sumbangan besar
            </Label2>
          </g>
          <g opacity={sPiB}>
            <Label2 x={PX} y={584} size={24} color={C.ink}>
              lebih banyak dari O (rendah)
            </Label2>
          </g>
          <g opacity={sPiA}>
            <Label2 x={PX} y={584} size={24} color={C.ink}>
              lebih banyak dari C (tinggi)
            </Label2>
          </g>
          <g opacity={sRata}>
            <Label2 x={PX} y={300} size={26} color={C.ink}>
              elektron ikatan condong ke O
            </Label2>
            {Array.from({length: 26}, (_, k) => {
              const u = (k * 0.618) % 1;
              const a = k * 2.4 + t * 0.6;
              const rr = 30 + 70 * ((k * 0.37) % 1);
              const bx = PX + 30 + rr * Math.cos(a) * 1.3;
              const by = 450 + rr * Math.sin(a) * 0.6;
              return <circle key={k} cx={bx} cy={by} r={4 + 2 * u} fill={C.cyan} opacity={0.35 + 0.4 * u} />;
            })}
            <Atom x={PX - 70} y={450} el="C" r={30} />
            <Atom x={PX + 70} y={450} el="O" r={30} />
          </g>
          <g opacity={sIso}>
            <Atom x={PX - 70} y={380} el="C" r={34} />
            <Atom x={PX + 70} y={380} el="O" r={34} />
            <Bond x1={PX - 36} y1={380} x2={PX + 36} y2={380} order={3} width={10} />
            <Atom x={PX - 70} y={530} el="N" r={34} />
            <Atom x={PX + 70} y={530} el="N" r={34} />
            <Bond x1={PX - 36} y1={530} x2={PX + 36} y2={530} order={3} width={10} />
            <RichLabel x={PX} y={458} parts={[['10 e'], ['−', 'sup'], [' valensi']]} size={26} color={C.mint} />
            <Label2 x={PX} y={276} size={26} color={C.ink}>
              isoelektronik
            </Label2>
          </g>
          <g opacity={sHand}>
            <path d={lobePath(PX - 50, 450, 190 * (0.6 + 0.4 * hand) * (1 + 0.04 * Math.sin(t * 3)), 120, -90)} fill={C.gold} fillOpacity={0.3 + 0.15 * pulse} stroke={C.gold} strokeWidth={3} />
            <path d={lobePath(PX + 80, 450, 60, 50, 90)} fill={C.gold} fillOpacity={0.25} stroke={C.gold} strokeWidth={2} />
            <Bond x1={PX - 50} y1={450} x2={PX + 66} y2={450} order={3} width={10} />
            <Atom x={PX - 50} y={450} el="C" r={34} />
            <Atom x={PX + 66} y={450} el="O" r={34} />
            <Label2 x={PX} y={290} size={28} weight={800} color={C.gold}>
              HOMO: σ di ujung karbon
            </Label2>
            <Label2 x={PX - 40} y={584} size={24} color={C.ink} opacity={hand}>
              “tangan” terjulur dari C
            </Label2>
          </g>
        </g>

        {/* ---------------- heme + CO ---------------- */}
        <g opacity={heme}>
          {(() => {
            const pts = Array.from({length: 20}, (_, k) => {
              const a = (k / 20) * Math.PI * 2 + t * 0.05;
              const r = k % 5 === 0 ? 300 : 270 + 14 * Math.cos(k * 1.3);
              return [HX + r * Math.cos(a), HY + r * 0.24 * Math.sin(a)];
            });
            const d = `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')} Z`;
            return (
              <>
                <ellipse cx={HX} cy={HY + 20} rx={330} ry={90} fill="#000" opacity={0.35} />
                <path d={d} fill="rgba(160,131,255,0.14)" stroke={C.violet} strokeWidth={3} strokeLinejoin="round" />
                {[0, 1, 2, 3].map((k) => {
                  const a = (k / 4) * Math.PI * 2 + Math.PI / 4 + t * 0.05;
                  const nx = HX + 130 * Math.cos(a);
                  const ny = HY + 130 * 0.24 * Math.sin(a);
                  return (
                    <g key={k}>
                      <line x1={HX} y1={HY} x2={nx} y2={ny} stroke={C.blue} strokeWidth={3} opacity={0.6} />
                      <ellipse cx={HX + 205 * Math.cos(a)} cy={HY + 205 * 0.24 * Math.sin(a)} rx={56} ry={16} fill="none" stroke={C.violet} strokeWidth={2.5} opacity={0.8} />
                      <Atom x={nx} y={ny} el="N" r={16} label={null} glow={0} />
                    </g>
                  );
                })}
              </>
            );
          })()}
          <Label2 x={HX} y={812} size={24} color={C.violet}>
            heme dalam hemoglobin
          </Label2>
        </g>
        <g opacity={toHeme}>
          {/* CO turun dan mengikat Fe lewat C */}
          <path d={lobePath(HX, cY + 20, 70 + 10 * pulse, 60, 180)} fill={C.gold} fillOpacity={0.25 + 0.2 * dock} stroke={C.gold} strokeWidth={2.5} opacity={1 - 0.5 * dock} />
          <line x1={HX} y1={cY} x2={HX} y2={FeY} stroke={C.gold} strokeWidth={8} strokeLinecap="round" opacity={dock} />
          <Bond x1={HX} y1={cY} x2={HX} y2={oY} order={3} width={10} />
          <Atom x={HX} y={oY} el="O" r={34} />
          <Atom x={HX} y={cY} el="C" r={34} />
        </g>
        <g opacity={heme}>
          <circle cx={HX} cy={FeY} r={70} fill="url(#soft-gold)" opacity={0.3 + 0.3 * dock * pulse} />
          <circle cx={HX} cy={FeY} r={30} fill="#d9822b" stroke="#ffd08a" strokeWidth={2} />
          <Label2 x={HX} y={FeY + 1} size={24} weight={800} color="#fff">
            Fe
          </Label2>
        </g>
        <g opacity={o2 * heme * (1 - 0.6 * repel)}>
          <Bond x1={o2x - 40} y1={o2y} x2={o2x + 40} y2={o2y} order={2} width={10} />
          <Atom x={o2x - 40} y={o2y} el="O" r={30} />
          <Atom x={o2x + 40} y={o2y} el="O" r={30} />
          <RichLabel x={o2x} y={o2y - 58} parts={[['O'], ['2', 'sub'], [' kalah bersaing']]} size={24} color={C.red} />
        </g>
      </Stage>
      <Formula x={PX} y={760} p={sOrde} accent={C.cyan} size={56} caption="sama dengan N₂">
        orde = <Frac n="8 − 2" d="2" /> = 3
      </Formula>
      <Badge x={1460} y={266} text="CO ≈ 200–250× lebih kuat daripada O₂" color={C.gold} opacity={ratio * heme} scale={0.85 + 0.1 * ratio} />
      <Stamp x={1460} y={820} p={poison} text="KERACUNAN CO" color={C.red} rot={-5} size={34} />
    </AbsoluteFill>
  );
};
