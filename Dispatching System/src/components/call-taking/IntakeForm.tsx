import React, { useState } from 'react';
import { useCAD } from '../../context/CADContext';
import { User, MapPin, Phone, AlertCircle, Calendar, Sparkles, UserPlus, Info, Tag, X, Flame, Ambulance, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Extracted Component ---
interface MagicInputProps {
    label: string;
    icon?: any;
    field: string;
    value: any;
    placeholder?: string;
    half?: boolean;
    onHoverField?: string;
    overrideChange?: (value: string) => void;
    aiFilledFields: Record<string, boolean>;
    onChange: (field: string, value: any) => void;
    onFocus: (field: string) => void;
    onBlur: () => void;
    onDrop: (e: React.DragEvent, field: string) => void;
}

const MagicInput = ({ label, icon: Icon, field, value, placeholder, half = false, onHoverField, overrideChange, aiFilledFields, onChange, onFocus, onBlur, onDrop }: MagicInputProps) => {
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        target.classList.add('border-primary', 'bg-primary/5');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        target.classList.remove('border-primary', 'bg-primary/5');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div
            className={cn("space-y-1 relative group transition-all duration-300 rounded-lg", half ? "col-span-1" : "col-span-2")}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, field)}
        >
            <div className="flex justify-between px-1">
                <label className="text-xs font-medium text-textMuted flex items-center gap-1.5 uppercase tracking-wide">
                    {Icon && <Icon className="w-3 h-3 text-textMuted" />}
                    {label}
                </label>
                {aiFilledFields[field] && (
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 flex items-center gap-1 shadow-sm animate-in zoom-in">
                        <Sparkles className="w-2.5 h-2.5" /> AI-Sourced
                    </span>
                )}
            </div>
            <div className="relative">
                <input
                    type="text"
                    className={cn(
                        "w-full bg-surface border border-white/10 rounded-lg p-3 text-sm text-white outline-none transition-all placeholder:text-stone-600 focus:border-primary focus:ring-1 focus:ring-primary/50"
                    )}
                    placeholder={placeholder}
                    value={value || ''}
                    onChange={(e) => overrideChange ? overrideChange(e.target.value) : onChange(field, e.target.value)}
                    onMouseEnter={() => onFocus(onHoverField || field)}
                    onMouseLeave={onBlur}
                />
            </div>
        </div>
    );
};

