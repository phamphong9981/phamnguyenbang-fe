/* Kiểu dữ liệu cho màn Đánh giá năng lực (port từ prototype). */

export type CogLevel = 'NB' | 'TH' | 'VD' | 'VDC';

export interface CogMeta {
    key: CogLevel;
    name: string;
    color: string;
    bg: string;
}

export interface WrongQuestion {
    id: string;
    level: CogLevel;
    q: string;
    choices: Record<string, string>;
    answer: string;
    expl: string;
}

export interface AssessKCData {
    tag: string;
    name: string;
    diff: number;
    desc: string;
    topicTag: string;
    machTag: string;
    grade: string;
    q: number;
    correct: number;
    wrongTotal: number;
    mastery: number | null;
    delta: number;
    targetCog: CogLevel;
    cogCount: Record<CogLevel, number>;
    wrong: WrongQuestion[];
    wrongShown: number;
}

export interface AssessTopicData {
    tag: string;
    mach: string;
    name: string;
    grade: string;
    kcs: AssessKCData[];
    machColor: string;
    machBg: string;
    machName: string;
    totalQ: number;
    totalCorrect: number;
    totalWrong: number;
    kcCount: number;
    kcWithData: number;
    kcNoData: number;
    mastery: number | null;
    delta: number;
}

export interface AssessMachData {
    tag: string;
    code: string;
    name: string;
    color: string;
    bg: string;
    topics: AssessTopicData[];
    totalQ: number;
    totalWrong: number;
    kcCount: number;
    kcWithData: number;
    topicCount: number;
    mastery: number | null;
}

export interface MasteryBand {
    key: string;
    label: string;
    color: string;
    bg: string;
}

export interface AssessSummary {
    overallMastery: number;
    totalQ: number;
    totalCorrect: number;
    totalWrong: number;
    kcTotal: number;
    kcAssessed: number;
    topicTotal: number;
    machTotal: number;
}

export interface AssessData {
    mach: AssessMachData[];
    topics: AssessTopicData[];
    kcMap: Record<string, AssessKCData>;
    COG: Record<CogLevel, CogMeta>;
    COG_ORDER: CogLevel[];
    summary: AssessSummary;
    recent: AssessKCData[];
    priorities: AssessKCData[];
    masteryBand: (m: number | null) => MasteryBand;
}
