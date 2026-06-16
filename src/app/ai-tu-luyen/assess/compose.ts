import { COG, COG_ORDER } from './data';
import { masteryBand } from './masteryBand';
import { AssessData, CogLevel, CogMeta } from './types';

/** Payload thô từ backend /kc/competency (chưa có phần tĩnh/pure). */
export type RawCompetency = Omit<AssessData, 'COG' | 'COG_ORDER' | 'masteryBand'>;

/** Gắn phần tĩnh client-side (COG, COG_ORDER, masteryBand) vào payload backend. */
export function composeAssessData(raw: RawCompetency): AssessData {
    return {
        ...raw,
        COG: COG as Record<CogLevel, CogMeta>,
        COG_ORDER: COG_ORDER as CogLevel[],
        masteryBand,
    };
}
