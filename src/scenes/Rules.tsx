import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Card, Glow, Label, Stage} from '../components/primitives';
import {MODiagram, pLobePath, pPhase, type MOGeo} from '../components/moB';
import {HBar, OrbShape, OverlapGlow, overlapArea, type Orb} from '../components/vbB';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Tiga syarat orbital atom bergabung: energi berdekatan, tumpang tindih cukup, simetri cocok.
const PX = [380, 960, 1540];
const PY0 = 190;
const PY1 = 770;
const CY = 470;

/** Tumpang tindih bertanda s–p: Σ (+1 di lobus emas, −1 di lobus ungu) di dalam lingkaran s. */
const signedOverlap = (sx: number, sy: number, R: number, px: number, py: number, ang: number, L: number) => {
  let pos = 0;
  let neg = 0;
  const step = 4;
  for (let x = sx - R; x <= sx + R; x += step)
    for (let y = sy - R; y <= sy + R; y += step) {
      if (Math.hypot(x - sx, y - sy) > R) continue;
      const ph = pPhase(px, py, ang, L, x, y);
      if (ph > 0) pos++;
      else if (ph < 0) neg++;
    }
  return {pos, neg};
};

export const Rules: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  const tTiga = wordOf(0, 'tiga');
  const frame = [0, 1, 2].map((i) => ramp(t, tTiga - 0.4 + i * 0.25, tTiga + 0.4 + i * 0.25, BACK));
  const c1 = ramp(t, cue(1) - 0.2, cue(1) + 0.6);
  const c2 = ramp(t, cue(2) - 0.2, cue(2) + 0.6);
  const c3 = ramp(t, cue(3) - 0.2, cue(3) + 0.6);
  const content = [c1, c2, c3];
  const focus = (i: number) => {
    const a = [cue(1), cue(2), cue(3)][i];
    const b = [cue(2), cue(3), cue(4)][i];
    return ramp(t, a - 0.3, a + 0.3) * (1 - ramp(t, b - 0.3, b + 0.3, EASE_IN_OUT));
  };

  // ---- panel 1: energi ----
  const near = ramp(t, wordOf(1, 'berdekatan') - 0.3, wordOf(1, 'berdekatan') + 1.0, EASE_IN_OUT);
  const far = ramp(t, wordOf(1, 'jauh') - 0.4, wordOf(1, 'jauh') + 0.9, EASE_IN_OUT);
  const br = 4 * Math.sin(t * 2.1);
  const splitN = near * (80 + br);
  const gN: MOGeo = {cx: PX[0] - 125, D: 82, lw: 64, aw: 46, fs: 22};
  const gF: MOGeo = {cx: PX[0] + 125, D: 82, lw: 64, aw: 46, fs: 22};
  const lowF = 650;
  const highF = 360;
  const sF = far * (8 + 1.5 * Math.sin(t * 2.1));

  // ---- panel 2: tumpang tindih ----
  const ap = ramp(t, wordOf(2, 'bertumpang') - 1.2, wordOf(2, 'bertumpang') + 0.8, EASE_IN_OUT);
  const d2 = mix(150, 62, ap) + 8 * Math.sin(t * 1.6) * ap;
  const A: Orb = {kind: 's', x: PX[1] - d2, y: CY, size: 82};
  const B: Orb = {kind: 's', x: PX[1] + d2, y: CY, size: 82};
  const ov = overlapArea(A, B, 5) / (Math.PI * 82 * 82);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);

  // ---- panel 3: simetri ----
  const tOrb = wordOf(3, 'Orbital', 0);
  const rot = ramp(t, wordOf(3, 'tegak') - 0.6, wordOf(3, 'tegak') + 0.9, EASE_IN_OUT);
  const ang = mix(Math.PI, -Math.PI / 2, rot) + 0.03 * Math.sin(t * 1.5) * (1 - rot);
  const SX = PX[2] - 40;
  const PXp = PX[2] + 50;
  const SR = 95;
  const PL = 140;
  const so = signedOverlap(SX, CY, SR, PXp, CY, ang, PL);
  const norm = signedOverlap(SX, CY, SR, PXp, CY, Math.PI, PL).pos || 1;
  const net = (so.pos - so.neg) / norm;
  const plus = ramp(t, wordOf(3, 'positif') - 0.3, wordOf(3, 'positif') + 0.4);
  const minus = ramp(t, wordOf(3, 'negatifnya') - 0.3, wordOf(3, 'negatifnya') + 0.4);
  const cancel = ramp(t, wordOf(3, 'menghapus') - 0.2, wordOf(3, 'menghapus') + 0.8);
  const zero = ramp(t, wordOf(3, 'nol') - 0.4, wordOf(3, 'nol') + 0.4, BACK);
  const later = ramp(t, wordOf(4, 'grup') - 0.6, wordOf(4, 'grup') + 0.3, BACK);
  const symAll = ramp(t, tOrb - 0.3, tOrb + 0.5);

  const titles = ['energi berdekatan', 'tumpang tindih', 'simetri cocok'];
  const accents = [C.gold, C.cyan, C.violet];

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* ---------- bingkai panel ---------- */}
        {PX.map((x, i) => (
          <g key={i} opacity={frame[i]} transform={`translate(0 ${(1 - frame[i]) * 30})`}>
            <rect x={x - 268} y={PY0} width={536} height={PY1 - PY0} rx={26} fill="rgba(12,18,40,0.62)" stroke={accents[i]} strokeOpacity={0.25 + 0.45 * focus(i)} strokeWidth={2 + focus(i)} />
            <circle cx={x - 210} cy={PY0 + 50} r={24} fill={accents[i]} fillOpacity={0.15} stroke={accents[i]} strokeWidth={3} />
            <Label x={x - 210} y={PY0 + 50} size={26} color={accents[i]} weight={800}>
              {String(i + 1)}
            </Label>
            <Label x={x - 172} y={PY0 + 50} size={30} color={C.ink} anchor="start" weight={600}>
              {titles[i]}
            </Label>
            {/* nomor besar sebelum isi muncul */}
            <Label x={x} y={CY + 20} size={200} color={accents[i]} weight={800} opacity={0.12 * (1 - content[i])}>
              {String(i + 1)}
            </Label>
          </g>
        ))}

        {/* ---------- panel 1 ---------- */}
        <g opacity={c1}>
          <line x1={PX[0]} y1={PY0 + 100} x2={PX[0]} y2={PY1 - 30} stroke={C.faint} strokeWidth={2} strokeDasharray="6 8" />
          <MODiagram
            g={gN}
            t={t}
            levels={[
              {id: 'L', kind: 'ao', side: 'L', y: 510},
              {id: 'R', kind: 'ao', side: 'R', y: 510},
              {id: 's', kind: 'sg', y: 510 + splitN, p: near},
              {id: 'ss', kind: 'sgs', y: 510 - splitN, p: near},
            ]}
            links={[
              {a: 'L', b: 's', p: near},
              {a: 'L', b: 'ss', p: near},
              {a: 'R', b: 's', p: near},
              {a: 'R', b: 'ss', p: near},
            ]}
          />
          <Glow x={gN.cx} y={510 + splitN} r={70} color="cyan" opacity={0.4 * near * (0.6 + 0.4 * pulse)} />
          <Label x={gN.cx} y={680} size={26} color={C.mint} weight={700} opacity={near}>
            dekat
          </Label>
          <Label x={gN.cx} y={716} size={22} color={C.ink} opacity={near}>
            bercampur kuat
          </Label>
          <g opacity={far}>
            <MODiagram
              g={gF}
              t={t}
              levels={[
                {id: 'L', kind: 'ao', side: 'L', y: lowF, label: [['1s']]},
                {id: 'R', kind: 'ao', side: 'R', y: highF, label: [['2p']]},
                {id: 'a', kind: 'sg', y: lowF + sF, p: far},
                {id: 'b', kind: 'sgs', y: highF - sF, p: far},
              ]}
              links={[
                {a: 'L', b: 'a', p: far},
                {a: 'R', b: 'b', p: far},
              ]}
            />
            <Label x={gF.cx} y={505} size={22} color={C.muted} italic>
              hampir tak berubah
            </Label>
            <Label x={gF.cx} y={716} size={26} color={C.red} weight={700}>
              jauh
            </Label>
          </g>
        </g>

        {/* ---------- panel 2 ---------- */}
        <g opacity={c2}>
          <OrbShape o={A} t={t} />
          <OrbShape o={B} t={t} />
          <OverlapGlow id="rules-ov" A={A} B={B} color={C.cyan} opacity={Math.min(1, ov * 6)} pulse={pulse} />
          <Glow x={PX[1]} y={CY} r={90} color="cyan" opacity={Math.min(1, ov * 5) * 0.6} />
          <HBar x={PX[1] - 110} y={650} w={300} v={ov * 2.4} color={C.cyan} label="irisan" />
          <Label x={PX[1]} y={716} size={24} color={C.ink}>
            irisan besar → ikatan kuat
          </Label>
        </g>

        {/* ---------- panel 3 ---------- */}
        <g opacity={c3}>
          <line x1={PX[2] - 240} y1={CY} x2={PX[2] + 230} y2={CY} stroke={C.muted} strokeWidth={2} strokeDasharray="8 8" opacity={0.7} />
          <Label x={PX[2] + 236} y={CY - 22} size={26} color={C.muted} italic font="serif">
            z
          </Label>
          <g opacity={symAll}>
            <OrbShape o={{kind: 's', x: SX, y: CY, size: SR}} t={t} />
            <OrbShape o={{kind: 'p', x: PXp, y: CY, ang, size: PL}} t={t} />
            <clipPath id="rules-s">
              <circle cx={SX} cy={CY} r={SR} />
            </clipPath>
            <g clipPath="url(#rules-s)" opacity={1 - 0.65 * cancel * (0.7 + 0.3 * pulse)}>
              <path d={pLobePath(PXp, CY, ang, PL)} fill={C.gold} fillOpacity={0.75} />
              <path d={pLobePath(PXp, CY, ang + Math.PI, PL)} fill={C.violet} fillOpacity={0.75} />
            </g>
            <Label x={PXp - 24} y={CY - 58} size={46} color={C.gold} weight={800} opacity={plus * rot}>
              +
            </Label>
            <Label x={PXp - 24} y={CY + 58} size={46} color={C.violet} weight={800} opacity={minus * rot}>
              −
            </Label>
            <Label x={SX - 60} y={CY + 118} size={26} color={C.blue} opacity={1 - plus} font="serif" italic>
              s
            </Label>
            <Label x={PXp + 70} y={CY - 120} size={24} color={C.gold} opacity={rot * (1 - plus)} anchor="start">
              p tegak lurus
            </Label>
          </g>
          <HBar x={PX[2] - 110} y={650} w={300} v={Math.max(0, net)} color={C.violet} label="total" />
          <g opacity={zero}>
            <Label x={PX[2] - 70} y={716} size={40} color={C.gold} weight={800}>
              +
            </Label>
            <Label x={PX[2] - 22} y={716} size={40} color={C.violet} weight={800}>
              −
            </Label>
            <Label x={PX[2] + 50} y={716} size={40} color={C.ink} weight={800}>
              = 0
            </Label>
          </g>
        </g>
      </Stage>
      <Card x={PX[2]} y={838} opacity={later} accent={C.violet} style={{padding: '12px 28px'}}>
        <div style={{fontSize: 30, textAlign: 'center', fontFamily: FONT.sans}}>
          lagi nanti: <span style={{color: C.violet, fontWeight: 600}}>grup titik</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
