/* ====================================================================
 * Bộ dựng AssessData (deterministic) — port từ prototype "Đánh giá kỹ năng".
 * Sinh tiến độ học sinh mock + gộp cây KC. Đây là nguồn dữ liệu MOCK cho FE;
 * phase 2 sẽ thay bằng dữ liệu thật từ /kc/competency (cùng shape).
 * ==================================================================== */
import { A_MACH, A_TOPICS, COG, COG_ORDER } from './data';
import { KC_WRONG, TOPIC_WRONG } from './banks';
import {
    AssessData,
    AssessKCData,
    AssessMachData,
    AssessTopicData,
    CogLevel,
} from './types';
import { masteryBand } from './masteryBand';

// ---- PRNG deterministic theo chuỗi ----
function hashSeed(str: string): number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
}
function rngFrom(seed: number): () => number {
    let s = seed;
    return function () {
        s += 0x6d2b79f5;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// ---- Tinh chỉnh tường thuật: KC yếu / mạnh / chưa đủ dữ liệu ----
const WEAK = new Set([
    'gioi_han_ham_so', 'pt_bpt_mu_logarit', 'xac_suat_co_dieu_kien', 'the_tich_khoi',
    'cuc_tri', 'goc_khoang_cach_kg', 'quan_he_vuong_goc', 'ham_so_lien_tuc',
    'pt_duong_thang_kg', 'so_dac_trung_phan_tan',
]);
const STRONG = new Set([
    'menh_de', 'tap_hop', 'quy_tac_dem', 'day_so', 'luy_thua', 'khai_niem_ham_so',
    'he_thuc_luong_tam_giac', 'so_gan_dung', 'vecto_phang', 'gia_tri_luong_giac',
]);
const NODATA = new Set([
    'ba_duong_conic', 'dao_ham_cap_hai', 'nhi_thuc_newton', 'khao_sat_do_thi',
    'ung_dung_dao_ham_thuc_tien', 'pt_mat_cau',
]);

function weakestCog(rng: () => number): CogLevel {
    const r = rng();
    if (r < 0.15) return 'TH';
    if (r < 0.55) return 'VD';
    return 'VDC';
}

interface RawKC { tag: string; name: string; diff: number; desc: string }
interface RawTopic { tag: string; mach: string; name: string; grade: string; kcs: RawKC[] }

function genKC(kc: RawKC, topic: RawTopic): AssessKCData {
    const rng = rngFrom(hashSeed(kc.tag));
    let q: number, ratio: number;
    if (NODATA.has(kc.tag)) {
        q = Math.floor(rng() * 3);
        ratio = 0.4 + rng() * 0.3;
    } else if (WEAK.has(kc.tag)) {
        q = 8 + Math.floor(rng() * 10);
        ratio = 0.22 + rng() * 0.2;
    } else if (STRONG.has(kc.tag)) {
        q = 6 + Math.floor(rng() * 10);
        ratio = 0.78 + rng() * 0.18;
    } else {
        q = 4 + Math.floor(rng() * 12);
        ratio = 0.5 + rng() * 0.32;
    }
    const correct = Math.min(q, Math.round(q * ratio));
    const wrongTotal = q - correct;
    const mastery = q >= 4 ? Math.round((correct / q) * 100) : null;
    const delta = mastery == null ? 0 : Math.round((rng() - 0.42) * 26);
    const bank = (KC_WRONG as Record<string, WrongRaw[]>)[kc.tag]
        || (TOPIC_WRONG as Record<string, WrongRaw[]>)[topic.tag] || [];

    const wrong: AssessKCData['wrong'] = [];
    if (wrongTotal > 0 && bank.length > 0) {
        const show = Math.min(wrongTotal, bank.length);
        for (let i = 0; i < show; i++) {
            const item = bank[i % bank.length];
            wrong.push({ ...item, level: item.level as CogLevel, id: kc.tag + '_w' + i });
        }
    }

    const cogCount: Record<CogLevel, number> = { NB: 0, TH: 0, VD: 0, VDC: 0 };
    for (let i = 0; i < wrongTotal; i++) {
        const lv = (bank.length ? bank[i % bank.length].level : weakestCog(rng)) as CogLevel;
        cogCount[lv] = (cogCount[lv] || 0) + 1;
    }
    if (wrongTotal > 0 && Object.values(cogCount).every((v) => v === 0)) {
        cogCount[weakestCog(rng)] = wrongTotal;
    }

    return {
        ...kc,
        topicTag: topic.tag,
        machTag: topic.mach,
        grade: topic.grade,
        q, correct, wrongTotal, mastery, delta,
        targetCog: weakestCog(rng),
        cogCount,
        wrong,
        wrongShown: wrong.length,
    };
}

interface WrongRaw { level: string; q: string; choices: Record<string, string>; answer: string; expl: string }

export function buildAssessData(): AssessData {
    const kcMap: Record<string, AssessKCData> = {};
    const topics: AssessTopicData[] = (A_TOPICS as RawTopic[]).map((t) => {
        const kcs = t.kcs.map((kc) => {
            const built = genKC(kc, t);
            kcMap[kc.tag] = built;
            return built;
        });
        const withData = kcs.filter((k) => k.mastery != null);
        let totalQ = 0, totalCorrect = 0, totalWrong = 0;
        kcs.forEach((k) => { totalQ += k.q; totalCorrect += k.correct; totalWrong += k.wrongTotal; });
        let mastery: number | null = null, deltaSum = 0;
        if (withData.length > 0) {
            let wsum = 0, msum = 0;
            withData.forEach((k) => { wsum += k.q; msum += (k.mastery as number) * k.q; deltaSum += k.delta; });
            mastery = Math.round(msum / wsum);
        }
        const mach = (A_MACH as MachRaw[]).find((m) => m.tag === t.mach)!;
        return {
            ...t,
            kcs,
            machColor: mach.color, machBg: mach.bg, machName: mach.name,
            totalQ, totalCorrect, totalWrong,
            kcCount: kcs.length,
            kcWithData: withData.length,
            kcNoData: kcs.length - withData.length,
            mastery,
            delta: withData.length ? Math.round(deltaSum / withData.length) : 0,
        };
    });

    const mach: AssessMachData[] = (A_MACH as MachRaw[]).map((m) => {
        const ts = topics.filter((t) => t.mach === m.tag);
        const withData = ts.filter((t) => t.mastery != null);
        let totalQ = 0, totalWrong = 0, kcCount = 0, kcWithData = 0;
        ts.forEach((t) => { totalQ += t.totalQ; totalWrong += t.totalWrong; kcCount += t.kcCount; kcWithData += t.kcWithData; });
        let mastery: number | null = null;
        if (withData.length > 0) {
            let wsum = 0, msum = 0;
            withData.forEach((t) => { wsum += t.totalQ; msum += (t.mastery as number) * t.totalQ; });
            mastery = wsum > 0 ? Math.round(msum / wsum) : null;
        }
        return {
            ...m, topics: ts, totalQ, totalWrong,
            kcCount, kcWithData, topicCount: ts.length,
            mastery,
        };
    });

    const allKC = Object.values(kcMap);
    const kcWithData = allKC.filter((k) => k.mastery != null);
    let oQ = 0, oC = 0, oW = 0;
    allKC.forEach((k) => { oQ += k.q; oC += k.correct; oW += k.wrongTotal; });
    const overallMastery = kcWithData.length
        ? Math.round(
            kcWithData.reduce((s, k) => s + (k.mastery as number) * k.q, 0)
            / kcWithData.reduce((s, k) => s + k.q, 0),
        )
        : 0;

    const recent = kcWithData
        .filter((k) => k.delta > 2)
        .sort((a, b) => b.delta - a.delta)
        .slice(0, 4);

    const priorities = kcWithData
        .slice()
        .sort((a, b) => (a.mastery as number) - (b.mastery as number))
        .slice(0, 4);

    return {
        mach, topics, kcMap,
        COG: COG as AssessData['COG'],
        COG_ORDER: COG_ORDER as CogLevel[],
        summary: {
            overallMastery,
            totalQ: oQ, totalCorrect: oC, totalWrong: oW,
            kcTotal: allKC.length,
            kcAssessed: kcWithData.length,
            topicTotal: topics.length,
            machTotal: mach.length,
        },
        recent, priorities,
        masteryBand,
    };
}

interface MachRaw { tag: string; code: string; name: string; color: string; bg: string }
