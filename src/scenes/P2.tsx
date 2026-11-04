import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Card, Glow, Label, Stage} from '../components/primitives';
import {MODiagram, moLab, type MOGeo, type MOLevel} from '../components/moB';
import {OrbShape, OverlapGlow, type Orb} from '../components/vbB';
import {RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Orbital dari 2p: sumbu z = sumbu ikatan; p_z ujung-ke-ujung → σ/σ*; p_x, p_y dari samping → π/π* (×2); 8 AO → 8 MO.
const DX = 560; // pusat gambar kiri
const ROW = [370, 640];
const L = 120;

const bump = (t: number, a: number, w = 1.4) => ramp(t, a - 0.2, a + 0.3) * (1 - ramp(t, a + w, a + w + 0.6, EASE_IN_OUT));

/** Satu baris gambar kombinasi: dua orbital p + irisan menyala (sefase) atau simpul (beda fase). */
const Pair: React.FC<{y: number; t: number; mode: 'sigma' | 'pi'; anti: boolean; sep: number; opacity: number; node?: number; tag: [string, ('sub' | 'sup')?][]; tagColor: string; below?: boolean}> = ({
  y,
  t,
  mode,
  anti,
  sep,
  opacity,
  node = 0,
  tag,
  tagColor,
  below,
}) => {
  if (opacity <= 0.001) return null;
  const ang = mode === 'sigma' ? 0 : -Math.PI / 2;
  const A: Orb = {kind: 'p', x: DX - sep / 2, y, ang, size: L};
  // sefase: lobus dalam berwarna sama (σ: B dibalik; π: B sama)
  const flipB = mode === 'sigma' ? !anti : anti;
  const B: Orb = {kind: 'p', x: DX + sep / 2, y, ang, size: L};
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);
  return (
    <g opacity={opacity}>
      <line x1={DX - 270} y1={y} x2={DX + 270} y2={y} stroke={C.muted} strokeWidth={2} strokeDasharray="8 9" opacity={0.45} />
      <Label x={DX + 290} y={y} size={28} color={C.gold} italic font="serif" opacity={0.8}>
        z
      </Label>
      <OrbShape o={A} t={t} />
      <OrbShape o={B} t={t} flip={flipB} />
      {!anti ? <OverlapGlow id={`p2-${mode}-${y}`} A={A} B={B} color={C.cyan} opacity={0.8} pulse={pulse} /> : null}
      {!anti ? <Glow x={DX} y={y} r={mode === 'sigma' ? 70 : 110} color="cyan" opacity={0.35 + 0.15 * pulse} /> : null}
      {anti ? (
        <g>
          <line x1={DX} y1={y - 130} x2={DX} y2={y + 130} stroke={C.red} strokeWidth={4 + 4 * node} strokeOpacity={0.12 * node} strokeLinecap="round" />
          <line x1={DX} y1={y - 120} x2={DX} y2={y + 120} stroke={C.red} strokeWidth={3} strokeDasharray="10 8" opacity={0.6 + 0.4 * node} />
          <Label x={DX} y={below ? y + 146 : y - 146} size={24} color={C.red} opacity={0.5 + 0.5 * node} weight={600}>
            simpul
          </Label>
        </g>
      ) : null}
      <RichLabel x={DX - 330} y={y} parts={tag} size={44} color={tagColor} anchor="middle" font="serif" italic />
    </g>
  );
};

