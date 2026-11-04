import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, slot} from '../anim';
import {Card, DrawPath, Formula, Label, Part, Stage, Sub} from '../components/primitives';
import {Level, TArrow} from '../components/grupD';
import {RichLabel} from '../components/vbD';
import {Connector, DensityMap, MoADefs, waveArea, wavePath} from '../components/moA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 02: φ_A + φ_B (sefase) → menguat di antara inti → σ1s; φ_A − φ_B → simpul → σ*1s, inti saling tolak;
// diagram energi: σ1s turun, σ*1s naik sedikit lebih jauh (Δ′ > Δ).
const A0 = 95; // px per a₀ (sama dengan skala peta kerapatan)
const XA = 960 - A0; // inti A (R = 2 a₀)
const XB = 960 + A0;
const X0 = 390;
const X1 = 1530;
const BASE = 400;
const AMP = 165;
const MAPY = 685;
const MAPW = 2 * 4.2 * A0;
const MAPH = 230;

const phi = (x: number, xn: number) => Math.exp(-Math.abs(x - xn) / A0);

export const Bonding: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // ---------- penjumlahan ----------
  const slide = ramp(t, -0.4, 1.6, EASE_IN_OUT);
  const offA = -260 * (1 - slide);
  const offB = 260 * (1 - slide);
  const waves = ramp(t, -0.4, 0.8);
  const tSum = wordOf(0, 'dijumlahkan');
  const sum = ramp(t, tSum - 0.2, tSum + 1.0, EASE_IN_OUT);
  const boost = ramp(t, wordOf(0, 'menguatkan') - 0.3, wordOf(0, 'menguatkan') + 0.6);
  const partA = 1 - ramp(t, cue(2) - 0.5, cue(2) + 0.2, EASE_IN_OUT);
  const mapS = ramp(t, wordOf(1, 'terkumpul') - 0.4, wordOf(1, 'terkumpul') + 0.6);
  const glue = ramp(t, wordOf(1, 'merekatkan') - 0.3, wordOf(1, 'merekatkan') + 0.5);
  const nameS = ramp(t, wordOf(1, 'sigma') - 0.3, wordOf(1, 'sigma') + 0.5, BACK);

  // ---------- pengurangan ----------
  const partB = ramp(t, cue(2) - 0.1, cue(2) + 0.6) * (1 - ramp(t, cue(4) - 0.5, cue(4) + 0.2, EASE_IN_OUT));
  const flip = ramp(t, wordOf(2, 'dikurangkan') - 0.1, wordOf(2, 'dikurangkan') + 0.9, EASE_IN_OUT);
  const diff = ramp(t, wordOf(2, 'meniadakan') - 0.4, wordOf(2, 'meniadakan') + 0.8, EASE_IN_OUT);
  const node = ramp(t, wordOf(2, 'simpul') - 0.3, wordOf(2, 'simpul') + 0.4, BACK);
  const mapX = ramp(t, cue(3) - 0.2, cue(3) + 0.7);
  const outward = ramp(t, wordOf(3, 'luar') - 0.4, wordOf(3, 'luar') + 0.4);
  const repel = ramp(t, wordOf(3, 'tolak') - 0.4, wordOf(3, 'tolak') + 0.4);
  const nameX = ramp(t, wordOf(3, 'sigma') - 0.3, wordOf(3, 'sigma') + 0.5, BACK);

  // ---------- diagram energi ----------
  const dia = ramp(t, cue(4) - 0.1, cue(4) + 0.8);
  const dSig = ramp(t, wordOf(4, 'turun') - 0.4, wordOf(4, 'turun') + 0.6, BACK);
  const dStar = ramp(t, wordOf(4, 'naik') - 0.4, wordOf(4, 'naik') + 0.6, BACK);
  const sigIn = ramp(t, wordOf(4, 'ikatan', 0) - 0.3, wordOf(4, 'ikatan', 0) + 0.4);
  const starIn = ramp(t, wordOf(4, 'antiikatan') - 0.3, wordOf(4, 'antiikatan') + 0.4);
  const far = ramp(t, wordOf(4, 'jauh') - 0.3, wordOf(4, 'jauh') + 0.5);

  const sPlus = slot(t, tSum - 0.2, cue(2));
  const sMinus = slot(t, wordOf(2, 'dikurangkan') - 0.2, cue(4));
  const sDelta = slot(t, wordOf(4, 'jauh') - 0.2, 999);

  const br = 1 + 0.035 * Math.sin(t * 2.0);
  const amp = AMP * br;
  const sB = 1 - 2 * flip; // tanda φ_B: +1 → −1
  const fA = (x: number) => phi(x - offA, XA);
  const fB = (x: number) => phi(x - offB, XB);
  const fSum = (x: number) => phi(x, XA) + phi(x, XB);
  const fDiff = (x: number) => phi(x, XA) - phi(x, XB);
  const pulse = 0.6 + 0.4 * Math.sin(t * 3);

  // diagram
  const AOY = 480;
  const SIGY = 600;
  const STARY = 330;
  const aoL: [number, number] = [420, 600];
  const aoR: [number, number] = [1320, 1500];
  const mo: [number, number] = [860, 1060];
  const ySig = mix(AOY, SIGY, dSig);
  const yStar = mix(AOY, STARY, dStar);

  const Axis = (
    <g>
      <line x1={X0} y1={BASE} x2={X1} y2={BASE} stroke={C.faint} strokeWidth={2.5} />
      <Label x={X1 + 14} y={BASE} size={24} color={C.muted} anchor="start">
        sumbu ikatan
      </Label>
      {[XA, XB].map((x, k) => (
        <g key={k}>
          <line x1={x} y1={BASE - 8} x2={x} y2={BASE + 8} stroke={C.muted} strokeWidth={2} />
          <circle cx={x} cy={BASE} r={8} fill="#fff1d0" />
          <Label x={x} y={BASE + 34} size={24} color={C.gold} weight={700}>
            {k ? 'B' : 'A'}
          </Label>
        </g>
      ))}
    </g>
  );

  return (
    <AbsoluteFill>
      <Stage>
        <MoADefs />
        {/* ===================== penjumlahan: σ1s ===================== */}
        <g opacity={partA * waves}>
          {Axis}
          <path d={waveArea(fSum, XA, XB, BASE, amp)} fill={C.cyan} opacity={0.22 * boost * pulse} />
          <DrawPath d={wavePath(fA, X0, X1, BASE, amp)} p={1} stroke={C.gold} width={4} opacity={1 - 0.6 * sum} />
          <DrawPath d={wavePath(fB, X0, X1, BASE, amp)} p={1} stroke={C.gold} width={4} opacity={1 - 0.6 * sum} />
          <DrawPath d={wavePath(fSum, X0, X1, BASE, amp)} p={sum} stroke={C.cyan} width={6} />
          <RichLabel x={XA - 260} y={BASE - 95} parts={[['φ'], ['A', 'sub']]} size={38} color={C.gold} font="serif" italic opacity={1 - sum} />
          <RichLabel x={XB + 260} y={BASE - 95} parts={[['φ'], ['B', 'sub']]} size={38} color={C.gold} font="serif" italic opacity={1 - sum} />
          <g opacity={boost}>
            {[-1, 0, 1].map((k) => {
              const x = 960 + k * 48;
              const ph = (t * 0.7 + (k + 1) / 3) % 1;
              return <TArrow key={k} x1={x} y1={BASE - 40 - ph * 20} x2={x} y2={BASE - 100 - ph * 20} color={C.cyan} width={4} opacity={cyc(ph)} />;
            })}
            <Label x={960} y={BASE - amp * 1.25 - 40} size={30} color={C.cyan} weight={600}>
              saling menguatkan
            </Label>
          </g>
          {/* peta kerapatan |φA + φB|² */}
          <DensityMap x={960} y={MAPY} w={MAPW} h={MAPH} sign={1} opacity={mapS} t={t} />
          <g opacity={glue}>
            <TArrow x1={XA - 150} y1={MAPY} x2={XA - 40} y2={MAPY} color={C.cyan} width={5} opacity={pulse} />
            <TArrow x1={XB + 150} y1={MAPY} x2={XB + 40} y2={MAPY} color={C.cyan} width={5} opacity={pulse} />
          </g>
          <Label x={960} y={MAPY + MAPH / 2 + 10} size={24} color={C.muted} opacity={mapS}>
            kerapatan elektron |ψ|²
          </Label>
          <g opacity={nameS} transform={`translate(${1560} ${MAPY - 20}) scale(${0.85 + 0.15 * nameS})`}>
            <RichLabel x={0} y={0} parts={[['σ1s']]} size={72} color={C.cyan} font="serif" italic />
            <Label x={0} y={62} size={28} color={C.cyan} weight={600}>
              orbital ikatan
            </Label>
          </g>
        </g>

        {/* ===================== pengurangan: σ*1s ===================== */}
        <g opacity={partB}>
          {Axis}
          <DrawPath d={wavePath((x) => phi(x, XA), X0, X1, BASE, amp)} p={1} stroke={C.gold} width={4} opacity={1 - 0.6 * diff} />
          {/* φB membalik fase: emas → ungu */}
          <DrawPath d={wavePath((x) => sB * phi(x, XB), X0, X1, BASE, amp)} p={1} stroke={C.gold} width={4} opacity={(1 - flip) * (1 - 0.6 * diff)} />
          <DrawPath d={wavePath((x) => sB * phi(x, XB), X0, X1, BASE, amp)} p={1} stroke={C.violet} width={4} opacity={flip * (1 - 0.6 * diff)} />
          <RichLabel x={XB + 250} y={BASE + 95} parts={[['−φ'], ['B', 'sub']]} size={38} color={C.violet} font="serif" italic opacity={flip * (1 - diff)} />
          <RichLabel x={XA - 250} y={BASE - 95} parts={[['φ'], ['A', 'sub']]} size={38} color={C.gold} font="serif" italic opacity={1 - diff} />
          <DrawPath d={wavePath(fDiff, X0, X1, BASE, amp)} p={diff} stroke={C.red} width={6} />
          {/* simpul di tengah */}
          <g opacity={node}>
            <circle cx={960} cy={BASE} r={14 + 4 * pulse} fill="none" stroke={C.red} strokeWidth={3} />
            <circle cx={960} cy={BASE} r={5} fill={C.red} />
            <line x1={960} y1={BASE - 150} x2={960} y2={BASE + 150} stroke={C.red} strokeWidth={2} strokeDasharray="6 8" opacity={0.6} />
            <Label x={960} y={BASE - 175} size={30} color={C.red} weight={600}>
              simpul
            </Label>
          </g>
          {/* peta kerapatan |φA − φB|² */}
          <DensityMap x={960} y={MAPY} w={MAPW} h={MAPH} sign={-1} opacity={mapX} t={t} />
          <g opacity={outward}>
            {[-1, 1].map((s) => {
              const ph = (t * 0.8 + (s > 0 ? 0.5 : 0)) % 1;
              return <TArrow key={s} x1={960 + s * (190 + 30 * ph)} y1={MAPY - 62} x2={960 + s * (290 + 30 * ph)} y2={MAPY - 62} color={C.red} width={4} opacity={cyc(ph)} />;
            })}
            <Label x={530} y={MAPY - 26} size={26} color={C.red} weight={600} anchor="end">
              elektron terdorong ke luar
            </Label>
          </g>
          <g opacity={repel}>
            <TArrow x1={XA - 20} y1={MAPY + 4} x2={XA - 120 - 10 * pulse} y2={MAPY + 4} color={C.red} width={6} />
            <TArrow x1={XB + 20} y1={MAPY + 4} x2={XB + 120 + 10 * pulse} y2={MAPY + 4} color={C.red} width={6} />
            <Label x={530} y={MAPY + 26} size={26} color={C.red} weight={600} anchor="end">
              inti saling tolak
            </Label>
          </g>
          <g opacity={nameX} transform={`translate(${1560} ${MAPY - 20}) scale(${0.85 + 0.15 * nameX})`}>
            <RichLabel x={0} y={0} parts={[['σ'], ['*', 'sup'], ['1s']]} size={72} color={C.red} font="serif" italic />
            <Label x={0} y={62} size={28} color={C.red} weight={600}>
              orbital antiikatan
            </Label>
          </g>
        </g>

        {/* ===================== diagram energi ===================== */}
        <g opacity={dia}>
          <line x1={260} y1={720} x2={260} y2={270} stroke={C.muted} strokeWidth={3} markerEnd="url(#arrow-muted)" />
          <Label x={276} y={270} size={28} color={C.muted} anchor="start" font="serif" italic>
            E
          </Label>
          <Level x1={aoL[0]} x2={aoL[1]} y={AOY} color={C.blue} lit={0.5 + 0.5 * Math.sin(t * 2)} />
          <Level x1={aoR[0]} x2={aoR[1]} y={AOY} color={C.blue} lit={0.5 - 0.5 * Math.sin(t * 2)} />
          <RichLabel x={(aoL[0] + aoL[1]) / 2} y={AOY + 44} parts={[['1s'], ['A', 'sub']]} size={34} color={C.blue} font="serif" />
          <RichLabel x={(aoR[0] + aoR[1]) / 2} y={AOY + 44} parts={[['1s'], ['B', 'sub']]} size={34} color={C.blue} font="serif" />
          {/* garis acuan energi orbital atom */}
          <line x1={aoL[1] + 20} y1={AOY} x2={aoR[0] - 20} y2={AOY} stroke={C.faint} strokeWidth={2} strokeDasharray="4 10" opacity={dSig} />
          {[
            [ySig, sigIn],
            [yStar, starIn],
          ].map(([yy, p], k) => (
            <g key={k} opacity={p}>
              <Connector x1={aoL[1] + 8} y1={AOY} x2={mo[0] - 8} y2={yy} t={t} />
              <Connector x1={aoR[0] - 8} y1={AOY} x2={mo[1] + 8} y2={yy} t={t} />
            </g>
          ))}
          <g opacity={sigIn}>
            <Level x1={mo[0]} x2={mo[1]} y={ySig} color={C.cyan} lit={0.6 + 0.4 * Math.sin(t * 2.6)} width={6} />
            <RichLabel x={960} y={ySig + 46} parts={[['σ1s']]} size={40} color={C.cyan} font="serif" italic />
            <DensityMap x={1690} y={SIGY} w={240} h={90} sign={1} t={t} opacity={0.95} />
            <Label x={1690} y={SIGY + 66} size={22} color={C.cyan}>
              ikatan
            </Label>
          </g>
          <g opacity={starIn}>
            <Level x1={mo[0]} x2={mo[1]} y={yStar} color={C.red} lit={0.6 + 0.4 * Math.sin(t * 2.6 + 1.5)} width={6} />
            <RichLabel x={960} y={yStar - 46} parts={[['σ'], ['*', 'sup'], ['1s']]} size={40} color={C.red} font="serif" italic />
            <DensityMap x={1690} y={STARY} w={240} h={90} sign={-1} t={t} opacity={0.95} />
            <Label x={1690} y={STARY + 66} size={22} color={C.red}>
              antiikatan
            </Label>
          </g>
          {/* Δ turun dan Δ′ naik (lebih besar) */}
          <TArrow x1={1130} y1={AOY} x2={1130} y2={SIGY} p={dSig} color={C.cyan} width={4} />
          <TArrow x1={1180} y1={AOY} x2={1180} y2={STARY} p={dStar} color={C.red} width={4} />
          <Label x={1112} y={(AOY + SIGY) / 2} size={34} color={C.cyan} font="serif" italic anchor="end" opacity={dSig}>
            Δ
          </Label>
          <Label x={1200} y={(AOY + STARY) / 2} size={34} color={C.red} font="serif" italic anchor="start" opacity={dStar}>
            Δ′
          </Label>
          <rect x={1166} y={STARY} width={28} height={AOY - STARY} rx={6} fill={C.red} opacity={0.12 * far * (0.6 + 0.4 * Math.sin(t * 3))} />
        </g>
      </Stage>

      <Formula x={1580} y={235} p={sPlus * partA} size={58} accent={C.cyan}>
        <span style={{color: C.cyan}}>
          <i>ψ</i>
          <Sub>+</Sub>
        </span>{' '}
        ={' '}
        <Part p={1} color={C.gold}>
          <i>φ</i>
          <Sub>A</Sub> + <i>φ</i>
          <Sub>B</Sub>
        </Part>
      </Formula>
      <Formula x={1580} y={235} p={sMinus} size={58} accent={C.red}>
        <span style={{color: C.red}}>
          <i>ψ</i>
          <Sub>−</Sub>
        </span>{' '}
        = <span style={{color: C.gold}}>
          <i>φ</i>
          <Sub>A</Sub>
        </span>{' '}
        −{' '}
        <span style={{color: C.violet}}>
          <i>φ</i>
          <Sub>B</Sub>
        </span>
      </Formula>
      <Card x={960} y={790} opacity={sDelta} accent={C.red} style={{padding: '16px 34px'}}>
        <div style={{fontSize: 40, fontWeight: 600, color: C.ink, fontFamily: FONT.sans}}>
          antiikatan naik sedikit lebih jauh: <span style={{fontFamily: FONT.serif, fontStyle: 'italic', color: C.red}}>Δ′</span>
          <span style={{color: C.muted}}> &gt; </span>
          <span style={{fontFamily: FONT.serif, fontStyle: 'italic', color: C.cyan}}>Δ</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

