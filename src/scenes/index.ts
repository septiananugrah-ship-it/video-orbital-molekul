import type React from 'react';
import {Bonding} from './Bonding';
import {Frontier} from './Frontier';
import {H2} from './H2';
import {Hetero} from './Hetero';
import {Hook} from './Hook';
import {Ions} from './Ions';
import {Lcao} from './Lcao';
import {Mixing} from './Mixing';
import {Nitrogen} from './Nitrogen';
import {Outro} from './Outro';
import {Oxygen} from './Oxygen';
import {P2} from './P2';
import {Period2} from './Period2';
import {Pes} from './Pes';
import {Recap} from './Recap';
import {Roadmap} from './Roadmap';
import {Rules} from './Rules';
import {Singlet} from './Singlet';
import {Title} from './Title';

// Pemetaan id scene di naskah → komponen visual.
export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  title: Title,
  roadmap: Roadmap,
  lcao: Lcao,
  bonding: Bonding,
  h2: H2,
  rules: Rules,
  p2: P2,
  oxygen: Oxygen,
  mixing: Mixing,
  period2: Period2,
  ions: Ions,
  hetero: Hetero,
  frontier: Frontier,
  pes: Pes,
  singlet: Singlet,
  nitrogen: Nitrogen,
  recap: Recap,
  outro: Outro,
};