export const P2: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // ---- baris 0: sumbu z ----
  const axis = ramp(t, wordOf(0, 'sumbu', 0) - 0.4, wordOf(0, 'sumbu', 0) + 0.6);
  const zLab = ramp(t, wordOf(0, 'z.') - 0.3, wordOf(0, 'z.') + 0.4, BACK);
  const nuc = ramp(t, cue(0) + 0.2, cue(0) + 1.0);
  // ---- baris 1: p_z ujung ke ujung ----
  const pz = ramp(t, cue(1) - 0.3, cue(1) + 0.5);
  const meet = ramp(t, wordOf(1, 'bertemu') - 0.3, wordOf(1, 'ujung', 1) + 0.2, EASE_IN_OUT);
  const split = ramp(t, wordOf(1, 'membentuk') - 0.2, wordOf(1, 'membentuk') + 0.9, EASE_IN_OUT);
  const sigB = ramp(t, wordOf(1, 'sigma', 0) - 0.3, wordOf(1, 'sigma', 0) + 0.5);
  const sigA = ramp(t, wordOf(1, 'bintang') - 0.3, wordOf(1, 'bintang') + 0.5);
  // ---- baris 2: π ----
  const toPi = ramp(t, cue(2) - 0.4, cue(2) + 0.5, EASE_IN_OUT);
  const piB = ramp(t, wordOf(2, 'pi', 0) - 0.4, wordOf(2, 'pi', 0) + 0.4);
  const piA = ramp(t, wordOf(2, 'bintang') - 0.4, wordOf(2, 'bintang') + 0.4);
  const side = ramp(t, wordOf(2, 'samping') - 0.6, wordOf(2, 'samping') + 0.4, EASE_IN_OUT);
  // ---- baris 3: simpul ----
  const toNode = ramp(t, cue(3) - 0.3, cue(3) + 0.5, EASE_IN_OUT);
  const node = ramp(t, wordOf(3, 'simpul') - 0.3, wordOf(3, 'simpul') + 0.4) * (0.7 + 0.3 * Math.sin(t * 4));
  // ---- baris 4: diagram ke tengah ----
  const leftOut = ramp(t, cue(4) - 0.4, cue(4) + 0.5, EASE_IN_OUT);
  const mv = ramp(t, cue(4) - 0.2, cue(4) + 1.2, EASE_IN_OUT);

  const sepS = mix(330, 200, meet) + 4 * Math.sin(t * 1.4);
  const sepP = mix(260, 118, side) + 3 * Math.sin(t * 1.4);
  const rowY = (k: 0 | 1) => mix(505, ROW[k], split);

  // diagram MO
  const g: MOGeo = {cx: mix(1450, 960, mv), D: mix(255, 420, mv), lw: mix(96, 120, mv), aw: mix(44, 58, mv), gap: mix(22, 30, mv), agap: mix(9, 12, mv), fs: 30, spin: 36};
  const ao2p = ramp(t, wordOf(0, 'bergabung') - 0.4, wordOf(0, 'bergabung') + 0.5);
  const ao2s = ramp(t, wordOf(4, 'valensi') - 0.4, wordOf(4, 'valensi') + 0.5);
  const s2 = ramp(t, wordOf(4, 'sigma', 0) - 0.3, wordOf(4, 'sigma', 0) + 0.4);
  const s2s = ramp(t, wordOf(4, 'sigma', 1) - 0.3, wordOf(4, 'sigma', 1) + 0.4);
  const hl = {
    s2: bump(t, wordOf(4, 'sigma', 0)),
    s2s: bump(t, wordOf(4, 'sigma', 1)),
    pi: bump(t, wordOf(4, 'pi', 0)) + bump(t, wordOf(2, 'pi', 0), 2),
    pis: bump(t, wordOf(4, 'pi', 1)) + bump(t, wordOf(2, 'bintang'), 2),
    sp: bump(t, wordOf(4, 'sigma', 2)) + bump(t, wordOf(1, 'sigma', 0), 1.2),
    sps: bump(t, wordOf(4, 'sigma', 3)) + bump(t, wordOf(1, 'bintang'), 1.2),
  };
  const anti = node; // L3: semua antiikatan menyala
  const levels: MOLevel[] = [
    {id: 'pL', kind: 'ao', side: 'L', n: 3, y: 410, p: ao2p, label: [['2p']]},
    {id: 'pR', kind: 'ao', side: 'R', n: 3, y: 410, p: ao2p, label: [['2p']]},
    {id: 'sL', kind: 'ao', side: 'L', y: 748, p: ao2s, label: [['2s']]},
    {id: 'sR', kind: 'ao', side: 'R', y: 748, p: ao2s, label: [['2s']]},
    {id: 'sps', kind: 'sgs', y: 212, p: sigA, lit: hl.sps + anti, label: moLab('σ', '2p', true)},
    {id: 'pis', kind: 'pis', n: 2, y: 328, p: piA, lit: hl.pis + anti, label: moLab('π', '2p', true)},
    {id: 'pi', kind: 'pi', n: 2, y: 492, p: piB, lit: hl.pi, label: moLab('π', '2p')},
    {id: 'sp', kind: 'sg', y: 582, p: sigB, lit: hl.sp, label: moLab('σ', '2p')},
    {id: 's2s', kind: 'sgs', y: 676, p: s2s, lit: hl.s2s + anti * s2s, label: moLab('σ', '2s', true)},
    {id: 's2', kind: 'sg', y: 812, p: s2, lit: hl.s2, label: moLab('σ', '2s')},
  ];
  const links = [
    ...['sps', 'sp'].flatMap((b) => [
      {a: 'pL', b, p: b === 'sps' ? sigA : sigB},
      {a: 'pR', b, p: b === 'sps' ? sigA : sigB},
    ]),
    ...['pis', 'pi'].flatMap((b) => [
      {a: 'pL', b, p: b === 'pis' ? piA : piB},
      {a: 'pR', b, p: b === 'pis' ? piA : piB},
    ]),
    ...['s2s', 's2'].flatMap((b) => [
      {a: 'sL', b, p: b === 's2s' ? s2s : s2},
      {a: 'sR', b, p: b === 's2s' ? s2s : s2},
    ]),
  ];
  const eight = ramp(t, wordOf(4, 'delapan', 1) - 0.4, wordOf(4, 'delapan', 1) + 0.4, BACK);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* ---------- kiri: gambar orbital ---------- */}
        <g opacity={1 - leftOut}>
          {/* sumbu z */}
          <g opacity={axis * (1 - split)}>
            <line x1={DX - 400} y1={505} x2={DX + 380} y2={505} stroke={C.muted} strokeWidth={2.5} strokeDasharray="10 9" opacity={(0.8 * (1 - split)) + 0.2} />
            <path d={`M${DX + 372},${493} L${DX + 392},${505} L${DX + 372},${517}`} fill="none" stroke={C.muted} strokeWidth={3} opacity={(1 - split) * 0.8 + 0.2} />
            <Label x={DX + 412} y={505} size={36} color={C.gold} italic font="serif" opacity={zLab}>
              z
            </Label>
            <Label x={DX + 300} y={470} size={24} color={C.muted} opacity={zLab * (1 - split)}>
              sumbu ikatan
            </Label>
          </g>
          {/* inti sebelum p_z muncul */}
          <g opacity={nuc * (1 - pz)}>
            {[-1, 1].map((s) => (
              <g key={s}>
                <circle cx={DX + (s * sepS) / 2} cy={505} r={22} fill={C.red} opacity={0.85} />
                <Label x={DX + (s * sepS) / 2} y={505} size={22} color="#fff" weight={700}>
                  O
                </Label>
              </g>
            ))}
          </g>
          {/* p_z terpisah, lalu bergabung */}
          <g opacity={pz * (1 - split)}>
            <OrbShape o={{kind: 'p', x: DX - sepS / 2, y: 505, ang: 0, size: L}} t={t} />
            <OrbShape o={{kind: 'p', x: DX + sepS / 2, y: 505, ang: 0, size: L}} t={t} />
            <RichLabel x={DX - sepS / 2} y={505 + 70} parts={[['2p'], ['z', 'sub']]} size={28} color={C.ink} />
            <RichLabel x={DX + sepS / 2} y={505 + 70} parts={[['2p'], ['z', 'sub']]} size={28} color={C.ink} />
          </g>
          {/* baris σ (L1) */}
          <Pair y={rowY(0)} t={t} mode="sigma" anti={false} sep={sepS} opacity={split * (0.35 + 0.65 * sigB) * (1 - toPi)} tag={moLab('σ', '2p')} tagColor={C.cyan} />
          <Pair y={rowY(1)} t={t} mode="sigma" anti below sep={sepS} opacity={split * (0.35 + 0.65 * sigA) * (1 - toPi)} tag={moLab('σ', '2p', true)} tagColor={C.red} />
          {/* baris π (L2) */}
          <Pair y={ROW[0]} t={t} mode="pi" anti={false} sep={sepP} opacity={toPi * (0.35 + 0.65 * piB) * (1 - toNode)} tag={moLab('π', '2p')} tagColor={C.amber} />
          <Pair y={ROW[1]} t={t} mode="pi" anti below sep={sepP} opacity={toPi * (0.35 + 0.65 * piA)} node={node} tag={moLab('π', '2p', true)} tagColor={C.pink} />
          <g opacity={toPi * (1 - toNode)}>
            <Label x={DX + 300} y={ROW[0] - 70} size={30} color={C.amber} weight={700}>
              ×2
            </Label>
            <Label x={DX + 300} y={ROW[1] - 70} size={30} color={C.pink} weight={700}>
              ×2
            </Label>
            <RichLabel x={DX} y={ROW[0] - 165} parts={[['p'], ['x', 'sub'], [' dan p'], ['y', 'sub'], [': dari samping']]} size={26} color={C.muted} opacity={side} />
          </g>
          {/* baris σ* (L3) */}
          <Pair y={ROW[0]} t={t} mode="sigma" anti sep={200} opacity={toNode} node={node} tag={moLab('σ', '2p', true)} tagColor={C.red} />
          <Label x={DX} y={852} size={26} color={C.red} opacity={node} weight={600}>
            antiikatan: simpul tambahan di antara inti
          </Label>
        </g>

        {/* ---------- kanan / tengah: diagram MO ---------- */}
        <MODiagram g={g} t={t} levels={levels} links={links} />
        <g opacity={ao2p * (1 - mv)}>
          <Label x={g.cx - g.D} y={360} size={24} color={C.muted}>
            atom A
          </Label>
          <Label x={g.cx + g.D} y={360} size={24} color={C.muted}>
            atom B
          </Label>
        </g>
        <g opacity={mv}>
          <Label x={g.cx - g.D} y={340} size={28} color={C.ink} weight={600}>
            atom A
          </Label>
          <Label x={g.cx + g.D} y={340} size={28} color={C.ink} weight={600}>
            atom B
          </Label>
        </g>
      </Stage>
      <Card x={1660} y={600} opacity={eight} accent={C.gold} style={{padding: '14px 22px'}}>
        <div style={{fontSize: 52, fontFamily: FONT.serif, textAlign: 'center'}}>
          8 <span style={{color: C.muted}}>→</span> <span style={{color: C.gold}}>8</span>
        </div>
        <div style={{fontSize: 21, color: C.muted, textAlign: 'center'}}>
          orbital atom
          <br />→ orbital molekul
        </div>
      </Card>
    </AbsoluteFill>
  );
};
