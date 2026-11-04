import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Atom, Badge, Bond, Card, Formula, Frac, Glow, Label, Stage, Sub} from '../components/primitives';
import {Check, EAxis, MODiagram, XMark, moLab, type MOElec, type MOGeo, type MOLevel} from '../components/moB';
import {RichLabel, Spin} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab: aturan pengisian → H₂ (σ1s², orde 1) → He₂ (σ1s² σ*1s², orde 0) → helium tetap atom tunggal.
const G: MOGeo = {cx: 620, D: 310, lw: 170, aw: 120, fs: 34, spin: 44, sp: 14};
const FX = 1400;
const MY = 640;

const bump = (t: number, a: number, w = 1.6) => ramp(t, a - 0.2, a + 0.3) * (1 - ramp(t, a + w, a + w + 0.6, EASE_IN_OUT));

export const H2: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // ---- baris 0: tiga aturan ----
  const early = (i: number, a: number) => Math.min(a - 0.5, cue(0) + 0.4 + i * 0.35);
  const r1 = ramp(t, early(0, wordOf(0, 'terendah')), early(0, wordOf(0, 'terendah')) + 0.8, BACK);
  const r2 = ramp(t, early(1, wordOf(0, 'dua')), early(1, wordOf(0, 'dua')) + 0.8, BACK);
  const r3 = ramp(t, early(2, wordOf(0, 'berlawanan')), early(2, wordOf(0, 'berlawanan')) + 0.8, BACK);
  const hi = (a: number) => 0.55 + 0.45 * ramp(t, a - 0.4, a + 0.3);
  const iconsOut = ramp(t, cue(1) - 0.6, cue(1) + 0.1, EASE_IN_OUT);
  const pills = ramp(t, cue(1) - 0.1, cue(1) + 0.6);

  // ---- diagram ----
  const dia = ramp(t, cue(1) - 0.2, cue(1) + 0.9);
  const ao = ramp(t, cue(1) + 0.1, cue(1) + 0.8);
  const moP = ramp(t, cue(1) + 0.4, cue(1) + 1.3);
  const lk = ramp(t, cue(1) + 0.6, cue(1) + 1.6);
  const eIn = ramp(t, wordOf(1, 'elektron') - 0.3, wordOf(1, 'elektron') + 0.3);
  const go1 = ramp(t, wordOf(1, 'Keduanya') - 0.1, wordOf(1, 'Keduanya') + 1.0, EASE_IN_OUT);
  const go2 = ramp(t, wordOf(1, 'Keduanya') + 0.3, wordOf(1, 'Keduanya') + 1.4, EASE_IN_OUT);
  const stab = ramp(t, wordOf(1, 'stabil') - 0.3, wordOf(1, 'stabil') + 0.5);
  const toHe = ramp(t, cue(4) - 0.5, cue(4) + 0.5, EASE_IN_OUT);

  const litB = bump(t, wordOf(2, 'ikatan', 2), 1.2) + 0.6 * stab * (1 - toHe);
  const litA = bump(t, wordOf(2, 'antiikatan'), 1.2);

  const levels = (atom: string, lb: number, la: number): MOLevel[] => ([
    {id: 'aL', kind: 'ao', side: 'L', y: 520, p: ao, label: [['1s']]},
    {id: 'aR', kind: 'ao', side: 'R', y: 520, p: ao, label: [['1s']]},
    {id: 's', kind: 'sg', y: 670, p: moP, lit: lb, label: moLab('σ', '1s')},
    {id: 'ss', kind: 'sgs', y: 350, p: moP, lit: la, label: moLab('σ', '1s', true)},
  ] as MOLevel[]).map((l) => ({...l, id: l.id + atom}));
  const links = (a: string) => [
    {a: 'aL' + a, b: 's' + a, p: lk},
    {a: 'aL' + a, b: 'ss' + a, p: lk},
    {a: 'aR' + a, b: 's' + a, p: lk},
    {a: 'aR' + a, b: 'ss' + a, p: lk},
  ];
  const eH: MOElec[] = [
    {at: 'sH', up: true, p: go1, src: 'aLH', o: eIn},
    {at: 'sH', up: false, p: go2, src: 'aRH', o: eIn},
  ];
  // He₂
  const heIn = ramp(t, cue(4) + 0.1, wordOf(4, 'empat') + 0.4);
  const gB = ramp(t, wordOf(4, 'ikatan', 0) - 0.3, wordOf(4, 'ikatan', 0) + 0.8, EASE_IN_OUT);
  const gA = ramp(t, wordOf(4, 'antiikatan') - 0.3, wordOf(4, 'antiikatan') + 0.8, EASE_IN_OUT);
  const eHe: MOElec[] = [
    {at: 'sHe', up: true, p: gB, src: 'aLHe', o: heIn},
    {at: 'sHe', up: false, p: gB, src: 'aRHe', o: heIn},
    {at: 'ssHe', up: true, p: gA, src: 'aRHe', o: heIn},
    {at: 'ssHe', up: false, p: gA, src: 'aLHe', o: heIn},
  ];
  const zero = ramp(t, wordOf(4, 'nol') - 0.3, wordOf(4, 'nol') + 0.5);
  const heLitB = bump(t, wordOf(4, 'ikatan', 0), 1.2);
  const heLitA = bump(t, wordOf(4, 'antiikatan'), 1.2) + 0.7 * zero;

  // ---- kartu rumus ----
  const sGen = slot(t, wordOf(2, 'orde') - 0.3, cue(3));
  const genN = ramp(t, wordOf(2, 'elektron', 0) - 0.2, wordOf(2, 'elektron', 0) + 0.4);
  const genA = ramp(t, wordOf(2, 'antiikatan') - 0.2, wordOf(2, 'antiikatan') + 0.4);
  const genD = ramp(t, wordOf(2, 'dibagi') - 0.2, wordOf(2, 'dibagi') + 0.4);
  const sH = slot(t, cue(3) - 0.1, cue(4));
  const hNol = ramp(t, wordOf(3, 'nol') - 0.2, wordOf(3, 'nol') + 0.4);
  const hOne = ramp(t, wordOf(3, 'satu') - 0.2, wordOf(3, 'satu') + 0.4);
  const sHe = slot(t, wordOf(4, 'ikatan', 0) - 0.2, cue(5));
  const heTwo = ramp(t, wordOf(4, 'antiikatan') - 0.1, wordOf(4, 'antiikatan') + 0.5);
  const sAtom = slot(t, wordOf(5, 'atom') - 0.3, dur + 2);

  // ---- molekul di kanan bawah ----
  const hMol = ramp(t, wordOf(1, 'stabil') - 0.6, wordOf(1, 'stabil') + 0.4, BACK) * (1 - toHe);
  const single = ramp(t, wordOf(3, 'tunggal') - 0.3, wordOf(3, 'tunggal') + 0.5);
  const heMol = ramp(t, cue(4) + 0.2, cue(4) + 1.0, BACK);
  const apart = ramp(t, wordOf(5, 'atom') - 1.2, wordOf(5, 'atom') + 1.2, EASE_IN_OUT);
  const bob = 4 * Math.sin(t * 1.4);
  const vib = 6 * Math.sin(t * 5.2);
  const heSep = mix(100, 250, apart) + (1 - apart) * 5 * Math.sin(t * 3.1) + apart * 6 * Math.sin(t * 1.3);

  const IX = [480, 960, 1440];
  const iconOp = (r: number) => r * (1 - iconsOut);
  const fall = (a: number) => ramp(t, a, a + 0.7, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* ---------- tiga ikon aturan ---------- */}
        {[r1, r2, r3].map((r, i) => (
          <g key={i} opacity={iconOp(r)} transform={`translate(${IX[i]} ${470 + (1 - r) * 30})`}>
            <rect x={-190} y={-200} width={380} height={380} rx={26} fill="rgba(14,20,44,0.75)" stroke={C.faint} strokeWidth={2} />
            <circle cx={-150} cy={-160} r={22} fill="none" stroke={C.gold} strokeWidth={3} />
            <Label x={-150} y={-160} size={24} color={C.gold} weight={700}>
              {String(i + 1)}
            </Label>
          </g>
        ))}
        {/* ikon 1: dari energi terendah */}
        <g opacity={iconOp(r1) * hi(wordOf(0, 'terendah'))} transform={`translate(${IX[0]} 470)`}>
          <EAxis x={-120} y0={90} y1={-120} />
          {[60, -10, -80].map((y, k) => (
            <line key={k} x1={-60} y1={y} x2={90} y2={y} stroke={k === 0 ? C.cyan : C.muted} strokeWidth={5} strokeLinecap="round" strokeOpacity={k === 0 ? 1 : 0.5} />
          ))}
          <g opacity={Math.min(1, fall(wordOf(0, 'terendah')) * 3)}>
            <Spin x={3} y={60 - (1 - fall(wordOf(0, 'terendah'))) * 140 + 2 * Math.sin(t * 3)} up len={42} />
          </g>
          <g opacity={Math.min(1, fall(wordOf(0, 'terendah') + 0.5) * 3)}>
            <Spin x={27} y={60 - (1 - fall(wordOf(0, 'terendah') + 0.5)) * 140 - 2 * Math.sin(t * 3)} up={false} len={42} />
          </g>
          <Label x={15} y={128} size={28} color={C.ink}>
            energi terendah dulu
          </Label>
        </g>
        {/* ikon 2: paling banyak dua */}
        <g opacity={iconOp(r2) * hi(wordOf(0, 'dua'))} transform={`translate(${IX[1]} 470)`}>
          <line x1={-80} y1={40} x2={80} y2={40} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
          <Spin x={-14} y={40 + 2 * Math.sin(t * 3)} up len={42} />
          <Spin x={14} y={40 - 2 * Math.sin(t * 3)} up={false} len={42} />
          <g opacity={ramp(t, wordOf(0, 'dua') - 0.1, wordOf(0, 'dua') + 0.4)}>
            <Spin x={0} y={-70 + 6 * Math.sin(t * 2.2)} up len={42} />
            <XMark x={0} y={-70} r={26} p={ramp(t, wordOf(0, 'dua') + 0.4, wordOf(0, 'dua') + 0.9)} />
          </g>
          <Label x={0} y={128} size={28} color={C.ink}>
            maks. 2 per orbital
          </Label>
        </g>
        {/* ikon 3: spin berlawanan */}
        <g opacity={iconOp(r3) * hi(wordOf(0, 'berlawanan'))} transform={`translate(${IX[2]} 470)`}>
          <line x1={-150} y1={40} x2={-30} y2={40} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
          <Spin x={-104} y={40 + 2 * Math.sin(t * 3)} up len={42} />
          <Spin x={-76} y={40 - 2 * Math.sin(t * 3)} up={false} len={42} />
          <Check x={-90} y={-50} p={ramp(t, wordOf(0, 'berlawanan') + 0.1, wordOf(0, 'berlawanan') + 0.6)} />
          <line x1={30} y1={40} x2={150} y2={40} stroke={C.muted} strokeWidth={5} strokeLinecap="round" />
          <Spin x={76} y={40 + 2 * Math.sin(t * 3 + 1)} up len={42} />
          <Spin x={104} y={40 + 2 * Math.sin(t * 3 + 1)} up len={42} />
          <XMark x={90} y={-50} p={ramp(t, wordOf(0, 'berlawanan') + 0.4, wordOf(0, 'berlawanan') + 0.9)} />
          <Label x={0} y={128} size={28} color={C.ink}>
            spin berlawanan
          </Label>
        </g>

        {/* ---------- diagram H₂ / He₂ ---------- */}
        <g opacity={dia}>
          <EAxis x={190} y0={800} y1={300} />
          <Glow x={G.cx} y={670} r={200} color="cyan" opacity={0.25 * stab * (1 - toHe)} />
          <MODiagram g={G} t={t} levels={levels('H', litB, litA)} links={links('H')} elec={eH} opacity={1 - toHe} />
          <MODiagram g={G} t={t} levels={levels('He', heLitB, heLitA)} links={links('He')} elec={eHe} opacity={toHe} />
          {/* nama atom di bawah kolom */}
          {[
            {x: G.cx - G.D, h: [['H']] as [string, ('sub' | 'sup')?][], he: [['He']] as [string, ('sub' | 'sup')?][]},
            {x: G.cx, h: [['H'], ['2', 'sub']] as [string, ('sub' | 'sup')?][], he: [['He'], ['2', 'sub']] as [string, ('sub' | 'sup')?][]},
            {x: G.cx + G.D, h: [['H']] as [string, ('sub' | 'sup')?][], he: [['He']] as [string, ('sub' | 'sup')?][]},
          ].map((a, i) => (
            <g key={i}>
              <RichLabel x={a.x} y={i === 1 ? 790 : 640} parts={a.h} size={34} color={C.ink} opacity={ao * (1 - toHe)} />
              <RichLabel x={a.x} y={i === 1 ? 790 : 640} parts={a.he} size={34} color={C.ink} opacity={toHe} />
            </g>
          ))}
          <Label x={G.cx + 150} y={720} size={26} color={C.cyan} anchor="start" opacity={stab * (1 - toHe)} weight={600}>
            energi turun → stabil
          </Label>
        </g>

        {/* ---------- molekul kanan ---------- */}
        <g opacity={hMol} transform={`translate(0 ${bob})`}>
          <Glow x={FX} y={MY} r={190} color="cyan" opacity={0.25} />
          <Bond x1={FX - 55 - vib / 2} y1={MY} x2={FX + 55 + vib / 2} y2={MY} width={12} opacity={0.35 + 0.65 * single} color={C.cyan} />
          <Atom x={FX - 55 - vib / 2} y={MY} el="H" r={38} />
          <Atom x={FX + 55 + vib / 2} y={MY} el="H" r={38} />
          <Label x={FX} y={MY + 82} size={28} color={C.cyan} opacity={single} weight={600}>
            ikatan tunggal H–H
          </Label>
        </g>
        <g opacity={heMol} transform={`translate(0 ${bob})`}>
          <line x1={FX - heSep / 2} y1={MY} x2={FX + heSep / 2} y2={MY} stroke={C.muted} strokeWidth={4} strokeDasharray="8 8" opacity={(1 - zero) * 0.8} />
          <Atom x={FX - heSep / 2} y={MY} el="He" r={44} label="He" />
          <Atom x={FX + heSep / 2} y={MY} el="He" r={44} label="He" />
          <Label x={FX} y={MY - 80} size={40} color={C.red} weight={700} opacity={(1 - apart) * ramp(t, cue(4) + 0.8, cue(4) + 1.4)}>
            ?
          </Label>
          <Label x={FX} y={MY + 92} size={28} color={C.muted} opacity={apart}>
            dua atom He terpisah
          </Label>
        </g>
      </Stage>

      {/* pil aturan (pengingat) */}
      {[
        {x: 760, s: '① energi terendah'},
        {x: 1110, s: '② maks. 2'},
        {x: 1420, s: '③ spin ↑↓'},
      ].map((b, i) => (
        <Badge key={i} x={b.x} y={210} text={b.s} color={C.gold} opacity={pills * 0.85} scale={0.85} />
      ))}

      <Formula x={FX} y={380} p={sGen} accent={C.gold} size={56} caption="orde ikatan">
        <span style={{fontFamily: FONT.sans, fontSize: '0.62em', color: C.ink}}>orde = </span>
        <Frac
          n={
            <>
              <span style={{opacity: 0.25 + 0.75 * genN, color: C.cyan}}>
                n<Sub>ikatan</Sub>
              </span>
              <span style={{opacity: 0.25 + 0.75 * genA}}>
                {' '}− <span style={{color: C.red}}>n<Sub>antiikatan</Sub></span>
              </span>
            </>
          }
          d={<span style={{opacity: 0.25 + 0.75 * genD}}>2</span>}
        />
      </Formula>
      <Formula x={FX} y={380} p={sH} accent={C.cyan} size={60}>
        <span style={{fontFamily: FONT.sans, fontSize: '0.6em'}}>
          H<Sub>2</Sub>:{' '}
        </span>
        <Frac
          n={
            <>
              <span style={{color: C.cyan}}>2</span> − <span style={{color: C.red, opacity: 0.3 + 0.7 * hNol}}>0</span>
            </>
          }
          d="2"
        />
        <span style={{opacity: hOne}}>
          {' '}= <b style={{color: C.gold}}>1</b>
        </span>
      </Formula>
      <Formula x={FX} y={380} p={sHe} accent={C.red} size={60}>
        <span style={{fontFamily: FONT.sans, fontSize: '0.6em'}}>
          He<Sub>2</Sub>:{' '}
        </span>
        <Frac
          n={
            <>
              <span style={{color: C.cyan}}>2</span> − <span style={{color: C.red, opacity: 0.25 + 0.75 * heTwo}}>2</span>
            </>
          }
          d="2"
        />
        <span style={{opacity: zero}}>
          {' '}= <b style={{color: C.red}}>0</b>
        </span>
      </Formula>
      <Card x={FX} y={380} opacity={sAtom} accent={C.mint} style={{padding: '20px 34px'}}>
        <div style={{fontSize: 40, textAlign: 'center'}}>
          helium tetap <span style={{color: C.mint}}>atom tunggal</span>
        </div>
        <div style={{fontSize: 24, color: C.muted, textAlign: 'center', marginTop: 6}}>orde 0 → tidak ada ikatan kovalen</div>
      </Card>
    </AbsoluteFill>
  );
};
