import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, slot} from '../anim';
import {Card, DrawPath, Formula, Frac, Glow, Stage, V} from '../components/primitives';
import {Label2, MOLevel, levelXs} from '../components/moC';
import {Spin} from '../components/vbD';
import {Electron, PhotonPacket, wlColor} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 11: HOMO (emas) & LUMO (mint); aliran elektron HOMO→LUMO antarmolekul; foton: HOMO→LUMO, ΔE ↔ warna;
// Nobel Kimia 1981 Fukui & Hoffmann (AUDIT).
type Lv = {y: number; n: number; e: number; kind: 'fill' | 'homo' | 'lumo' | 'empty'};
const STACK_A: Lv[] = [
  {y: 740, n: 1, e: 2, kind: 'fill'},
  {y: 662, n: 2, e: 4, kind: 'fill'},
  {y: 570, n: 1, e: 2, kind: 'homo'},
  {y: 400, n: 1, e: 0, kind: 'lumo'},
  {y: 318, n: 2, e: 0, kind: 'empty'},
  {y: 246, n: 1, e: 0, kind: 'empty'},
];
const STACK_B: Lv[] = [
  {y: 760, n: 2, e: 4, kind: 'fill'},
  {y: 640, n: 1, e: 2, kind: 'homo'},
  {y: 470, n: 1, e: 0, kind: 'lumo'},
  {y: 360, n: 2, e: 0, kind: 'empty'},
  {y: 270, n: 1, e: 0, kind: 'empty'},
];
const COL = {fill: C.cyan, homo: C.gold, lumo: C.mint, empty: C.red};
const W1 = 92;

const Stack: React.FC<{x: number; lv: Lv[]; t: number; opacity: number; dimOthers?: number; lumoY?: number; homoE?: number; lumoE?: number; litH?: number; litL?: number}> = ({
  x,
  lv,
  t,
  opacity,
  dimOthers = 0,
  lumoY,
  homoE,
  lumoE,
  litH = 0,
  litL = 0,
}) =>
  opacity <= 0.001 ? null : (
    <g opacity={opacity}>
      {lv.map((L, i) => {
        const front = L.kind === 'homo' || L.kind === 'lumo';
        const y = L.kind === 'lumo' && lumoY !== undefined ? lumoY : L.y;
        const e = L.kind === 'homo' && homoE !== undefined ? homoE : L.kind === 'lumo' && lumoE !== undefined ? lumoE : L.e;
        return (
          <MOLevel
            key={i}
            x={x}
            y={y}
            w={L.n === 2 ? 70 : W1}
            n={L.n}
            gap={22}
            color={COL[L.kind]}
            e={e}
            t={t + i * 0.3}
            opacity={front ? 1 : 1 - 0.6 * dimOthers}
            lit={L.kind === 'homo' ? litH : L.kind === 'lumo' ? litL : 0}
            spin={42}
            width={6}
          />
        );
      })}
    </g>
  );

