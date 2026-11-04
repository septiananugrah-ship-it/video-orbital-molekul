import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, slot, win} from '../anim';
import {Card, Formula, Glow, Label, Part, Stage, Sub} from '../components/primitives';
import {Level} from '../components/grupD';
import {EDot} from '../components/vbB';
import {RichLabel} from '../components/vbD';
import {Connector, MoADefs, Proton} from '../components/moA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 01: H₂⁺ (2 proton, 1 elektron) → dekat A seperti 1s_A, dekat B seperti 1s_B
// → ψ = c_A φ_A ± c_B φ_B (LCAO) → 2 orbital atom menghasilkan 2 orbital molekul.
const AX = 700;
const BX = 1220;
const PY = 450;

const smooth = (x: number) => x * x * (3 - 2 * x);

export const Lcao: React.FC = () => {
  const {t, cue, cueEnd, wordOf} = useScene();

  // ---------- H₂⁺ ----------
  const enter = ramp(t, cue(0) - 0.8, cue(0) + 0.6);
  const protons = ramp(t, wordOf(0, 'proton') - 0.4, wordOf(0, 'proton') + 0.4, BACK);
  const elec = ramp(t, wordOf(0, 'elektron') - 0.4, wordOf(0, 'elektron') + 0.4);
  const title = ramp(t, wordOf(0, 'plus') - 0.6, wordOf(0, 'plus') + 0.3, BACK) * (1 - ramp(t, cue(3) - 0.5, cue(3), EASE_IN_OUT));
  const scheme = ramp(t, cue(4) - 0.2, cue(4) + 0.9, EASE_IN_OUT);
  const picOut = 1 - ramp(t, cue(4) - 0.5, cue(4) + 0.4, EASE_IN_OUT);

  // ke mana elektron condong: 0 = dekat A, 1 = dekat B
  const wander = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 5.2);
  const tB = wordOf(1, 'dekat', 1);
  const target = ramp(t, tB - 0.9, tB + 0.2, EASE_IN_OUT);
  const ov = win(t, cue(1) - 0.6, cueEnd(1) - 0.2, 0.8, 1.0);
  const w = smooth(mix(wander, target, ov));
  const th = t * 2.6;
  const rr = 92 + 18 * Math.sin(t * 1.3);
  const ex = mix(AX + rr * Math.cos(th), BX - rr * Math.cos(th + 0.8), w);
  const ey = mix(PY + rr * 0.72 * Math.sin(th), PY + rr * 0.72 * Math.sin(th + 0.8), w) - 70 * Math.sin(Math.PI * w);

  const show1 = ramp(t, wordOf(1, 'orbital') - 0.4, wordOf(1, 'orbital') + 0.5);
  const both = ramp(t, wordOf(2, 'gabungan') - 0.4, wordOf(2, 'gabungan') + 0.6);
  const cloudA = show1 * mix(0.25 + 0.75 * (1 - w) * (0.4 + 0.6 * ov), 1, both);
  const cloudB = show1 * mix(0.25 + 0.75 * w * (0.4 + 0.6 * ov), 1, both);
  const coefOut = 1 - ramp(t, cue(3) - 0.6, cue(3) - 0.1, EASE_IN_OUT);
  const lblNear = win(t, wordOf(1, 'tampak') - 0.3, cueEnd(1), 0.5, 0.6);

  // ---------- rumus ----------
  const sF = slot(t, wordOf(2, 'gabungan') - 0.3, cue(4));
  const pPsi = ramp(t, wordOf(2, 'gabungan') - 0.3, wordOf(2, 'gabungan') + 0.3);
  const pA = ramp(t, wordOf(2, 'phi', 0) - 0.6, wordOf(2, 'phi', 0) + 0.3);
  const pPM = ramp(t, wordOf(2, 'ditambah') - 0.2, wordOf(2, 'ditambah') + 0.3);
  const pB = ramp(t, wordOf(2, 'phi', 1) - 0.6, wordOf(2, 'phi', 1) + 0.3);
  const coefA = ramp(t, wordOf(2, 'phi', 0) - 0.6, wordOf(2, 'phi', 0) + 0.3);
  const coefB = ramp(t, wordOf(2, 'phi', 1) - 0.6, wordOf(2, 'phi', 1) + 0.3);
  const lcao = ramp(t, wordOf(3, 'LCAO') - 0.3, wordOf(3, 'LCAO') + 0.5, BACK) * (1 - ramp(t, cue(4) - 0.5, cue(4), EASE_IN_OUT));

  // ---------- skema 2 → 2 ----------
  const aoIn = ramp(t, cue(4) + 0.2, cue(4) + 1.0);
  const tMO = wordOf(4, 'menghasilkan');
  const moIn = ramp(t, tMO - 0.2, tMO + 0.8, BACK);
  const conn = ramp(t, tMO - 0.4, tMO + 0.6);
  const sRule = slot(t, wordOf(4, 'dua', 1) - 0.2, 999);
  const AOY = 470;
  const SIGY = 590;
  const STARY = 340;
  const aoL: [number, number] = [520, 690];
  const aoR: [number, number] = [1230, 1400];
  const mo: [number, number] = [850, 1070];
  const breathe = Math.sin(t * 2.2);

  return (
    <AbsoluteFill>
      <Stage>
        <MoADefs />
        {/* =============== H₂⁺ =============== */}
        <g opacity={enter * picOut}>
          <Glow x={960} y={PY} r={520} color="cyan" opacity={0.08 + 0.06 * both} />
          {/* awan 1s di sekitar masing-masing proton */}
          {[
            [AX, cloudA],
            [BX, cloudB],
          ].map(([x, op], k) => (
            <g key={k} opacity={op}>
              <circle cx={x} cy={PY} r={170 * (1 + 0.03 * Math.sin(t * 1.7 + k))} fill="url(#moA-blue)" />
              <circle cx={x} cy={PY} r={150} fill="none" stroke={C.blue} strokeWidth={2.5} strokeDasharray="6 8" strokeDashoffset={(k ? 1 : -1) * t * 10} opacity={0.7} />
            </g>
          ))}
          <Proton x={AX} y={PY} r={18} opacity={protons} label="A" />
          <Proton x={BX} y={PY} r={18} opacity={protons} label="B" />
          {/* jejak elektron */}
          {Array.from({length: 10}, (_, k) => {
            const tt = t - (k + 1) * 0.05;
            const wk = smooth(mix(0.5 - 0.5 * Math.cos((2 * Math.PI * tt) / 5.2), ramp(tt, tB - 0.9, tB + 0.2, EASE_IN_OUT), win(tt, cue(1) - 0.6, cueEnd(1) - 0.2, 0.8, 1.0)));
            const thk = tt * 2.6;
            const rk = 92 + 18 * Math.sin(tt * 1.3);
            const xk = mix(AX + rk * Math.cos(thk), BX - rk * Math.cos(thk + 0.8), wk);
            const yk = mix(PY + rk * 0.72 * Math.sin(thk), PY + rk * 0.72 * Math.sin(thk + 0.8), wk) - 70 * Math.sin(Math.PI * wk);
            return <circle key={k} cx={xk} cy={yk} r={9 - k * 0.7} fill={C.cyan} opacity={elec * 0.32 * (1 - k / 10)} />;
          })}
          <EDot x={ex} y={ey} r={14} opacity={elec} />
          <Label x={960} y={PY + 150} size={28} color={C.cyan} opacity={elec * (1 - show1)}>
            satu elektron, dua proton
          </Label>
          {/* label 1s */}
          <RichLabel x={AX} y={PY + 205} parts={[['φ'], ['A', 'sub'], [' = 1s'], ['A', 'sub']]} size={36} color={C.blue} font="serif" opacity={show1} />
          <RichLabel x={BX} y={PY + 205} parts={[['φ'], ['B', 'sub'], [' = 1s'], ['B', 'sub']]} size={36} color={C.blue} font="serif" opacity={show1} />
          <Label x={AX} y={PY - 215} size={28} color={C.ink} opacity={lblNear * (1 - w)}>
            dekat A → seperti 1s milik A
          </Label>
          <Label x={BX} y={PY - 215} size={28} color={C.ink} opacity={lblNear * w}>
            dekat B → seperti 1s milik B
          </Label>
          {/* koefisien: seberapa besar sumbangan tiap orbital atom */}
          <RichLabel x={AX} y={PY - 215} parts={[['c'], ['A', 'sub'], ['φ'], ['A', 'sub']]} size={44 + 3 * breathe} color={C.gold} font="serif" italic opacity={coefA * (1 - lblNear) * coefOut} />
          <RichLabel x={BX} y={PY - 215} parts={[['c'], ['B', 'sub'], ['φ'], ['B', 'sub']]} size={44 - 3 * breathe} color={C.gold} font="serif" italic opacity={coefB * (1 - lblNear) * coefOut} />
          <Label x={960} y={PY - 215} size={52} color={C.gold} font="serif" opacity={pPM * (1 - lblNear) * coefOut}>
            ±
          </Label>
        </g>
        <RichLabel x={960} y={250} parts={[['H'], ['2', 'sub'], ['+', 'sup']]} size={64} color={C.ink} font="serif" opacity={title * picOut * (1 - ramp(t, cue(1) - 0.3, cue(1) + 0.4, EASE_IN_OUT))} />

        {/* =============== skema: 2 orbital atom → 2 orbital molekul =============== */}
        <g opacity={scheme}>
          <Label x={250} y={250} size={26} color={C.muted} anchor="start">
            energi
          </Label>
          <line x1={240} y1={700} x2={240} y2={290} stroke={C.muted} strokeWidth={3} markerEnd="url(#arrow-muted)" />
          <g opacity={aoIn}>
            <Level x1={aoL[0]} x2={aoL[1]} y={AOY} color={C.blue} lit={0.5 + 0.5 * breathe} />
            <Level x1={aoR[0]} x2={aoR[1]} y={AOY} color={C.blue} lit={0.5 - 0.5 * breathe} />
            <RichLabel x={(aoL[0] + aoL[1]) / 2} y={AOY + 44} parts={[['φ'], ['A', 'sub'], [' (1s'], ['A', 'sub'], [')']]} size={32} color={C.blue} font="serif" />
            <RichLabel x={(aoR[0] + aoR[1]) / 2} y={AOY + 44} parts={[['φ'], ['B', 'sub'], [' (1s'], ['B', 'sub'], [')']]} size={32} color={C.blue} font="serif" />
            <Label x={(aoL[0] + aoL[1]) / 2} y={AOY - 140} size={26} color={C.muted}>
              orbital atom A
            </Label>
            <Label x={(aoR[0] + aoR[1]) / 2} y={AOY - 140} size={26} color={C.muted}>
              orbital atom B
            </Label>
          </g>
          {[SIGY, STARY].map((yy, k) => (
            <g key={k} opacity={conn}>
              <Connector x1={aoL[1] + 8} y1={AOY} x2={mo[0] - 8} y2={yy} t={t} />
              <Connector x1={aoR[0] - 8} y1={AOY} x2={mo[1] + 8} y2={yy} t={t} />
              {/* butir yang mengalir dari orbital atom ke orbital molekul */}
              {[0, 1].map((s) =>
                [0, 1, 2].map((m) => {
                  const ph = (t * 0.45 + m / 3 + k * 0.17) % 1;
                  const x0 = s ? aoR[0] - 8 : aoL[1] + 8;
                  const x1 = s ? mo[1] + 8 : mo[0] - 8;
                  return <circle key={`${s}${m}`} cx={mix(x0, x1, ph)} cy={mix(AOY, yy, ph)} r={4.5} fill={k ? C.red : C.cyan} opacity={0.8 * cyc(ph)} />;
                }),
              )}
            </g>
          ))}
          <g opacity={moIn}>
            <Level x1={mo[0]} x2={mo[1]} y={SIGY} color={C.cyan} lit={0.6 + 0.4 * Math.sin(t * 2.6)} width={6} />
            <Level x1={mo[0]} x2={mo[1]} y={STARY} color={C.red} lit={0.6 + 0.4 * Math.sin(t * 2.6 + 1.5)} width={6} />
            <RichLabel x={960} y={SIGY + 44} parts={[['c'], ['A', 'sub'], ['φ'], ['A', 'sub'], [' + c'], ['B', 'sub'], ['φ'], ['B', 'sub']]} size={30} color={C.cyan} font="serif" italic />
            <RichLabel x={960} y={STARY - 44} parts={[['c'], ['A', 'sub'], ['φ'], ['A', 'sub'], [' − c'], ['B', 'sub'], ['φ'], ['B', 'sub']]} size={30} color={C.red} font="serif" italic />
            <Label x={960} y={STARY - 100} size={26} color={C.muted}>
              orbital molekul
            </Label>
          </g>
        </g>
      </Stage>

      <Formula x={960} y={790} p={sF} size={68} caption="orbital molekul = gabungan linear orbital atom">
        <Part p={pPsi}>
          <i>ψ</i> =
        </Part>{' '}
        <Part p={pA} color={C.gold}>
          <i>c</i>
          <Sub>A</Sub>
          <i>φ</i>
          <Sub>A</Sub>
        </Part>{' '}
        <Part p={pPM}>±</Part>{' '}
        <Part p={pB} color={C.gold}>
          <i>c</i>
          <Sub>B</Sub>
          <i>φ</i>
          <Sub>B</Sub>
        </Part>
      </Formula>
      {/* LCAO */}
      <Card x={960} y={200} opacity={lcao} scale={0.9 + 0.1 * lcao} accent={C.cyan} style={{padding: '14px 34px'}}>
        <div style={{fontSize: 42, fontWeight: 600, color: C.ink}}>
          <span style={{color: C.cyan, fontWeight: 800, letterSpacing: 2}}>LCAO</span>
          <span style={{color: C.muted}}> = </span>
          <span style={{color: C.cyan}}>L</span>inear <span style={{color: C.cyan}}>C</span>ombination of <span style={{color: C.cyan}}>A</span>tomic <span style={{color: C.cyan}}>O</span>rbitals
        </div>
        <div style={{fontSize: 30, color: C.muted, textAlign: 'center', marginTop: 4}}>kombinasi linear orbital atom</div>
      </Card>
      <Card x={960} y={790} opacity={sRule} accent={C.cyan} style={{padding: '18px 36px'}}>
        <div style={{fontSize: 46, fontWeight: 600, color: C.ink, fontFamily: FONT.sans}}>
          <span style={{color: C.blue}}>2 orbital atom</span>
          <span style={{color: C.muted}}> → </span>
          <span style={{color: C.cyan}}>2 orbital molekul</span>
        </div>
        <div style={{fontSize: 28, color: C.muted, textAlign: 'center', marginTop: 6}}>
          umumnya: <i style={{fontFamily: FONT.serif}}>n</i> orbital atom → <i style={{fontFamily: FONT.serif}}>n</i> orbital molekul
        </div>
      </Card>
    </AbsoluteFill>
  );
};

