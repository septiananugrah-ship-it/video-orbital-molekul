import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, ramp, rand, slot} from '../anim';
import {Atom, Badge, Card, Formula, Frac, Glow, Label, Stage, Sub} from '../components/primitives';
import {EAxis, MODiagram, Odometer, XMark, moLab, type MOElec, type MOGeo, type MOLevel} from '../components/moB';
import {Stamp} from '../components/grupD';
import {HORSESHOE, Horseshoe, Spin} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Klimaks: diagram MO O₂ — 12 elektron valensi, dua terakhir masuk π* terpisah dengan spin sejajar (Hund) → paramagnetik, triplet; orde (8−4)/2 = 2.
const G: MOGeo = {cx: 760, D: 390, lw: 120, aw: 56, gap: 30, agap: 12, fs: 30, spin: 38, sp: 12, drop: 100};
const RX = 1560;
const LOX = '#bfe4ff';
const MAG_TOP = 340;
const MAG_S = 0.55;

const bump = (t: number, a: number, w = 1.6) => ramp(t, a - 0.2, a + 0.3) * (1 - ramp(t, a + w, a + w + 0.6, EASE_IN_OUT));

export const Oxygen: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  const dia = ramp(t, 0.1, 1.2);
  const lk = ramp(t, 0.6, 1.8);
  const tEnam = wordOf(0, 'enam');
  // elektron atom: 2s² 2p⁴ tiap O, muncul bergiliran lalu meredup saat MO diisi
  const aoFade = 1 - 0.8 * ramp(t, cue(1) - 0.3, cue(1) + 1.0, EASE_IN_OUT);
  const aoE = (i: number) => ramp(t, tEnam - 0.4 + i * 0.09, tEnam + 0.1 + i * 0.09) * aoFade;
  const aoList: {at: string; k: number; up: boolean}[] = [];
  for (const s of ['L', 'R']) {
    aoList.push({at: 's' + s, k: 0, up: true}, {at: 's' + s, k: 0, up: false});
    aoList.push({at: 'p' + s, k: 0, up: true}, {at: 'p' + s, k: 1, up: true}, {at: 'p' + s, k: 2, up: true}, {at: 'p' + s, k: 0, up: false});
  }
  const aoElec: MOElec[] = aoList.map((e, i) => ({...e, p: 1, o: aoE(i)}));

  // 12 elektron MO
  const w1 = (n: number) => wordOf(1, 'sigma', n);
  const tPi = wordOf(1, 'pi');
  const T = [w1(0) - 0.2, w1(0) + 0.25, wordOf(1, 'bintang') - 0.2, wordOf(1, 'bintang') + 0.25, w1(2) - 0.2, w1(2) + 0.25, tPi - 0.5, tPi - 0.15, tPi + 0.2, tPi + 0.55];
  const arr = (a: number) => ramp(t, a, a + 0.6, EASE_IN_OUT);
  const moSpec: {at: string; k: number; up: boolean}[] = [
    {at: 's2', k: 0, up: true},
    {at: 's2', k: 0, up: false},
    {at: 's2s', k: 0, up: true},
    {at: 's2s', k: 0, up: false},
    {at: 'sp', k: 0, up: true},
    {at: 'sp', k: 0, up: false},
    {at: 'pi', k: 0, up: true},
    {at: 'pi', k: 1, up: true},
    {at: 'pi', k: 0, up: false},
    {at: 'pi', k: 1, up: false},
  ];
  const tLast = wordOf(2, 'terakhir');
  const hover = (d: number) => 0.6 * ramp(t, tLast - 0.3 + d, tLast + 0.6 + d, EASE_IN_OUT) + 0.08 * Math.sin(t * 2.4 + d * 5) * ramp(t, tLast, tLast + 0.6);
  const tSej = wordOf(3, 'sejajar');
  const land = (d: number) => ramp(t, tSej - 0.5 + d, tSej + 0.3 + d, EASE_IN_OUT);
  const p11 = hover(0) * (1 - land(0)) + land(0);
  const p12 = hover(0.25) * (1 - land(0.2)) + land(0.2);
  const moElec: MOElec[] = [
    ...moSpec.map((e, i) => ({...e, p: arr(T[i])})),
    {at: 'pis', k: 0, up: true, p: p11},
    {at: 'pis', k: 1, up: true, p: p12},
  ];
  const count =
    T.reduce((s, a) => s + ramp(t, a + 0.25, a + 0.6), 0) + ramp(t, tLast - 0.2, tLast + 0.3) + ramp(t, tLast + 0.05, tLast + 0.55);

  // sorotan
  const unp = ramp(t, wordOf(3, 'tak') - 0.4, wordOf(3, 'tak') + 0.4);
  const hot = Math.max(land(0.2), unp) * (0.65 + 0.35 * Math.sin(t * 4));
  const tDel = wordOf(5, 'delapan');
  const tEmp = wordOf(5, 'empat');
  const bondLit = bump(t, tDel, 2.2);
  const antiLit = bump(t, tEmp, 2.2);
  const piLit = bump(t, tPi, 1.0);
  const lastLit = ramp(t, tLast - 0.3, tLast + 0.4) * (1 - land(0.2));

  const levels: MOLevel[] = ([
    {id: 'pL', kind: 'ao', side: 'L', n: 3, y: 410, label: [['2p']]},
    {id: 'pR', kind: 'ao', side: 'R', n: 3, y: 410, label: [['2p']]},
    {id: 'sL', kind: 'ao', side: 'L', y: 755, label: [['2s']]},
    {id: 'sR', kind: 'ao', side: 'R', y: 755, label: [['2s']]},
    {id: 'sps', kind: 'sgs', y: 205, label: moLab('σ', '2p', true)},
    {id: 'pis', kind: 'pis', n: 2, y: 325, lit: Math.min(1.3, hot + lastLit + antiLit), label: moLab('π', '2p', true)},
    {id: 'pi', kind: 'pi', n: 2, y: 482, lit: bondLit + piLit, label: moLab('π', '2p')},
    {id: 'sp', kind: 'sg', y: 590, lit: bondLit, label: moLab('σ', '2p')},
    {id: 's2s', kind: 'sgs', y: 690, lit: antiLit, label: moLab('σ', '2s', true)},
    {id: 's2', kind: 'sg', y: 825, lit: bondLit, label: moLab('σ', '2s')},
  ] as MOLevel[]).map((l) => ({...l, p: dia}));
  const links = [
    ...['sps', 'pis', 'pi', 'sp'].flatMap((b) => [
      {a: 'pL', b, p: lk},
      {a: 'pR', b, p: lk},
    ]),
    ...['s2s', 's2'].flatMap((b) => [
      {a: 'sL', b, p: lk},
      {a: 'sR', b, p: lk},
    ]),
  ];
  const pisX = [G.cx - (G.lw! + G.gap!) / 2, G.cx + (G.lw! + G.gap!) / 2];

  // hantu "salah": ↑↓ di satu π*
  const tHund = wordOf(3, 'Hund');
  const ghost = ramp(t, tHund - 0.3, tHund + 0.3) * (1 - ramp(t, wordOf(3, 'berbeda') - 0.2, wordOf(3, 'berbeda') + 0.4, EASE_IN_OUT));
  const ghostX = ramp(t, tHund + 0.3, tHund + 0.8);

  // kanan
  const s12 = slot(t, wordOf(0, 'belas') - 0.4, cue(1));
  const sCount = slot(t, cue(1) - 0.1, wordOf(3, 'tak') - 0.1);
  const sUnp = slot(t, wordOf(3, 'tak') - 0.1, cue(4));
  const para = ramp(t, wordOf(4, 'paramagnetik') - 0.3, wordOf(4, 'paramagnetik') + 0.5);
  const trip = ramp(t, wordOf(4, 'triplet') - 0.3, wordOf(4, 'triplet') + 0.4);
  const mag = ramp(t, wordOf(4, 'paramagnetik') - 0.6, wordOf(4, 'paramagnetik') + 0.6, BACK);
  const fill = ramp(t, wordOf(4, 'paramagnetik'), wordOf(4, 'paramagnetik') + 1.6, EASE_IN_OUT);
  const sOrde = slot(t, wordOf(5, 'Orde') - 0.3, dur + 2);
  const f8 = ramp(t, tDel - 0.2, tDel + 0.4);
  const f4 = ramp(t, tEmp - 0.2, tEmp + 0.4);
  const f2 = ramp(t, wordOf(5, 'sama') - 0.2, wordOf(5, 'sama') + 0.4);
  const rangkap = ramp(t, wordOf(5, 'rangkap') - 0.3, wordOf(5, 'rangkap') + 0.4);
  const ok = ramp(t, wordOf(5, 'magnetnya') - 0.4, wordOf(5, 'magnetnya') + 0.4, BACK);
  const arrowP = ramp(t, wordOf(3, 'tak'), wordOf(3, 'tak') + 0.8) * (1 - ramp(t, cue(4) - 0.4, cue(4), EASE_IN_OUT));

  const g = HORSESHOE(0, 0);
  const levelTop = g.gapBot - 74 * fill;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <EAxis x={150} y0={860} y1={230} opacity={dia} />
        {/* atom O di atas kolom */}
        {[-1, 1].map((s) => (
          <g key={s} opacity={dia}>
            <Atom x={G.cx + s * G.D} y={300 + 4 * Math.sin(t * 1.3 + s)} el="O" r={32} />
          </g>
        ))}
        {/* cahaya di dua π* */}
        {pisX.map((x, k) => (
          <Glow key={k} x={x} y={325} r={95} color="red" opacity={0.35 * hot} />
        ))}
        <MODiagram g={G} t={t} levels={levels} links={links} elec={[...aoElec, ...moElec]} />
        {/* hantu: dua elektron berpasangan di satu π* (dilarang Hund untuk keadaan dasar) */}
        <g opacity={ghost}>
          <g opacity={0.5}>
            <Spin x={pisX[0] - 12} y={325} up len={38} width={4} />
            <Spin x={pisX[0] + 12} y={325} up={false} len={38} width={4} />
          </g>
          <XMark x={pisX[0]} y={325} r={26} p={ghostX} />
        </g>
        {/* panah dari kartu ke π* */}
        {arrowP > 0.01 ? (
          <g opacity={arrowP}>
            <path d="M1350,262 Q1150,236 935,310" fill="none" stroke={C.pink} strokeWidth={4} strokeDasharray="600 600" strokeDashoffset={600 * (1 - arrowP)} pathLength={600} />
            <path d="M935,310 L960,290 L964,312 Z" fill={C.pink} opacity={ramp(arrowP, 0.8, 1)} />
          </g>
        ) : null}

        {/* magnet & oksigen cair (kecil, kaitan ke pembuka) */}
        <g opacity={mag} transform={`translate(${RX} ${MAG_TOP}) scale(${MAG_S})`}>
          <Glow x={0} y={37} r={150} color="cyan" opacity={0.4 * fill} />
          <Horseshoe cx={0} top={0} t={t} field={mag} />
          {fill > 0.01 ? (
            <g>
              <rect x={g.gapL} y={levelTop} width={g.gapR - g.gapL} height={g.gapBot - levelTop} fill={LOX} opacity={0.85} />
              <ellipse cx={0} cy={g.gapBot} rx={(g.gapR - g.gapL) / 2} ry={10 * fill + 2 * Math.sin(t * 3)} fill={LOX} opacity={0.85} />
              {Array.from({length: 4}, (_, k) => {
                const ph = (((t * 0.6 + rand(k)) % 1) + 1) % 1;
                return <circle key={k} cx={g.gapL + 10 + rand(k * 3.3) * 32} cy={g.gapBot - ph * (g.gapBot - levelTop)} r={3} fill="#fff" opacity={0.6 * cyc(ph)} />;
              })}
            </g>
          ) : null}
        </g>
        <Label x={RX} y={MAG_TOP + 210} size={24} color={LOX} opacity={mag * fill}>
          oksigen cair menggantung
        </Label>
      </Stage>

      {/* kartu kanan atas (bergantian) */}
      <Card x={RX} y={250} opacity={s12} accent={C.cyan} style={{padding: '16px 30px'}}>
        <div style={{fontSize: 46, textAlign: 'center', fontFamily: FONT.serif}}>
          6 + 6 = <b style={{color: C.cyan}}>12</b>
        </div>
        <div style={{fontSize: 24, color: C.muted, textAlign: 'center'}}>elektron valensi O<Sub>2</Sub></div>
      </Card>
      <Card x={RX} y={250} opacity={sCount} accent={C.cyan} style={{padding: '14px 30px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: FONT.mono}}>
          <Odometer v={count} color={C.cyan} size={62} />
          <span style={{fontSize: 40, color: C.muted}}>/ 12</span>
        </div>
        <div style={{fontSize: 24, color: C.muted, textAlign: 'center'}}>elektron terisi</div>
      </Card>
      <Card x={RX} y={250} opacity={sUnp} accent={C.pink} style={{padding: '16px 30px'}}>
        <div style={{fontSize: 34, textAlign: 'center'}}>
          <span style={{color: C.pink, fontWeight: 700}}>2</span> elektron tak berpasangan
        </div>
        <div style={{fontSize: 24, color: C.muted, textAlign: 'center'}}>
          spin sejajar · aturan Hund
        </div>
      </Card>
      <Stamp
        x={RX}
        y={232}
        p={para}
        text="PARAMAGNETIK"
        color={C.violet}
        size={44}
        rot={-5}
        sub={<span style={{opacity: trip}}>· triplet ·</span>}
      />
      <Formula x={RX} y={705} p={sOrde} size={56} accent={C.gold} caption={<span style={{opacity: rangkap}}>rangkap dua, sesuai Lewis</span>}>
        <span style={{fontFamily: FONT.sans, fontSize: '0.55em'}}>orde = </span>
        <Frac
          n={
            <>
              <span style={{color: C.cyan, opacity: 0.25 + 0.75 * f8}}>8</span> − <span style={{color: C.red, opacity: 0.25 + 0.75 * f4}}>4</span>
            </>
          }
          d="2"
        />
        <span style={{opacity: f2}}>
          {' '}= <b style={{color: C.gold}}>2</b>
        </span>
      </Formula>
      <Badge x={RX} y={852} text="✓ magnetnya terjelaskan" color={C.mint} opacity={ok} scale={0.6 + 0.4 * ok} />
    </AbsoluteFill>
  );
};
