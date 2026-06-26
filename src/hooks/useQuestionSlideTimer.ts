import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tracks elapsed seconds per question slide (for TSA exam UI).
 * Pass scopeKey (e.g. tab index) to reset when the question set changes.
 */
export function useQuestionSlideTimer(
    enabled: boolean,
    currentIndex: number,
    getQuestionId: (index: number) => string | null | undefined,
    scopeKey?: string | number,
) {
    const questionTimeSpentRef = useRef<Record<string, number>>({});
    const [questionTimeSpent, setQuestionTimeSpent] = useState<Record<string, number>>({});
    const slideStartRef = useRef<number>(Date.now());
    const activeSlideQuestionIdRef = useRef<string | null>(null);
    const [slideTimerTick, setSlideTimerTick] = useState(0);

    useEffect(() => {
        if (!enabled) return;
        const qid = getQuestionId(currentIndex);
        if (!qid) return;

        if (activeSlideQuestionIdRef.current && activeSlideQuestionIdRef.current !== qid) {
            const prevId = activeSlideQuestionIdRef.current;
            const elapsed = Math.max(0, Math.round((Date.now() - slideStartRef.current) / 1000));
            if (elapsed > 0) {
                const next = {
                    ...questionTimeSpentRef.current,
                    [prevId]: (questionTimeSpentRef.current[prevId] || 0) + elapsed,
                };
                questionTimeSpentRef.current = next;
                setQuestionTimeSpent(next);
            }
        }
        activeSlideQuestionIdRef.current = qid;
        slideStartRef.current = Date.now();
    }, [currentIndex, scopeKey, enabled, getQuestionId]);

    useEffect(() => {
        if (!enabled) return;
        const id = setInterval(() => setSlideTimerTick(t => t + 1), 1000);
        return () => clearInterval(id);
    }, [enabled]);

    const getCurrentSlideSeconds = useCallback(() => {
        const qid = getQuestionId(currentIndex);
        if (!qid) return 0;
        const accumulated = questionTimeSpentRef.current[qid] || 0;
        if (activeSlideQuestionIdRef.current === qid) {
            const current = Math.max(0, Math.round((Date.now() - slideStartRef.current) / 1000));
            return accumulated + current;
        }
        return accumulated;
    }, [currentIndex, questionTimeSpent, slideTimerTick, getQuestionId]);

    const finalizeCurrentSlideTime = useCallback(() => {
        const qid = activeSlideQuestionIdRef.current;
        if (!qid) return;
        const elapsed = Math.max(0, Math.round((Date.now() - slideStartRef.current) / 1000));
        if (elapsed > 0) {
            const next = {
                ...questionTimeSpentRef.current,
                [qid]: (questionTimeSpentRef.current[qid] || 0) + elapsed,
            };
            questionTimeSpentRef.current = next;
            setQuestionTimeSpent(next);
        }
        slideStartRef.current = Date.now();
    }, []);

    const resetTimer = useCallback(() => {
        questionTimeSpentRef.current = {};
        setQuestionTimeSpent({});
        activeSlideQuestionIdRef.current = null;
        slideStartRef.current = Date.now();
    }, []);

    return {
        getCurrentSlideSeconds,
        finalizeCurrentSlideTime,
        questionTimeSpentRef,
        slideTimerTick,
        resetTimer,
    };
}
