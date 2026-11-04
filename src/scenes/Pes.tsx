import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, rand, ramp, slot} from '../anim';
import {Badge, DrawPath, Formula, Glow, Label, Stage, Sub, V} from '../components/primitives';
import {Diatomic, MOStack, N2_MO, flowPt, pesPath, pesSignal} from '../components/moD';
import {RichLabel} from '../components/vbD';
import {Electron, PhotonPacket} from '../components/viz';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 12: spektroskopi fotoelektron N₂ — alat skematis, IE = hν − E_kin, spektrum tergambar, panah ke tingkat MO.
const BOX = {x: 160, y: 860, w: 970, h: 250, e0: 14.5, e1: 20};
const ex = (E: number) => BOX.x + ((E - BOX.e0) / (BOX.e1 - BOX.e0)) * BOX.w;
const MOX = 1530;
const MOY = 830;
const MOS = 0.95;
const lvY = (i: number) => MOY - N2_MO[i].dy * MOS;

// kelompok puncak: rentang E, indeks tingkat MO, warna, label angka
const GROUPS = [
  {e0: 15.3, e1: 16.1, peak: 15.58, lv: 3, col: C.cyan, txt: '15,6'},
  {e0: 16.5, e1: 17.8, peak: 16.87, lv: 2, col: C.amber, txt: '16,7'},
  {e0: 18.5, e1: 19.2, peak: 18.75, lv: 1, col: C.red, txt: '18,8'},
];

// analisis energi: setengah cincin
const AX = 1000;
const AY = 430;
const ePath: [number, number][] = [[705, 352], [AX - 160, AY], ...Array.from({length: 25}, (_, k) => {
  const th = Math.PI - (Math.PI * (k + 1)) / 25;
  return [AX + 160 * Math.cos(th), AY - 160 * Math.sin(th)] as [number, number];
}), [AX + 160, AY + 18]];

const areaOf = (e0: number, e1: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const E = e0 + ((e1 - e0) * i) / 120;
    pts.push(`${ex(E).toFixed(1)},${(BOX.y - pesSignal(E) * BOX.h).toFixed(1)}`);
  }
  return `M${ex(e0)},${BOX.y} L${pts.join(' L')} L${ex(e1)},${BOX.y} Z`;
};

