import { useEffect } from 'react';
import { useCAD } from '../context/CADContext';

export const useSupervisorAgent = () => {
    const { activeCall, aiRecommendation, setAIRecommendation, units } = useCAD();

    // Enhanced Analysis Logic
    useEffect(() => {
        // 1. Check for Status 5 (Sprechwunsch) - Priority Event
        const unitsRequestingSpeech = units.filter(u => u.status === 'S5');
        if (unitsRequestingSpeech.length > 0) {
            const unitNames = unitsRequestingSpeech.map(u => u.callSign).join(', ');
            setAIRecommendation(prev => {
                // Prevent overwriting if already acted upon
                if (prev?.status === 'accepted' || prev?.status === 'rejected') return prev;
                // Prevent flicker if same recommendation
                if (prev?.code === 'STATUS 5' && prev?.description === `Einheit(en) wünschen Funkgespräch: ${unitNames}`) return prev;

                return {
                    code: 'STATUS 5',
                    keyword: 'Sprechwunsch',
                    description: `Einheit(en) wünschen Funkgespräch: ${unitNames}`,
                    confidence: 1.0,
                    units: [], // No deployment needed, just attention
                    reasoning: `Status 5 empfangen von: ${unitNames}`,
                    matchedKeywords: ['Status 5'],
                    status: 'suggested'
                };
            });
            return; // Stop further analysis if critical status event exists
        }

        if (!activeCall) return;

        const text = (activeCall.transcript.join(' ') + ' ' + activeCall.notes).toLowerCase();
        if (!text.trim()) return;

        // Keyword Rules
        const rules = [
            {
                check: (t: string) => t.includes('reanimation') || (t.includes('nicht') && t.includes('atmet')),
                result: {
                    code: 'R0',
                    keyword: 'Reanimation',
                    description: 'Herz-Kreislauf-Stillstand',
                    confidence: 0.98,
                    units: ['RTW', 'NEF', 'HLF'],
                    reasoning: 'Erkannt: Atmungsausfall / Reanimation'
                }
            },
            {
                check: (t: string) => t.includes('feuer') && (t.includes('dach') || t.includes('gebäude') || t.includes('wohnung')),
                result: {
                    code: 'B3',
                    keyword: 'Wohnungsbrand',
                    description: 'Feuer in Gebäude',
                    confidence: 0.95,
                    units: ['HLF', 'DLK', 'ELW', 'RTW'],
                    reasoning: 'Erkannt: Feuer + Gebäudebezug'
                }
            },
            {
                check: (t: string) => t.includes('verkehrsunfall') && t.includes('eingeklemmt'),
                result: {
                    code: 'THL3',
                    keyword: 'VU Person klemmt',
                    description: 'Schwerer Verkehrsunfall',
                    confidence: 0.90,
                    units: ['HLF', 'RW', 'RTW', 'NEF', 'Pol'],
                    reasoning: 'Erkannt: VU + Einklemmung'
                }
            },
            {
                check: (t: string) => t.includes('feuer') || t.includes('brand'),
                result: {
                    code: 'B1',
                    keyword: 'Kleinbrand',
                    description: 'Feuer im Freien / Mülleimer',
                    confidence: 0.70,
                    units: ['HLF'],
                    reasoning: 'Erkannt: Allgemeines Stichwort Feuer'
                }
            }
        ];

        // Find best match (first match in order of definition has priority)
        const match = rules.find(r => r.check(text));

        if (match) {
            setAIRecommendation(prev => {
                // Prevent overwriting if already acted upon
                if (prev?.status === 'accepted' || prev?.status === 'rejected') return prev;
                // Prevent flicker
                if (prev?.code === match.result.code) return prev;

                return {
                    ...match.result,
                    matchedKeywords: [],
                    status: 'suggested'
                };
            });
        } else {
            // If no match, clear recommendation if one was previously set by the transcript analysis
            // But keep STATUS 5 or accepted/rejected
            setAIRecommendation(prev => {
                if (prev && prev.code !== 'STATUS 5' && prev.status !== 'accepted' && prev.status !== 'rejected') {
                    return null;
                }
                return prev;
            });
        }

    }, [activeCall?.transcript, activeCall?.notes, units, setAIRecommendation]);

    // Sentiment Analysis
    const calculateSentiment = () => {
        if (!activeCall) return { score: 0, label: 'Neutral' };

        const text = (activeCall.transcript.join(' ') + ' ' + activeCall.notes).toLowerCase();
        let score = 0.2; // Base level

        const stressPatterns = ['schnell', 'hilfe', 'bitte', 'blut', 'nicht atmet', 'notfall', 'starb'];
        stressPatterns.forEach(p => {
            if (text.includes(p)) score += 0.15;
        });

        const exclamationCount = (text.match(/!/g) || []).length;
        score += exclamationCount * 0.1;

        score = Math.min(score, 1.0);

        let label = 'Ruhig';
        if (score > 0.4) label = 'Besorgt';
        if (score > 0.7) label = 'Panisch';

        return { score, label };
    };

    const sentiment = calculateSentiment();

    // Actions
    const addUnit = () => {
        if (!aiRecommendation) return;
        const unit = prompt("Fahrzeugtyp hinzufügen (z.B. RTW):");
        if (unit) {
            setAIRecommendation({
                ...aiRecommendation,
                units: [...aiRecommendation.units, unit]
            });
        }
    };

    const removeUnit = (unitToRemove: string) => {
        if (!aiRecommendation) return;
        setAIRecommendation({
            ...aiRecommendation,
            units: aiRecommendation.units.filter(u => u !== unitToRemove)
        });
    };

    const acceptRecommendation = () => {
        setAIRecommendation(prev => prev ? { ...prev, status: 'accepted' } : null);
    };

    const rejectRecommendation = () => {
        setAIRecommendation(prev => prev ? { ...prev, status: 'rejected' } : null);
    };

    const manualTrigger = (action: any) => {
        setAIRecommendation({
            code: action.code,
            keyword: action.keyword,
            description: action.desc,
            confidence: 1.0,
            units: action.units,
            reasoning: "Manuelle Auswahl",
            matchedKeywords: [],
            status: 'suggested'
        });
    }

    return {
        recommendation: aiRecommendation,
        sentiment,
        actions: {
            addUnit,
            removeUnit,
            accept: acceptRecommendation,
            reject: rejectRecommendation,
            manualTrigger
        }
    };
};
