import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Stage} from './components/primitives';
import {C, FONT, H, W} from './theme';

/** Gambar sampul video (2560×1440 lewat skala 4/3, lihat Root.tsx). */
const Cover: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 70% at 70% 45%, #4a2f0a 0%, ${C.bg2} 45%, ${C.bg} 100%)`}}>
    <Stage>
      <Glow x={1420} y={460} r={560} color="gold" opacity={0.22} />
      <rect x={1020} y={600} width={800} height={190} rx={12} fill="rgba(6,10,24,0.85)" stroke={C.faint} strokeWidth={3} />
      {[1280, 1560].map((x) => (
        <g key={x}>
          <line x1={x - 90} y1={730} x2={x + 90} y2={730} stroke={C.pink} strokeWidth={6} strokeLinecap="round" />
          <line x1={x} y1={715} x2={x} y2={625} stroke={C.cyan} strokeWidth={7} strokeLinecap="round" />
          <path d={`M${x - 18},${648} L${x},${620} L${x + 18},${648}`} fill="none" stroke={C.cyan} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <text x={1420} y={840} textAnchor="middle" fontFamily={FONT.mono} fontSize={30} fill={C.muted}>
        O₂ · dua elektron π* sejajar
      </text>
    </Stage>
    <div style={{position: 'absolute', left: 1080, top: 150, width: 700, textAlign: 'center', fontFamily: FONT.serif, color: C.gold, textShadow: '0 0 40px rgba(255,194,74,0.5)'}}>
      <span style={{fontSize: 260, fontStyle: 'italic'}}>π</span>
      <span style={{fontSize: 130, verticalAlign: 'super'}}>*</span>
    </div>
    <div style={{position: 'absolute', left: 110, top: 220, width: 900}}>
      <div style={{fontFamily: FONT.mono, fontSize: 30, letterSpacing: 8, color: C.gold}}>KIMIA KUANTUM · ORBITAL MOLEKUL</div>
      <div style={{fontFamily: FONT.sans, fontSize: 70, fontWeight: 800, color: C.ink, lineHeight: 1.05, marginTop: 10}}>Teori Orbital Molekul</div>
      <div style={{fontFamily: FONT.sans, fontSize: 140, fontWeight: 800, color: C.gold, lineHeight: 1, marginTop: 24, textShadow: '0 0 50px rgba(255,194,74,0.45)'}}>
        Elektron
        <br />
        Tanpa Alamat
      </div>
      <div style={{display: 'flex', gap: 14, marginTop: 44}}>
        {[
          ['LCAO', C.cyan],
          ['orde ikatan', C.violet],
          ['O₂ paramagnetik', C.amber],
        ].map(([t, col]) => (
          <div key={t} style={{padding: '10px 22px', borderRadius: 999, border: `2px solid ${col}`, color: col, fontFamily: FONT.sans, fontWeight: 600, fontSize: 30}}>
            {t}
          </div>
        ))}
      </div>
    </div>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)'}} />
  </AbsoluteFill>
);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${2560 / W})`, transformOrigin: '0 0'}}>
      <Cover />
    </div>
  </AbsoluteFill>
);