export const Pes: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const intro = ramp(t, cue(0) - 0.6, cue(0) + 0.6);
  const app = ramp(t, wordOf(0, 'mengukurnya') - 0.8, wordOf(0, 'mengukurnya') + 0.6);
  const beam = ramp(t, wordOf(1, 'foton', 0) - 0.2, wordOf(1, 'foton', 0) + 0.6);
  const ejec = ramp(t, wordOf(1, 'melepaskan') - 0.2, wordOf(1, 'melepaskan') + 0.6);
  const kin = ramp(t, wordOf(2, 'kinetik') - 0.3, wordOf(2, 'kinetik') + 0.4);
  const fo = ramp(t, wordOf(2, 'Selisihnya') - 0.3, wordOf(2, 'Selisihnya') + 0.6, BACK);
  const spec = ramp(t, cue(2) - 0.4, cue(2) + 0.8);
  const eUpto = interpolate(
    t,
    [cue(3), wordOf(3, 'lima') + 0.4, wordOf(3, 'tujuh') + 0.4, wordOf(3, 'delapan', 0) + 0.5, cueEndSafe(cue, 4)],
    [14.5, 16.1, 17.9, 19.3, 20],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const nums = [wordOf(3, 'lima'), wordOf(3, 'tujuh'), wordOf(3, 'delapan', 0)].map((w) => ramp(t, w - 0.1, w + 0.5, BACK));
  const arr = [wordOf(4, 'sigma', 0), wordOf(4, 'pi'), wordOf(4, 'bintang')].map((w) => ramp(t, w - 0.2, w + 0.9));
  const swap = ramp(t, wordOf(4, 'tertukar') - 0.2, wordOf(4, 'tertukar') + 0.6);
  const seen = ramp(t, wordOf(4, 'tertukar') + 0.05, wordOf(4, 'tertukar') + 0.7, BACK);
  const l4 = ramp(t, cue(4) - 0.3, cue(4) + 0.5);
  const dimApp = 1 - 0.45 * ramp(t, cue(3) - 0.4, cue(3) + 0.6);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  const ask = slot(t, cue(0) + 0.3, wordOf(2, 'Selisihnya') - 0.4);

  // tingkat MO yang menyala sesuai panah
  const litOf = (i: number) => {
    const g = GROUPS.findIndex((G) => G.lv === i);
    return g >= 0 ? arr[g] * (0.75 + 0.25 * Math.sin(t * 3 + g)) : 0;
  };
  const opOf = (i: number) => {
    const g = GROUPS.findIndex((G) => G.lv === i);
    return (0.55 + 0.45 * intro) * (g >= 0 ? 1 - 0.3 * l4 + 0.3 * arr[g] : 1 - 0.55 * l4);
  };

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={MOX} y={620} r={420} color="cyan" opacity={0.08 + 0.04 * Math.sin(t * 0.8)} />
        <Glow x={640} y={360} r={420} color="violet" opacity={0.07 * app} />

        {/* ---------- alat spektroskopi fotoelektron ---------- */}
        <g opacity={app * dimApp}>
          {/* lampu UV He I */}
          <circle cx={240} cy={350} r={110} fill="url(#soft-violet)" opacity={0.35 + 0.15 * Math.sin(t * 5) * Math.sin(t * 1.7)} />
          <rect x={170} y={292} width={130} height={116} rx={22} fill="rgba(30,24,64,0.95)" stroke={C.violet} strokeWidth={3} />
          <ellipse cx={300} cy={350} rx={20} ry={38} fill="#cdbfff" opacity={0.55 + 0.25 * Math.sin(t * 6)} />
          <path d={`M195,330 q15,-20 30,0 t30,0 t30,0`} fill="none" stroke="#d8ccff" strokeWidth={3} opacity={0.8} />
          <Label x={235} y={445} size={24} color={C.violet} weight={600}>
            lampu UV · He I
          </Label>
          <Label x={235} y={478} size={26} color={C.gold} weight={700}>
            hν = 21,2 eV
          </Label>

          {/* foton UV */}
          {[0, 1, 2].map((k) => {
            const ph = (((t * 0.7 + k / 3) % 1) + 1) % 1;
            return <PhotonPacket key={k} x={320 + ph * 160} y={350} wavelength={16} color="#b9a4ff" amp={16} len={90} opacity={beam * cyc(ph)} phase={-t * 12} />;
          })}

          {/* sel gas N₂ */}
          <rect x={490} y={276} width={210} height={150} rx={18} fill="rgba(79,125,255,0.08)" stroke="#b9c8ff" strokeOpacity={0.6} strokeWidth={3} />
          {Array.from({length: 7}, (_, k) => {
            const x = 520 + rand(k * 3.3) * 150 + 10 * Math.sin(t * (0.8 + rand(k)) + k);
            const y = 300 + rand(k * 5.7) * 100 + 8 * Math.cos(t * (0.9 + rand(k * 2)) + k);
            return <Diatomic key={k} x={x} y={y} d={20} r={9} order={3} rot={t * 40 * (rand(k * 9) - 0.5) + k * 50} />;
          })}
          <RichLabel x={595} y={456} parts={[['gas N'], ['2', 'sub']]} size={26} color={C.blue} />

          {/* penganalisis energi (setengah cincin) */}
          <path
            d={`M${AX - 205},${AY} A205,205 0 0 1 ${AX + 205},${AY} L${AX + 115},${AY} A115,115 0 0 0 ${AX - 115},${AY} Z`}
            fill="rgba(20,28,56,0.75)"
            stroke="#9fb0d8"
            strokeOpacity={0.5}
            strokeWidth={2.5}
          />
          <path d={`M${AX - 160},${AY} A160,160 0 0 1 ${AX + 160},${AY}`} fill="none" stroke={C.cyan} strokeWidth={2} strokeDasharray="4 10" opacity={0.35 + 0.3 * ejec} />
          <Label x={AX} y={200} size={24} color={C.muted} weight={600}>
            penganalisis energi
          </Label>

          {/* elektron yang terlepas */}
          {Array.from({length: 6}, (_, k) => {
            const ph = (((t * 0.32 + k / 6) % 1) + 1) % 1;
            const [x, y] = flowPt(ph, ePath);
            return <Electron key={k} x={x} y={y} r={8} opacity={ejec * cyc(ph)} />;
          })}

          {/* detektor */}
          <rect x={AX + 112} y={AY + 16} width={96} height={56} rx={10} fill="rgba(14,20,44,0.95)" stroke={C.mint} strokeWidth={3} />
          {(() => {
            const flash = Math.max(...[0, 1, 2, 3, 4, 5].map((k) => {
              const ph = (((t * 0.32 + k / 6) % 1) + 1) % 1;
              return Math.max(0, 1 - Math.abs(ph - 0.97) * 30);
            }));
            return <rect x={AX + 120} y={AY + 24} width={80} height={40} rx={6} fill={C.mint} opacity={ejec * (0.12 + 0.6 * flash)} />;
          })()}
          <Label x={AX + 232} y={AY + 44} size={24} color={C.mint} weight={600} anchor="start">
            detektor
          </Label>
          <g opacity={kin}>
            <RichLabel x={AX + 232} y={AY + 84} parts={[['ukur '], ['E', undefined], ['kin', 'sub']]} size={26} color={C.mint} anchor="start" />
          </g>
        </g>

        {/* ---------- spektrum ---------- */}
        <g opacity={spec}>
          <line x1={BOX.x} y1={BOX.y} x2={BOX.x + BOX.w + 20} y2={BOX.y} stroke={C.muted} strokeWidth={3} />
          <line x1={BOX.x} y1={BOX.y} x2={BOX.x} y2={BOX.y - BOX.h - 30} stroke={C.muted} strokeWidth={3} />
          {[15, 16, 17, 18, 19, 20].map((E) => (
            <g key={E}>
              <line x1={ex(E)} y1={BOX.y} x2={ex(E)} y2={BOX.y + 10} stroke={C.muted} strokeWidth={2} />
              <Label x={ex(E)} y={BOX.y + 26} size={22} color={C.muted} font="mono">
                {E === 20 ? '20 eV' : String(E)}
              </Label>
            </g>
          ))}
          <g transform={`rotate(-90 ${BOX.x - 30} ${BOX.y - 130})`}>
            <Label x={BOX.x - 30} y={BOX.y - 130} size={20} color={C.muted}>
              jumlah elektron
            </Label>
          </g>
          <Label x={BOX.x + BOX.w + 34} y={BOX.y} size={24} color={C.muted} anchor="start" weight={600}>
            IE
          </Label>
          {/* isi warna per kelompok saat dipetakan ke MO */}
          {GROUPS.map((G, g) => (
            <path key={g} d={areaOf(G.e0, G.e1)} fill={G.col} opacity={0.32 * arr[g]} />
          ))}
          <path d={pesPath(BOX, eUpto)} fill="none" stroke={C.gold} strokeWidth={10} strokeOpacity={0.12} strokeLinejoin="round" />
          <path d={pesPath(BOX, eUpto)} fill="none" stroke={C.gold} strokeWidth={3.5} strokeLinejoin="round" />
          {/* kepala pena */}
          <circle cx={ex(eUpto)} cy={BOX.y - pesSignal(eUpto) * BOX.h} r={7} fill="#fff6d0" opacity={ramp(eUpto, 14.5, 14.7) * (1 - ramp(eUpto, 19.7, 20))} />
          {GROUPS.map((G, g) => {
            const top = BOX.y - pesSignal(G.peak) * BOX.h;
            return (
              <g key={g} opacity={nums[g]} transform={`translate(0 ${(1 - nums[g]) * 10})`}>
                <Label x={ex(G.peak)} y={top - 30} size={28} color={C.ink} weight={700} font="mono">
                  {G.txt}
                </Label>
              </g>
            );
          })}
          <g opacity={nums[1] * (1 - l4)}>
            <Label x={ex(17.1)} y={BOX.y - 0.62 * BOX.h - 72} size={20} color={C.amber}>
              pita getaran lebar
            </Label>
          </g>
        </g>

        {/* ---------- diagram MO N₂ ---------- */}
        <g opacity={intro}>
          <Label x={MOX} y={MOY + 44} size={26} color={C.blue} weight={700}>
            {'N₂ (valensi)'}
          </Label>
          <MOStack x={MOX} y={MOY} levels={N2_MO} scale={MOS} w={120} t={t} lit={litOf} opacity={opOf} />
          {/* label urutan tertukar */}
          <g opacity={swap}>
            <path
              d={`M${MOX - 92},${lvY(3)} C${MOX - 128},${lvY(3) + 10} ${MOX - 128},${lvY(2) - 10} ${MOX - 92},${lvY(2)}`}
              fill="none"
              stroke={C.gold}
              strokeWidth={3}
              strokeDasharray="5 5"
              strokeDashoffset={-t * 20}
            />
          </g>
        </g>

        {/* panah puncak → tingkat MO */}
        {GROUPS.map((G, g) => {
          const px = ex(G.peak);
          const py = BOX.y - pesSignal(G.peak) * BOX.h - 52;
          const lx = MOX - 72;
          const ly = lvY(G.lv);
          const cx = (px + lx) / 2 + 40;
          const cy = Math.min(py, ly) - 120 + g * 40;
          const d = `M${px},${py} Q${cx},${cy} ${lx},${ly}`;
          const end = arr[g];
          return (
            <g key={g} opacity={l4}>
              <DrawPath d={d} p={end} stroke={G.col} width={4} />
              <circle cx={lx} cy={ly} r={8 + 4 * Math.sin(t * 4 + g)} fill={G.col} opacity={ramp(end, 0.9, 1) * 0.9} />
            </g>
          );
        })}
      </Stage>

      <Badge x={MOX} y={300} text="nyata, atau alat hitung?" color={C.violet} opacity={ask} scale={0.92 + 0.08 * ask} />
      <Formula
        x={MOX}
        y={300}
        p={Math.min(fo, 1 - ramp(t, wordOf(4, 'tertukar') - 0.4, wordOf(4, 'tertukar'), EASE_IN_OUT))}
        accent={C.mint}
        caption="energi ionisasi = energi foton − energi kinetik"
      >
        <span style={{fontFamily: FONT.sans, fontWeight: 600}}>IE</span> = <V>h</V>
        <V>ν</V> − <V>E</V>
        <Sub>kin</Sub>
      </Formula>
      <Badge x={MOX} y={300} text="urutan tertukar — terlihat langsung" color={C.gold} opacity={seen} scale={0.85 + 0.15 * seen} icon="✓" />
    </AbsoluteFill>
  );
};

// batas akhir baris (aman untuk interpolate: harus naik monoton)
function cueEndSafe(cue: (i: number) => number, i: number) {
  return cue(i) + 0.5;
}