export const IntakeForm: React.FC = () => {
    const { activeCall, setActiveCall, setActiveTranscriptHighlight } = useCAD();
    const [activeTab, setActiveTab] = useState<'emergency' | 'scheduled'>('emergency');

    // Key Facts (Tags) State
    const [keyFacts, setKeyFacts] = useState<string[]>(activeCall.keyword ? activeCall.keyword.split(', ') : []);
    const [tagInput, setTagInput] = useState('');
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const [isClassificationOpen, setIsClassificationOpen] = useState(false);

    // AI Filled Tracking
    const [aiFilledFields, setAiFilledFields] = useState<Record<string, boolean>>({
        callerName: false,
        location: false,
        keyFacts: false,
        code: false,
        callerPhone: false // Initialize callerPhone tracking
    });

    const handleChange = (field: string, value: any) => {
        // Clear AI Sourced tag if user manually edits
        if (aiFilledFields[field]) {
            setAiFilledFields(prev => ({ ...prev, [field]: false }));
        }

        const newState = { ...activeCall, [field]: value };

        // Improved Mock Auto-Fill Logic
        if (field === 'location') {
            const valLower = String(value).toLowerCase();
            if (valLower.length > 3) {
                // Mock: If matches known streets, fill details
                if (valLower.includes('leo') || valLower.includes('haupt') || valLower.includes('mari')) {
                    newState.zip = '80331';
                    newState.city = 'Munich';
                    newState.district = 'Old Town';
                    setAiFilledFields(prev => ({ ...prev, location: true })); // Trigger AI Badge
                }
            }
        }
        setActiveCall(newState);
    };

    const handleFocus = (field: string) => {
        setActiveTranscriptHighlight(field);
    };

    const handleBlur = () => {
        setActiveTranscriptHighlight(null);
    };

    // --- SMART INPUT LOGIC ---
    const handleDrop = (e: React.DragEvent, field: string) => {
        e.preventDefault();

        // Strict Logic: Check key mappings
        const typeMap: Record<string, string> = {
            'callerName': 'callerName',
            'location': 'location',
            'keyFacts': 'keyword', // 'keyword' from LiveTranscript maps to 'keyFacts' here
            'floor': 'details'
        };

        // If strict validation is required, check types. 
        // For general usage: check if 'application/x-cad-[type]' exists
        // simplified logic: allow text/plain fallback but prefer typed

        const text = e.dataTransfer.getData("text/plain");

        // Logic check: Only allow 'location' type into 'location' or 'zip'/'city' fields?
        // Let's implement basic type checking if possible.
        // For now, we trust the user drop target for simplicity unless strict mapping is enforced.
        // User Requirement: "A keyword tagged as 'Location/Address' cannot be dropped into a 'Symptoms' field"

        const droppedType = e.dataTransfer.types.find(t => t.startsWith("application/x-cad-"));
        if (droppedType) {
            const typeSuffix = droppedType.split('-').pop()?.toLowerCase(); // e.g. 'callername'

            // Validation Rules
            // RELAXED LOGIC: Only strictly validate if it's explicitly a mismatch.
            // Note: MIME types are lowercased by the browser, so we must compare case-insensitively.

            if (field === 'location' && typeSuffix !== 'location') return;

            // Fix: Compare lowercase 'callername' with lowercase field name if needed, or just hardcode check
            if (field === 'callerName' && typeSuffix !== 'callername') return;

            // User reported "I can no longer drag items into the 'Name' field".
            // This might be because the transcript sets 'callerName' but we checked something else?
            // Re-verified LiveTranscript: sets `application/x-cad-callerName`.
            // So logic should hold. 
            // HOWEVER, if the drag didn't set type correctly (e.g. cross browser), this fails.
            // Let's allow fallback if text is present.
        } else {
            // If no x-cad type is present (e.g. external drag), allow it? 
            // Or maybe the User dragged "Miller" which is callerName.
            // Let's assume strict for internal, loose for external if functionality was broken.
            // Actually, the user report implies a Regression.
            // Removing strict check for now to ensure usability, unless type is KNOWN Wrong.
        }

        if (text) {
            if (field === 'keyFacts') {
                addKeyFact(text);
            } else {
                handleChange(field, text);
            }
            setAiFilledFields(prev => ({ ...prev, [field]: true }));

            // Remove active drag style immediately
            const target = e.currentTarget as HTMLElement;
            target.classList.remove('border-primary', 'bg-primary/5');
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        target.classList.add('border-primary', 'bg-primary/5');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        target.classList.remove('border-primary', 'bg-primary/5');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    // --- KEY FACTS LOGIC ---
    const addKeyFact = (fact: string) => {
        if (!fact.trim() || keyFacts.includes(fact.trim())) return;
        const newFacts = [...keyFacts, fact.trim()];
        setKeyFacts(newFacts);
        setTagInput('');
        setActiveCall(prev => ({ ...prev, keyword: newFacts.join(', ') }));
        setAiFilledFields(prev => ({ ...prev, keyFacts: true }));

        // Smart Classification Derivation
        const lowerFact = fact.toLowerCase();
        if (lowerFact.includes('fire') || lowerFact.includes('brand') || lowerFact.includes('smoke') || lowerFact.includes('rauch')) {
            setActiveCall(prev => ({ ...prev, code: 'B3', priority: '1' }));
        }
        else if (lowerFact.includes('roof') || lowerFact.includes('dach')) {
            setActiveCall(prev => ({ ...prev, code: 'B4', priority: '1' }));
        }
        else if (lowerFact.includes('cpr') || lowerFact.includes('cardiac') || lowerFact.includes('reanimation')) {
            setActiveCall(prev => ({ ...prev, code: 'R2', priority: '1' }));
        }
    };

    const removeKeyFact = (fact: string) => {
        const newFacts = keyFacts.filter(f => f !== fact);
        setKeyFacts(newFacts);
        setActiveCall(prev => ({ ...prev, keyword: newFacts.join(', ') }));
    };

    // Quick Add Handler for Plus Menu
    const handleAddKeyword = (keyword: string) => {
        addKeyFact(keyword);
        setIsPlusMenuOpen(false);
    };

    const handleSelectClassification = (code: string, desc: string) => {
        setActiveCall(prev => ({ ...prev, code: code, priority: '1' })); // Default priority 1
        addKeyFact(desc); // Also add description as tag
        setAiFilledFields(prev => ({ ...prev, code: true }));
        setIsClassificationOpen(false);
    };

    // --- COMPONENTS ---

    // --- COMPONENTS ---

    // Simplification for props
    const commonInputProps = {
        aiFilledFields,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onDrop: handleDrop
    };

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex bg-surfaceHighlight/30 p-1 rounded-xl shrink-0">
                <button
                    onClick={() => setActiveTab('emergency')}
                    className={cn(
                        "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2",
                        activeTab === 'emergency' ? "bg-red-500 text-white shadow-lg shadow-red-900/20" : "text-textMuted hover:text-white"
                    )}
                >
                    <AlertCircle className="w-4 h-4" /> Emergency
                </button>
                <button
                    onClick={() => setActiveTab('scheduled')}
                    className={cn(
                        "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2",
                        activeTab === 'scheduled' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-textMuted hover:text-white"
                    )}
                >
                    <Calendar className="w-4 h-4" /> Transport
                </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
                {/* Added pb-20 to ensure scrolling space for dropdowns at bottom */}

                {/* --- SECTION 1: CALLER --- */}
                <div className="bg-surface/50 rounded-xl border border-white/5 p-4 relative backdrop-blur-sm">
                    <h3 className="text-xs font-bold text-textMuted uppercase mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                        <User className="w-3.5 h-3.5" /> Caller Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <MagicInput label="Name" field="callerName" value={activeCall.callerName} placeholder="Lastname, Firstname" half {...commonInputProps} />
                        <MagicInput
                            label="Callback Number"
                            field="callerPhone"
                            icon={Phone}
                            value={activeCall.callerPhone}
                            placeholder="+1 ..."
                            half
                            {...commonInputProps}
                        // Ensure AI Tag shows if filled, assuming we track callerPhone in aiFilledFields.
                        // We need to initialize callerPhone in aiFilledFields state in IntakeForm.tsx
                        />
                    </div>
                </div>

                {/* --- SECTION 2: SCHEDULED ONLY - PATIENT --- */}
                {activeTab === 'scheduled' && (
                    <div className="bg-surface/50 rounded-xl border border-white/5 p-4 relative">
                        <h3 className="text-xs font-bold text-textMuted uppercase mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                            <UserPlus className="w-3.5 h-3.5" /> Patient Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <MagicInput label="Patient Name" field="patientName" value={activeCall['patientName' as keyof typeof activeCall]} placeholder="If different..." {...commonInputProps} />
                            <MagicInput
                                label="Transport Type"
                                field="transportType"
                                value={activeCall['transportType' as keyof typeof activeCall]}
                                placeholder="e.g. Wheelchair, Stretcher..."
                                {...commonInputProps}
                            />
                        </div>
                    </div>
                )}

                {/* --- SECTION 3: LOCATION --- */}
                <div className="bg-surface/50 rounded-xl border border-white/5 p-4 relative">
                    <h3 className="text-xs font-bold text-textMuted uppercase mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                        <MapPin className="w-3.5 h-3.5" /> Incident Location
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <MagicInput label="Street / Object" field="location" value={activeCall.location} placeholder="123 Main St" onHoverField="location" {...commonInputProps} />

                        <div className="grid grid-cols-3 gap-2 col-span-2">
                            <MagicInput label="Zip Code" field="zip" value={activeCall['zip' as keyof typeof activeCall]} placeholder="10..." half {...commonInputProps} />
                            <MagicInput label="City" field="city" value={activeCall['city' as keyof typeof activeCall]} placeholder="City" half {...commonInputProps} />
                            <MagicInput label="District" field="district" value={activeCall['district' as keyof typeof activeCall]} placeholder="Area" half {...commonInputProps} />
                        </div>

                        <MagicInput label="Floor / Access Details" field="floor" value={activeCall['floor' as keyof typeof activeCall]} placeholder="3rd Floor, Code 1234..." {...commonInputProps} />
                    </div>
                </div>

                {/* --- SECTION 4: CLASSIFICATION ENGINE --- */}
                <div className="bg-surface/50 rounded-xl border border-white/5 p-4 overflow-visible relative">
                    <h3 className="text-xs font-bold text-textMuted uppercase mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                        <Tag className="w-3.5 h-3.5" /> Context & Classification
                    </h3>

                    <div className="space-y-4">
                        {/* 1. KEYWORDS ROW (Full Width Box with + Add) */}
                        <div
                            className="bg-surface/30 border border-white/10 rounded-lg p-2 min-h-[44px] flex flex-wrap items-center gap-2 relative group hover:border-white/20 transition-colors"
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'keyFacts')}
                        >
                            {keyFacts.map((fact, i) => (
                                <div key={i} className="flex items-center gap-1 bg-white/10 border border-white/10 text-stone-200 px-2 py-0.5 rounded text-sm group/tag">
                                    <span>{fact}</span>
                                    <button onClick={() => removeKeyFact(fact)} className="hover:text-red-400 opacity-0 group-hover/tag:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                                </div>
                            ))}
                            <input
                                type="text"
                                className="flex-1 bg-transparent border-none outline-none text-sm text-white min-w-[100px] placeholder:text-stone-600 placeholder:italic h-full py-1"
                                placeholder={keyFacts.length === 0 ? "Key words..." : ""}
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addKeyFact(tagInput);
                                    }
                                }}
                            />
                            {/* Plus Icon at absolute right or just flex-end */}
                            {/* Plus Icon at absolute right or just flex-end */}
                            <div className="relative ml-auto">
                                <button
                                    onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                                    className="p-1 text-stone-500 hover:text-white transition-colors"
                                    title="Add Standard Keyword"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>

                                {/* QUICK ADD MENU - POPUP */}
                                {isPlusMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/20 rounded-xl shadow-2xl z-[999] p-1 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="text-[10px] font-bold text-stone-500 px-2 py-1 uppercase tracking-wider mb-1 border-b border-white/5">
                                            Quick Add
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <button onClick={() => handleAddKeyword('Room Fire')} className="text-left px-2 py-1.5 text-xs text-stone-300 hover:bg-white/10 hover:text-white rounded flex items-center justify-between group">
                                                <span>Room Fire</span>
                                                <Flame className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100" />
                                            </button>
                                            <button onClick={() => handleAddKeyword('Roof Fire')} className="text-left px-2 py-1.5 text-xs text-stone-300 hover:bg-white/10 hover:text-white rounded flex items-center justify-between group">
                                                <span>Roof Fire</span>
                                                <Flame className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100" />
                                            </button>
                                            <button onClick={() => handleAddKeyword('CPR')} className="text-left px-2 py-1.5 text-xs text-stone-300 hover:bg-white/10 hover:text-white rounded flex items-center justify-between group">
                                                <span>CPR</span>
                                                <Ambulance className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100" />
                                            </button>
                                            <button onClick={() => handleAddKeyword('Car Accident')} className="text-left px-2 py-1.5 text-xs text-stone-300 hover:bg-white/10 hover:text-white rounded flex items-center justify-between group">
                                                <span>Car Accident</span>
                                                <AlertCircle className="w-3 h-3 text-red-500 opacity-0 group-hover:opacity-100" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. CLASSIFICATION & PRIO ROW columns */}
                        <div className="flex items-center justify-between gap-4">
                            <label className="text-sm font-bold text-white shrink-0">
                                Classification & Prio:
                            </label>

                            <div className="flex items-center gap-3">
                                {/* CODE BOX - Controlled by Keywords primarily, but allows override */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsClassificationOpen(!isClassificationOpen)}
                                        className="w-24 h-10 bg-surface border border-white/10 rounded-lg flex items-center justify-center font-mono font-bold text-lg text-white hover:border-white/30 transition-all focus:ring-1 focus:ring-primary/50"
                                        title="Click to override code manually"
                                    >
                                        {activeCall.code || <span className="text-xs text-stone-600 font-sans font-normal italic">Auto</span>}
                                    </button>

                                    {/* DROPDOWN MENU - High Z-Index & Absolute, aligned to this button or nearby */}
                                    {isClassificationOpen && (
                                        <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#1a1a1a] border border-white/20 rounded-xl shadow-2xl z-[999] p-2 animate-in fade-in zoom-in-95 duration-200 text-left ring-1 ring-black/50">
                                            <div className="max-h-60 overflow-y-auto pr-1">
                                                <div className="text-[10px] font-bold text-stone-400 px-2 py-1 uppercase tracking-wider mb-1">
                                                    Select Code
                                                </div>
                                                {/* Fire */}
                                                <button onClick={() => handleSelectClassification('B3', 'Room Fire')} className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg text-left text-sm text-white group transition-colors">
                                                    <span className="font-mono font-bold text-orange-400">B3</span>
                                                    <span className="text-stone-300">Room Fire</span>
                                                </button>
                                                <button onClick={() => handleSelectClassification('B4', 'Roof Fire')} className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg text-left text-sm text-white group transition-colors">
                                                    <span className="font-mono font-bold text-orange-400">B4</span>
                                                    <span className="text-stone-300">Roof Fire</span>
                                                </button>
                                                <div className="my-1 border-t border-white/10" />
                                                {/* Medical */}
                                                <button onClick={() => handleSelectClassification('R2', 'CPR / Cardiac')} className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg text-left text-sm text-white group transition-colors">
                                                    <span className="font-mono font-bold text-blue-400">R2</span>
                                                    <span className="text-stone-300">CPR</span>
                                                </button>
                                                <button onClick={() => handleSelectClassification('R1', 'Unconscious')} className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg text-left text-sm text-white group transition-colors">
                                                    <span className="font-mono font-bold text-blue-400">R1</span>
                                                    <span className="text-stone-300">Unconscious</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* PRIO BOX */}
                                <div className="w-16 h-10 bg-surface border border-white/10 rounded-lg flex items-center justify-center font-mono font-bold text-lg text-white" title="Priority">
                                    {/* Mock Priority Logic based on Code, or default 1 */}
                                    {activeCall.code ? "1" : "-"}
                                </div>

                                {/* PERSONS COUNT INPUT */}
                                <div className="relative w-20 h-10">
                                    <input
                                        type="text"
                                        className="w-full h-full bg-surface border border-white/10 rounded-lg text-center font-mono font-bold text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 placeholder:text-stone-600 text-sm"
                                        placeholder="Pax"
                                        title="Number of affected persons"
                                        value={activeCall.affectedPersonCount || ''}
                                        onChange={(e) => handleChange('affectedPersonCount', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 5: NOTES --- */}
                <div className="bg-surface/50 rounded-xl border border-white/5 p-4">
                    <h3 className="text-xs font-bold text-textMuted uppercase mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                        <Info className="w-3.5 h-3.5" /> Additional Notes
                    </h3>
                    <textarea
                        className="w-full h-24 bg-surface border border-white/10 rounded-lg p-3 text-sm text-white resize-none focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none placeholder:text-stone-600"
                        placeholder="Free text usage for critical safety info, access codes, or complex situation reports..."
                        value={activeCall.notes || ''}
                        onChange={(e) => handleChange('notes', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};