export const Frontier: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);

  const inA = ramp(t, 0.2, 1.2);
  const homo = ramp(t, wordOf(0, 'HOMO') - 0.3, wordOf(0, 'HOMO') + 0.4);
  const lumo = ramp(t, wordOf(0, 'LUMO') - 0.3, wordOf(0, 'LUMO') + 0.4);
  const band = ramp(t, wordOf(1, 'perbatasan') - 0.4, wordOf(1, 'perbatasan') + 0.5) * (1 - ramp(t, cue(2) - 0.2, cue(2) + 0.6));
  const dim = ramp(t, wordOf(1, 'perbatasan') - 0.4, wordOf(1, 'perbatasan') + 0.5);
  // baris 2: dua molekul
  const split = ramp(t, cue(2) - 0.3, cue(2) + 1.0, EASE_IN_OUT);
  const back = ramp(t, cue(3) - 0.4, cue(3) + 0.8, EASE_IN_OUT);
  const inB = split * (1 - back);
  const flow = ramp(t, wordOf(2, 'mengalir') - 0.4, wordOf(2, 'LUMO') + 0.3);
  const flowOut = 1 - ramp(t, cue(3) - 0.6, cue(3), EASE_IN_OUT);
  // baris 3: cahaya
  const tPh = wordOf(3, 'cahaya');
  const photon = ramp(t, tPh - 0.8, wordOf(3, 'melompat') - 0.1, (x) => x);
  const jump = ramp(t, wordOf(3, 'melompat') - 0.2, wordOf(3, 'melompat') + 0.6, EASE_IN_OUT);
  const relax = 1 - ramp(t, wordOf(4, 'Nobel') - 1.4, wordOf(4, 'Nobel') - 0.3, EASE_IN_OUT);
  const gapIn = ramp(t, wordOf(3, 'Celah') - 0.4, wordOf(3, 'Celah') + 0.4);
  const spec = ramp(t, wordOf(3, 'warna') - 0.8, wordOf(3, 'warna') + 0.2);
  const sFormula = slot(t, wordOf(3, 'Celah') - 0.2, wordOf(4, 'Nobel') - 0.2);
  const nobel = ramp(t, wordOf(4, 'Nobel') - 0.2, wordOf(4, 'Nobel') + 0.6, BACK);
  const names = ramp(t, wordOf(4, 'Fukui') - 0.3, wordOf(4, 'Fukui') + 0.5);

  const xA = mix(mix(960, 600, split), 720, back);
  const xB = 1320;
  const homoA = STACK_A[2].y;
  // celah berosilasi pelan setelah "Celah" → warna berubah
  const osc = gapIn * Math.sin((t - wordOf(3, 'Celah')) * 0.9);
  const lumoY = mix(400, mix(400, 330, 0.5 + 0.5 * osc), gapIn);
  const gapPx = homoA - lumoY; // 170 … 240
  const nm = mix(660, 430, (gapPx - 170) / 70);
  const phCol = wlColor(nm);
  const jumpOn = jump * relax;

  // aliran HOMO A → LUMO B
  const p0: [number, number] = [xA + W1 / 2 + 16, homoA];
  const p2: [number, number] = [xB - W1 / 2 - 16, STACK_B[2].y];
  const pc: [number, number] = [(p0[0] + p2[0]) / 2, Math.min(p0[1], p2[1]) - 190];
  const bez = (u: number): [number, number] => [
    (1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * pc[0] + u * u * p2[0],
    (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * pc[1] + u * u * p2[1],
  ];
  const flowD = `M${p0[0]},${p0[1]} Q${pc[0]},${pc[1]} ${p2[0]},${p2[1]}`;

  // elektron yang melompat (↑ dari HOMO ke LUMO)
  const hx = levelXs(xA, 1, W1, 22)[0];
  const ex = hx + 42 * 0.22;
  const ey = mix(homoA, lumoY, jumpOn);

  // spektrum
  const SX = 1180;
  const SW = 560;
  const SY = 480;
  const nmX = (v: number) => SX + ((v - 400) / 300) * SW;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={xA} y={homoA} r={170} color="gold" opacity={homo * (0.18 + 0.1 * pulse)} />
        <Glow x={xA} y={lumoY} r={170} color="mint" opacity={lumo * (0.16 + 0.1 * pulse)} />
        {/* pita orbital perbatasan */}
        <g opacity={band}>
          <rect x={xA - 260} y={lumoY - 46} width={520} height={homoA - lumoY + 92} rx={22} fill="rgba(255,194,74,0.07)" stroke={C.gold} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="8 8" strokeDashoffset={-t * 16} />
          <Label2 x={xA - 250} y={lumoY - 70} size={24} color={C.gold} anchor="start">
            orbital perbatasan
          </Label2>
        </g>
        <Stack
          x={xA}
          lv={STACK_A}
          t={t}
          opacity={inA}
          dimOthers={dim}
          lumoY={lumoY}
          homoE={2 - jumpOn}
          lumoE={0}
          litH={homo}
          litL={lumo}
        />
        {/* elektron melompat */}
        {jumpOn > 0.001 ? <Spin x={ex} y={ey} up={false} len={42} width={5} opacity={Math.min(1, jumpOn * 4)} /> : null}
        <g opacity={inA * (1 - split * (1 - back))}>
          <Label2 x={xA + 80} y={homoA} anchor="start" size={30} weight={800} color={C.gold} opacity={homo}>
            HOMO
          </Label2>
          <Label2 x={xA + 80} y={homoA + 34} anchor="start" size={20} color={C.muted} opacity={homo}>
            terisi tertinggi
          </Label2>
          <Label2 x={xA + 80} y={lumoY} anchor="start" size={30} weight={800} color={C.mint} opacity={lumo}>
            LUMO
          </Label2>
          <Label2 x={xA + 80} y={lumoY + 34} anchor="start" size={20} color={C.muted} opacity={lumo}>
            kosong terendah
          </Label2>
        </g>
        {/* molekul B + aliran */}
        <Stack x={xB} lv={STACK_B} t={t + 2} opacity={inB} litH={0} litL={flow * pulse} dimOthers={0.4} />
        <g opacity={inB}>
          <Label2 x={xA} y={820} size={26} color={C.ink}>
            molekul A
          </Label2>
          <Label2 x={xB} y={820} size={26} color={C.ink}>
            molekul B
          </Label2>
          <Label2 x={xA - 74} y={homoA} anchor="end" size={24} weight={700} color={C.gold}>
            HOMO
          </Label2>
          <Label2 x={xB + 74} y={STACK_B[2].y} anchor="start" size={24} weight={700} color={C.mint}>
            LUMO
          </Label2>
        </g>
        <g opacity={flow * flowOut}>
          <DrawPath d={flowD} p={flow} stroke={C.gold} width={5} len={1400} />
          {[0, 1, 2].map((k) => {
            const ph = (t * 0.45 + k / 3) % 1;
            const [bx, by] = bez(ph);
            return <Electron key={k} x={bx} y={by} r={9} opacity={cyc(ph) * flow} />;
          })}
          <path d={`M${p2[0]},${p2[1]} l-22,-16 l4,20 Z`} fill={C.gold} opacity={flow} />
          <Label2 x={pc[0]} y={pc[1] + 60} size={24} color={C.gold}>
            aliran elektron saat bereaksi
          </Label2>
        </g>
        {/* foton */}
        <PhotonPacket x={mix(120, xA - 140, photon)} y={mix(homoA, (homoA + lumoY) / 2, photon)} wavelength={18 + 30 * ((nm - 430) / 230)} color={phCol} len={200} opacity={Math.min(1, photon * 5) * (1 - ramp(t, wordOf(3, 'melompat'), wordOf(3, 'melompat') + 0.5))} phase={-t * 18} />
        {/* celah ΔE */}
        <g opacity={gapIn * relax}>
          <line x1={xA - 120} y1={homoA - 6} x2={xA - 120} y2={lumoY + 6} stroke={phCol} strokeWidth={4} markerStart="url(#arrow-ink)" markerEnd="url(#arrow-ink)" />
          <Label2 x={xA - 140} y={(homoA + lumoY) / 2} anchor="end" size={34} font="serif" color={phCol}>
            ΔE
          </Label2>
        </g>
        {/* spektrum tampak */}
        <g opacity={spec * relax}>
          <rect x={SX} y={SY - 26} width={SW} height={52} rx={10} fill="url(#rainbow-h)" opacity={0.9} />
          <rect x={SX} y={SY - 26} width={SW} height={52} rx={10} fill="none" stroke={C.faint} strokeWidth={2} />
          {[400, 500, 600, 700].map((v) => (
            <Label2 key={v} x={nmX(v)} y={SY + 50} size={20} font="mono" color={C.muted}>
              {`${v}`}
            </Label2>
          ))}
          <Label2 x={SX + SW / 2} y={SY + 84} size={20} color={C.muted}>
            panjang gelombang (nm)
          </Label2>
          <g transform={`translate(${nmX(nm)} 0)`}>
            <path d={`M0,${SY - 34} l-14,-24 l28,0 Z`} fill={phCol} stroke="#fff" strokeWidth={2} />
            <line x1={0} y1={SY - 30} x2={0} y2={SY + 30} stroke="#fff" strokeWidth={3} />
            <Label2 x={0} y={SY - 84} size={26} font="mono" color={phCol}>
              {`${Math.round(nm)} nm`}
            </Label2>
          </g>
          <Label2 x={SX + SW / 2} y={SY - 140} size={24} color={C.ink}>
            warna yang diserap
          </Label2>
        </g>
      </Stage>
      <Formula x={1460} y={720} p={sFormula} accent={C.mint} size={58} caption="celah besar → biru · celah kecil → merah">
        Δ<V>E</V> = <Frac n={<><V>h</V><V>c</V></>} d={<V>λ</V>} />
      </Formula>
      <Card x={1360} y={560} opacity={nobel} scale={(0.9 + 0.1 * nobel) * 1.25} accent={C.gold} style={{padding: '22px 34px', display: 'flex', alignItems: 'center', gap: 24}}>
        <svg width={86} height={86} viewBox="0 0 86 86">
          <circle cx={43} cy={43} r={38} fill={C.gold} opacity={0.9} />
          <circle cx={43} cy={43} r={30} fill="none" stroke="#7a4e08" strokeWidth={3} />
          <text x={43} y={50} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={20} fill="#5a3a06">
            1981
          </text>
        </svg>
        <div>
          <div style={{fontSize: 36, fontWeight: 700, color: C.gold}}>Nobel Kimia 1981</div>
          <div style={{fontSize: 28, color: C.ink, opacity: names, marginTop: 4}}>Kenichi Fukui &amp; Roald Hoffmann</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
