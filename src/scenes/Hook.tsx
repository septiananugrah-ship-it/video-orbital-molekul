import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, rand, ramp} from '../anim';
import {Atom, Bond, Glow, Label, Stage} from '../components/primitives';
import {Stamp} from '../components/grupD';
import {Stars} from '../components/grupA';
import {EDot} from '../components/vbB';
import {Box, HORSESHOE, Horseshoe, RichLabel, Spin} from '../components/vbD';
import {MoADefs, SpreadCloud} from '../components/moA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Pembuka: oksigen cair menggantung di kutub magnet → kilas balik VBT (semua ↑↓, gagal)
// → anggapan "elektron ikatan terkurung di antara dua atom" → elektron dilepas, menyebar ke seluruh molekul
// → teori orbital molekul.
const LOX = '#bfe4ff';
const MTOP = 380;
const LX = 520;
const MX = 960; // pusat molekul besar
const MY = 430;
const HALF = 190;

export const Hook: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // ---------- magnet & oksigen cair ----------
  const enter = ramp(t, -0.4, 1.4);
  const tPour = wordOf(0, 'oksigen');
  const pourIn = ramp(t, tPour - 0.8, tPour + 0.2);
  const tilt = ramp(t, tPour - 0.2, tPour + 0.9, EASE_IN_OUT) * (1 - ramp(t, wordOf(0, 'menggantung') + 0.4, wordOf(0, 'menggantung') + 1.4, EASE_IN_OUT));
  const pouring = ramp(t, tPour + 0.5, tPour + 0.9) * (1 - ramp(t, wordOf(0, 'menggantung') + 0.2, wordOf(0, 'menggantung') + 0.8));
  const fill = ramp(t, tPour + 0.9, wordOf(0, 'menggantung') + 0.3, EASE_IN_OUT);
  const hang = ramp(t, wordOf(0, 'menggantung') - 0.2, wordOf(0, 'menggantung') + 0.6);
  const flaskOut = ramp(t, wordOf(0, 'menolak') - 0.2, wordOf(0, 'menolak') + 0.8, EASE_IN_OUT);
  const toSide = ramp(t, cue(1) - 0.5, cue(1) + 0.9, EASE_IN_OUT);
  const magOut = ramp(t, cue(2) - 0.6, cue(2) + 0.3, EASE_IN_OUT);
  const mcx = mix(960, 1420, toSide);
  const g = HORSESHOE(mcx, MTOP);
  const levelTop = g.gapBot - 74 * fill;

  // ---------- kilas balik VBT ----------
  const vbt = ramp(t, cue(1) + 0.1, cue(1) + 1.0) * (1 - magOut);
  const paired = ramp(t, wordOf(1, 'berpasangan') - 0.6, wordOf(1, 'berpasangan') + 0.5);
  const fail = ramp(t, wordOf(1, 'gagal') - 0.15, wordOf(1, 'gagal') + 0.4, BACK) * (1 - magOut);
  const real = ramp(t, wordOf(1, 'gagal') + 0.2, wordOf(1, 'gagal') + 0.9) * (1 - magOut);

  // ---------- elektron terkurung → menyebar ----------
  const mol = ramp(t, cue(2) - 0.2, cue(2) + 0.9, BACK);
  const cage = ramp(t, wordOf(2, 'elektron') - 0.3, wordOf(2, 'elektron') + 0.5) * (1 - ramp(t, wordOf(3, 'tidak') - 0.2, wordOf(3, 'tidak') + 0.6, EASE_IN_OUT));
  const stay = ramp(t, wordOf(2, 'tinggal') - 0.3, wordOf(2, 'tinggal') + 0.5);
  const pulse = Math.max(0, 1 - Math.abs(t - wordOf(2, 'tertentu') - 0.2) / 0.6);
  const spread = ramp(t, wordOf(3, 'menyebar') - 0.9, wordOf(3, 'molekul') + 0.9, EASE_IN_OUT);
  const bondFade = 1 - 0.75 * ramp(t, wordOf(3, 'tidak') - 0.2, wordOf(3, 'menyebar') + 0.2, EASE_IN_OUT);
  const tag = ramp(t, wordOf(3, 'alamat') - 0.4, wordOf(3, 'alamat') + 0.3);
  const strike = ramp(t, wordOf(3, 'tetap') - 0.1, wordOf(3, 'tetap') + 0.5, EASE_IN_OUT);
  const tagOut = ramp(t, cue(4) - 0.4, cue(4) + 0.3, EASE_IN_OUT);
  const molUp = ramp(t, cue(4) - 0.3, cue(4) + 1.0, EASE_IN_OUT);
  const mot = ramp(t, wordOf(4, 'teori') - 0.3, wordOf(4, 'molekul') + 0.6);
  const solved = ramp(t, wordOf(4, 'terpecahkan') - 0.4, wordOf(4, 'terpecahkan') + 0.5, BACK);

  const bob = 5 * Math.sin(t * 1.1);
  const my = MY + bob - 40 * molUp;
  const elecIn = ramp(t, wordOf(2, 'elektron') - 0.3, wordOf(2, 'elektron') + 0.5);
  const trapped = elecIn * (1 - spread);
  const sprLbl = ramp(t, wordOf(3, 'menyebar') - 0.3, wordOf(3, 'menyebar') + 0.5) * (1 - ramp(t, cue(4) - 0.4, cue(4) + 0.3, EASE_IN_OUT));

  // gelas: putar terhadap pusat (BX, BY); bibir di kiri atas
  const BX = 1100;
  const BY = 230;
  const a = (-50 * tilt * Math.PI) / 180;
  const lip = [BX + -60 * Math.cos(a) - -75 * Math.sin(a), BY + -60 * Math.sin(a) + -75 * Math.cos(a)];

  return (
    <AbsoluteFill>
      <Stage>
        <MoADefs />
        <Stars t={t} n={70} y1={860} opacity={0.7 * enter} />

        {/* ================= magnet & oksigen cair ================= */}
        <g opacity={enter * (1 - magOut)}>
          <Glow x={mcx} y={g.gapTop + 37} r={180} color="cyan" opacity={0.4 * hang} />
          <Horseshoe cx={mcx} top={MTOP} t={t} field={enter} />
          {fill > 0.01 ? (
            <g>
              <rect x={g.gapL} y={levelTop} width={g.gapR - g.gapL} height={g.gapBot - levelTop} fill={LOX} opacity={0.85} />
              <ellipse cx={mcx} cy={g.gapBot} rx={(g.gapR - g.gapL) / 2} ry={10 * fill + 2.5 * Math.sin(t * 3)} fill={LOX} opacity={0.85} />
              <ellipse cx={mcx} cy={levelTop} rx={(g.gapR - g.gapL) / 2} ry={4} fill="#ffffff" opacity={0.5} />
              {Array.from({length: 5}, (_, k) => {
                const ph = (((t * 0.6 + rand(k)) % 1) + 1) % 1;
                return <circle key={k} cx={g.gapL + 10 + rand(k * 3.3) * 32} cy={g.gapBot - ph * (g.gapBot - levelTop)} r={2.5} fill="#fff" opacity={0.6 * cyc(ph) * fill} />;
              })}
              {/* uap dingin dari bawah cairan */}
              {Array.from({length: 6}, (_, k) => {
                const ph = (((t * 0.35 + k / 6) % 1) + 1) % 1;
                return <circle key={`v${k}`} cx={mcx - 30 + k * 12 + 10 * Math.sin(t + k)} cy={g.gapBot + 14 + ph * 70} r={8 + ph * 14} fill="#e8f4ff" opacity={0.14 * cyc(ph) * hang} />;
              })}
            </g>
          ) : null}
        </g>
        {/* gelas & aliran */}
        <g opacity={pourIn * (1 - flaskOut)}>
          {pouring > 0.01
            ? Array.from({length: 14}, (_, k) => {
                const ph = (((t * 1.6 + k / 14) % 1) + 1) % 1;
                const y = mix(lip[1], levelTop - 4, ph * ph);
                const x = mix(lip[0], mcx, ph);
                return <circle key={k} cx={x + 3 * Math.sin(k * 2.1)} cy={y} r={5 + 2 * rand(k)} fill={LOX} opacity={pouring * 0.9} />;
              })
            : null}
          <g transform={`translate(${BX} ${BY}) rotate(${-50 * tilt})`}>
            <path d="M-50,-20 L-50,70 Q-50,80 -40,80 L40,80 Q50,80 50,70 L50,-20 Z" fill={LOX} opacity={0.55 * (1 - 0.6 * fill)} />
            <path d="M-60,-75 L-50,-65 L-50,70 Q-50,80 -40,80 L40,80 Q50,80 50,70 L50,-70" fill="rgba(200,215,255,0.06)" stroke="#c8d6ff" strokeWidth={3} strokeOpacity={0.7} />
            {Array.from({length: 5}, (_, k) => {
              const ph = (((t * 0.4 + k / 5) % 1) + 1) % 1;
              return <circle key={k} cx={-20 + k * 12 + 8 * Math.sin(t + k)} cy={-70 - ph * 60} r={8 + ph * 10} fill="#e8f4ff" opacity={0.18 * cyc(ph)} />;
            })}
          </g>
          <Label x={BX + 110} y={BY + 30} size={28} color={LOX} anchor="start">
            oksigen cair
          </Label>
        </g>
        <Label x={mcx - 240} y={g.gapTop + 37} size={30} color={LOX} anchor="end" opacity={hang * (1 - toSide)} weight={600}>
          menggantung di kutub
        </Label>
        <Label x={mcx} y={250} size={30} color={C.violet} opacity={real} weight={600}>
          kenyataan: tertarik magnet
        </Label>

        {/* ================= kilas balik: O=O menurut VBT ================= */}
        <g opacity={vbt}>
          <Label x={LX} y={200} size={26} color={C.muted} font="mono" spacing={3}>
            VIDEO SEBELUMNYA · IKATAN VALENSI
          </Label>
          <g transform={`translate(0 ${bob})`}>
            <Bond x1={LX - 80} y1={340} x2={LX + 80} y2={340} order={2} width={14} />
            <Atom x={LX - 80} y={340} el="O" r={52} />
            <Atom x={LX + 80} y={340} el="O" r={52} />
            {[-1, 1].map((s) =>
              [-55, 55].map((deg) => {
                const ang = ((s < 0 ? 180 : 0) + deg * s) * (Math.PI / 180);
                const ox = LX + s * 80 + Math.cos(ang) * 76;
                const oy = 340 - Math.sin(ang) * 76;
                const px = -Math.sin(ang) * 9;
                const py = -Math.cos(ang) * 9;
                return (
                  <g key={`${s}${deg}`}>
                    <circle cx={ox + px} cy={oy + py} r={7} fill={C.cyan} />
                    <circle cx={ox - px} cy={oy - py} r={7} fill={C.cyan} />
                  </g>
                );
              }),
            )}
          </g>
          <g opacity={paired}>
            {Array.from({length: 6}, (_, k) => {
              const x = LX - 180 + k * 72;
              const j = 3 * Math.sin(t * 3 + k);
              return (
                <g key={k}>
                  <Box x={x} y={565} s={60} color={C.cyan} />
                  <Spin x={x - 11} y={565 + j} up len={40} width={4} />
                  <Spin x={x + 11} y={565 - j} up={false} len={40} width={4} />
                </g>
              );
            })}
            <Label x={LX} y={635} size={28} color={C.cyan}>
              semua elektron berpasangan ↑↓
            </Label>
            <Label x={LX} y={680} size={26} color={C.muted}>
              → seharusnya tidak tertarik magnet
            </Label>
          </g>
        </g>

        {/* ================= molekul O₂: elektron terkurung → menyebar ================= */}
        <g opacity={mol}>
          <Glow x={MX} y={my} r={520} color="cyan" opacity={0.16 * spread} />
          <SpreadCloud cx={MX} cy={my} half={HALF} t={t} spread={spread} R={200} opacity={Math.max(elecIn, spread)} />
          <g opacity={bondFade}>
            <Bond x1={MX - HALF} y1={my} x2={MX + HALF} y2={my} order={2} width={16} />
          </g>
          <Atom x={MX - HALF} y={my} el="O" r={66} glow={0.6} />
          <Atom x={MX + HALF} y={my} el="O" r={66} glow={0.6} />
          {/* kurungan di antara dua atom */}
          <g opacity={cage}>
            <rect
              x={MX - HALF + 70}
              y={my - 46}
              width={2 * HALF - 140}
              height={92}
              rx={18}
              fill={C.cyan}
              fillOpacity={0.05 + 0.08 * pulse}
              stroke={C.gold}
              strokeWidth={3 + 2 * pulse}
              strokeDasharray="12 9"
              strokeDashoffset={-t * 10}
              opacity={0.85}
            />
          </g>
          <g>
            {[0, 1, 2, 3].map((k) => {
              const ph = t * (1.6 + 0.3 * k) + k * 1.7;
              const x = MX + (HALF - 100) * Math.sin(ph);
              const y = my + (k < 2 ? -11 : 11) + 3 * Math.sin(t * 3 + k);
              return <EDot key={k} x={x} y={y} r={10} opacity={trapped} />;
            })}
          </g>
          <Label x={MX} y={my + 150} size={30} color={C.gold} weight={600} opacity={stay * cage}>
            elektron ikatan “tinggal” di antara dua atom tertentu
          </Label>
          {/* label O₂ */}
          <RichLabel x={MX} y={my - 150} parts={[['O'], ['2', 'sub']]} size={52} color={C.ink} font="serif" opacity={0.9 * (1 - ramp(t, cue(3) - 0.6, cue(3), EASE_IN_OUT))} />
        </g>
        {/* tag alamat yang dicoret */}
        <g opacity={tag * (1 - tagOut)} transform={`translate(${MX} ${235}) scale(${0.85 + 0.15 * tag})`}>
          <rect x={-190} y={-34} width={380} height={68} rx={34} fill="rgba(12,18,40,0.92)" stroke={C.gold} strokeWidth={2} />
          <circle cx={-150} cy={0} r={9} fill={C.gold} />
          <text x={12} y={1} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontSize={30} fontWeight={600} fill={C.ink}>
            alamat: antara O dan O
          </text>
          <line x1={-130} y1={2} x2={-130 + 300 * strike} y2={-2} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
        </g>
        <Label x={MX} y={my + 260} size={32} color={C.cyan} weight={600} opacity={sprLbl}>
          menyebar ke seluruh molekul
        </Label>

        {/* dua elektron sejajar: kunci misteri */}
        <g opacity={solved}>
          {[-1, 1].map((s) => (
            <g key={s}>
              <Box x={MX + s * 46} y={my - 175} s={70} color={C.pink} lit={0.6 + 0.4 * Math.sin(t * 3 + s)} />
              <Spin x={MX + s * 46} y={my - 175 + 3 * Math.sin(t * 2.5 + s)} up len={46} width={5} />
            </g>
          ))}
          <Label x={MX + 120} y={my - 175} size={34} color={C.pink} font="serif" italic anchor="start">
            π*
          </Label>
        </g>
      </Stage>

      <Stamp x={LX} y={445} p={fail} text="GAGAL" sub="(teori ikatan valensi)" color={C.red} size={46} rot={-9} />
      {/* judul gagasan */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 700,
          textAlign: 'center',
          opacity: mot,
          translate: `0px ${(1 - mot) * 24}px`,
        }}
      >
        <div style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 76, letterSpacing: 6, color: C.gold, textShadow: '0 0 50px rgba(255,194,74,0.4)'}}>TEORI ORBITAL MOLEKUL</div>
        <div style={{width: 760 * mot, height: 2, margin: '16px auto 0', background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`}} />
      </div>
    </AbsoluteFill>
  );
};
