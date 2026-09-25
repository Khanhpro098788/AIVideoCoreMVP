import { useState } from 'react';
import {
  Plus, FileText, Users, Film, Save, Eye, Play, Trash2,
  Mic, Upload, Music, ChevronRight, ChevronLeft, Clapperboard,
  Image as ImageIcon, Volume2, Clock, Sparkles, Check,
} from 'lucide-react';
import { useI18n } from '@/i18nContext';
import { NeonButton, Input, Textarea, Select, GlassCard, PageHeader } from '@/components/ui';
import { sampleDrafts, bgmTracks, durationOptions, type Draft, type Character, type Scene } from '@/data';

type Step = 0 | 1 | 2 | 3;

export function CreatePage() {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>(0);
  const [drafts, setDrafts] = useState<Draft[]>(sampleDrafts);

  // Step 1
  const [projectName, setProjectName] = useState('');
  const [projectDuration, setProjectDuration] = useState('5 min');
  const [mainCount, setMainCount] = useState(2);
  const [supportingCount, setSupportingCount] = useState(1);

  // Step 2
  const [mainChars, setMainChars] = useState<Character[]>([]);
  const [supportingChars, setSupportingChars] = useState<Character[]>([]);

  // Step 3
  const [scenes, setScenes] = useState<Scene[]>([
    { id: 's1', background: '', bgm: '', dialogues: [] },
  ]);

  const startNewProject = () => {
    setProjectName('');
    setProjectDuration('5 min');
    setMainCount(2);
    setSupportingCount(1);
    setMainChars([]);
    setSupportingChars([]);
    setScenes([{ id: 's1', background: '', bgm: '', dialogues: [] }]);
    setStep(1);
  };

  const goToCasting = () => {
    const main = Array.from({ length: mainCount }, (_, i) =>
      mainChars[i] || { id: `m${i}`, name: '', avatar: '', description: '', type: 'main' as const }
    );
    const supp = Array.from({ length: supportingCount }, (_, i) =>
      supportingChars[i] || { id: `s${i}`, name: '', avatar: '', description: '', type: 'supporting' as const }
    );
    setMainChars(main);
    setSupportingChars(supp);
    setStep(2);
  };

  const goToEditor = () => setStep(3);

  const updateChar = (type: 'main' | 'supporting', idx: number, field: keyof Character, value: string) => {
    const setter = type === 'main' ? setMainChars : setSupportingChars;
    const list = type === 'main' ? mainChars : supportingChars;
    const next = [...list];
    next[idx] = { ...next[idx], [field]: value };
    setter(next);
  };

  const addScene = () => {
    setScenes([...scenes, { id: `s${Date.now()}`, background: '', bgm: '', dialogues: [] }]);
  };

  const removeScene = (id: string) => {
    setScenes(scenes.filter((s) => s.id !== id));
  };

  const updateScene = (id: string, field: keyof Scene, value: string) => {
    setScenes(scenes.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addDialogue = (sceneId: string) => {
    setScenes(scenes.map((s) => {
      if (s.id !== sceneId) return s;
      return { ...s, dialogues: [...s.dialogues, { id: `d${Date.now()}`, characterId: '', text: '', audioType: 'none' }] };
    }));
  };

  const updateDialogue = (sceneId: string, dialogueId: string, field: string, value: string) => {
    setScenes(scenes.map((s) => {
      if (s.id !== sceneId) return s;
      return {
        ...s,
        dialogues: s.dialogues.map((d) => (d.id === dialogueId ? { ...d, [field]: value } : d)),
      };
    }));
  };

  const removeDialogue = (sceneId: string, dialogueId: string) => {
    setScenes(scenes.map((s) => {
      if (s.id !== sceneId) return s;
      return { ...s, dialogues: s.dialogues.filter((d) => d.id !== dialogueId) };
    }));
  };

  const saveDraft = () => {
    const newDraft: Draft = {
      id: `d${Date.now()}`,
      name: projectName || 'Untitled Project',
      updatedAt: 'just now',
      progress: step === 3 ? 75 : step === 2 ? 50 : step === 1 ? 25 : 0,
      scenes: scenes.length,
    };
    setDrafts([newDraft, ...drafts]);
    setStep(0);
  };

  const allChars = [...mainChars, ...supportingChars];

  return (
    <div className="min-h-screen">
      <PageHeader
        title={t('createStudio')}
        subtitle={step === 0 ? undefined : `${projectName || 'Untitled'} · Step ${step} of 3`}
        action={step > 0 && step < 3 ? (
          <div className="flex items-center gap-2">
            <NeonButton variant="ghost" size="sm" onClick={() => setStep((Math.max(0, step - 1)) as Step)}>
              <ChevronLeft size={16} /> {t('back')}
            </NeonButton>
            <NeonButton variant="ghost" size="sm" onClick={saveDraft}>
              <Save size={16} /> {t('saveDraft')}
            </NeonButton>
          </div>
        ) : undefined}
      />

      {/* Step 0: Dashboard */}
      {step === 0 && (
        <div className="animate-fade-up">
          {/* New project hero */}
          <div
            onClick={startNewProject}
            className="relative overflow-hidden rounded-2xl glass p-8 mb-8 cursor-pointer group hover:border-teal/30 transition-smooth"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal/10 rounded-full blur-3xl group-hover:bg-teal/20 transition-smooth" />
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal/10 rounded-full text-xs text-teal mb-3">
                  <Sparkles size={12} /> New
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{t('newProject')}</h2>
                <p className="text-sm text-white/40">Start from scratch and let AI bring your vision to life</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal to-teal-glow flex items-center justify-center group-hover:scale-110 transition-smooth">
                <Plus size={24} className="text-ink-950" />
              </div>
            </div>
          </div>

          {/* Drafts */}
          <div className="mb-4 flex items-center gap-2">
            <FileText size={16} className="text-white/40" />
            <span className="text-sm text-white/50 uppercase tracking-wider">{t('drafts')}</span>
          </div>

          {drafts.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Clapperboard size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">{t('noDrafts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((draft) => (
                <GlassCard key={draft.id} className="p-5 hover:border-teal/20 transition-smooth cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-ink-700 flex items-center justify-center">
                      <Film size={18} className="text-teal" />
                    </div>
                    <span className="text-xs text-white/30">{draft.updatedAt}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-teal transition-smooth">{draft.name}</h3>
                  <div className="text-xs text-white/40 mb-3">{draft.scenes} scenes · {draft.progress}% complete</div>
                  <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal to-teal-glow" style={{ width: `${draft.progress}%` }} />
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 1: Setup */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto animate-fade-up">
          <StepHeader step={1} title="Project Setup" icon={FileText} />
          <GlassCard className="p-8 space-y-6">
            <Input
              label={t('projectName')}
              value={projectName}
              onChange={setProjectName}
              placeholder="My Cinematic Masterpiece"
              required
            />
            <Select
              label={t('projectDuration')}
              value={projectDuration}
              onChange={setProjectDuration}
              options={durationOptions}
            />
            <div className="grid grid-cols-2 gap-4">
              <Counter
                label={t('mainCharacters')}
                value={mainCount}
                onChange={setMainCount}
                min={0}
                max={10}
              />
              <Counter
                label={t('supportingCharacters')}
                value={supportingCount}
                onChange={setSupportingCount}
                min={0}
                max={10}
              />
            </div>
            <div className="flex justify-end pt-2">
              <NeonButton variant="teal" size="lg" onClick={goToCasting}>
                {t('next')} <ChevronRight size={18} />
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Step 2: Casting */}
      {step === 2 && (
        <div className="max-w-4xl mx-auto animate-fade-up">
          <StepHeader step={2} title={t('casting')} icon={Users} />
          <div className="space-y-6">
            {/* Main characters */}
            {mainChars.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-teal rounded-full" />
                  <span className="text-sm font-medium text-white">{t('mainCharacters')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mainChars.map((char, idx) => (
                    <CharacterSlot
                      key={char.id}
                      char={char}
                      index={idx}
                      type="main"
                      onUpdate={(field, val) => updateChar('main', idx, field, val)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Supporting characters */}
            {supportingChars.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-violet rounded-full" />
                  <span className="text-sm font-medium text-white">{t('supportingCharacters')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportingChars.map((char, idx) => (
                    <CharacterSlot
                      key={char.id}
                      char={char}
                      index={idx}
                      type="supporting"
                      onUpdate={(field, val) => updateChar('supporting', idx, field, val)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <NeonButton variant="ghost" size="lg" onClick={() => setStep(1)}>
                <ChevronLeft size={18} /> {t('back')}
              </NeonButton>
              <NeonButton variant="teal" size="lg" onClick={goToEditor}>
                {t('next')} <ChevronRight size={18} />
              </NeonButton>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Video Editor */}
      {step === 3 && (
        <div className="animate-fade-up">
          <StepHeader step={3} title={t('videoEditor')} icon={Film} />

          <div className="space-y-4">
            {scenes.map((scene, idx) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                index={idx}
                characters={allChars.filter((c) => c.name)}
                onUpdate={(field, val) => updateScene(scene.id, field, val)}
                onAddDialogue={() => addDialogue(scene.id)}
                onUpdateDialogue={(dId, field, val) => updateDialogue(scene.id, dId, field, val)}
                onRemoveDialogue={(dId) => removeDialogue(scene.id, dId)}
                onRemove={() => removeScene(scene.id)}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-center gap-3 p-4 glass-strong rounded-2xl">
            <NeonButton variant="ghost" size="md" onClick={() => setStep(2)}>
              <ChevronLeft size={16} /> {t('back')}
            </NeonButton>
            <NeonButton variant="outline" size="md" onClick={addScene}>
              <Plus size={16} /> {t('addScene')}
            </NeonButton>
            <NeonButton variant="ghost" size="md" onClick={saveDraft}>
              <Save size={16} /> {t('saveDraft')}
            </NeonButton>
            <NeonButton variant="violet" size="md">
              <Eye size={16} /> {t('previewAll')}
            </NeonButton>
            <NeonButton variant="flame" size="md">
              <Play size={16} /> {t('renderMovie')}
            </NeonButton>
          </div>
        </div>
      )}
    </div>
  );
}

function StepHeader({ step, title, icon: Icon }: { step: number; title: string; icon: typeof Film }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 border border-teal/30 flex items-center justify-center">
        <Icon size={18} className="text-teal" />
      </div>
      <div>
        <div className="text-xs text-teal font-mono uppercase tracking-wider">Step {step}</div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
    </div>
  );
}

function Counter({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-3 bg-ink-800/60 border border-white/10 rounded-xl p-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-lg bg-ink-700 text-white/60 hover:text-white hover:bg-ink-600 transition-smooth flex items-center justify-center"
        >
          –
        </button>
        <span className="flex-1 text-center text-lg font-bold text-white">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-lg bg-ink-700 text-white/60 hover:text-white hover:bg-ink-600 transition-smooth flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

function CharacterSlot({ char, index, type, onUpdate }: { char: Character; index: number; type: 'main' | 'supporting'; onUpdate: (field: keyof Character, val: string) => void }) {
  const { t } = useI18n();
  const [recording, setRecording] = useState(false);
  const isMain = type === 'main';
  const accentBg = isMain ? 'bg-teal/10 border-teal/20' : 'bg-violet/10 border-violet/20';
  const accentText = isMain ? 'text-teal' : 'text-violet';
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex items-center gap-5 mb-5">
        <div className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center overflow-hidden ${accentBg}`}>
          {char.avatar ? (
            <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
          ) : (
            <Users size={32} className={accentText} />
          )}
        </div>
        <div className="flex-1">
          <div className={`text-sm ${accentText} mb-2`}>{isMain ? 'Main' : 'Supporting'} #{index + 1}</div>
          <input
            value={char.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="Character name"
            className="w-full bg-transparent text-lg font-medium text-white placeholder:text-white/25 outline-none border-b border-white/10 focus:border-teal/50 transition-smooth pb-1"
          />
        </div>
      </div>
      <Textarea
        value={char.description}
        onChange={(v) => onUpdate('description', v)}
        placeholder="Describe the character's personality, appearance, role..."
        rows={3}
      />
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => {
            setRecording(!recording);
            if (!recording) {
              setTimeout(() => {
                onUpdate('voiceType', 'recorded');
                onUpdate('voiceName', 'voice_recording.wav');
                setRecording(false);
              }, 2000);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-smooth ${
            recording
              ? 'bg-red-500/20 text-red-400 animate-pulse'
              : char.voiceType === 'recorded'
              ? 'bg-teal/15 text-teal'
              : 'bg-white/5 text-white/50 hover:text-white'
          }`}
        >
          <Mic size={12} />
          {recording ? 'Recording...' : (t('voiceRecord') || 'Voice Record')}
        </button>
        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 text-white/50 hover:text-white cursor-pointer transition-smooth">
          <Upload size={12} />
          {t('audioUpload') || 'Upload Audio'}
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onUpdate('voiceType', 'uploaded');
                onUpdate('voiceName', file.name);
              }
            }}
          />
        </label>
        {char.voiceName && (
          <span className="flex items-center gap-1 text-xs text-teal ml-auto">
            <Check size={12} /> {char.voiceName}
          </span>
        )}
      </div>
    </GlassCard>
  );
}

function SceneCard({
  scene, index, characters, onUpdate, onAddDialogue, onUpdateDialogue, onRemoveDialogue, onRemove,
}: {
  scene: Scene;
  index: number;
  characters: Character[];
  onUpdate: (field: keyof Scene, val: string) => void;
  onAddDialogue: () => void;
  onUpdateDialogue: (id: string, field: string, val: string) => void;
  onRemoveDialogue: (id: string) => void;
  onRemove: () => void;
}) {
  const { t } = useI18n();
  const [recording, setRecording] = useState<string | null>(null);

  return (
    <GlassCard className="overflow-hidden">
      {/* Scene header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-ink-850/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal/15 text-teal text-sm font-bold flex items-center justify-center">
            {index + 1}
          </div>
          <span className="text-sm font-medium text-white">Scene {index + 1}</span>
        </div>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-smooth"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Background + BGM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            label={t('background')}
            value={scene.background}
            onChange={(v) => onUpdate('background', v)}
            placeholder={t('selectBg')}
            rows={2}
          />
          <div>
            <Select
              label={t('bgm')}
              value={scene.bgm}
              onChange={(v) => onUpdate('bgm', v)}
              options={[{ value: '', label: `— ${t('selectBgm')} —` }, ...bgmTracks.map((t) => ({ value: t.id, label: `${t.title} — ${t.artist}` }))]}
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  setRecording(recording === 'bgm' ? null : 'bgm');
                  if (recording !== 'bgm') {
                    setTimeout(() => {
                      onUpdate('bgmType', 'recorded');
                      onUpdate('bgmName', 'bgm_recording.wav');
                      setRecording(null);
                    }, 2000);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-smooth ${
                  recording === 'bgm'
                    ? 'bg-red-500/20 text-red-400 animate-pulse'
                    : scene.bgmType === 'recorded'
                    ? 'bg-teal/15 text-teal'
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                <Mic size={12} />
                {recording === 'bgm' ? 'Recording...' : (t('voiceRecord') || 'Voice Record')}
              </button>
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 text-white/50 hover:text-white cursor-pointer transition-smooth">
                <Upload size={12} />
                {t('audioUpload') || 'Upload Audio'}
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onUpdate('bgmType', 'uploaded');
                      onUpdate('bgmName', file.name);
                    }
                  }}
                />
              </label>
              {scene.bgmName && (
                <span className="flex items-center gap-1 text-xs text-teal ml-auto">
                  <Check size={12} /> {scene.bgmName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dialogues */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-teal" />
              <span className="text-xs text-white/50 uppercase tracking-wider">{t('dialogue')}</span>
            </div>
            <button
              onClick={onAddDialogue}
              className="flex items-center gap-1 text-xs text-teal hover:text-teal-glow transition-smooth"
            >
              <Plus size={12} /> Add Line
            </button>
          </div>

          <div className="space-y-3">
            {scene.dialogues.length === 0 && (
              <div className="text-center py-6 text-sm text-white/30 border border-dashed border-white/10 rounded-xl">
                No dialogue yet. Click "Add Line" to create one.
              </div>
            )}
            {scene.dialogues.map((d) => (
              <div key={d.id} className="bg-ink-850/50 border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <select
                    value={d.characterId}
                    onChange={(e) => onUpdateDialogue(d.id, 'characterId', e.target.value)}
                    className="flex-1 bg-ink-800/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Select character</option>
                    {characters.map((c) => (
                      <option key={c.id} value={c.id} className="bg-ink-850">{c.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => onRemoveDialogue(d.id)}
                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-smooth"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <textarea
                  value={d.text}
                  onChange={(e) => onUpdateDialogue(d.id, 'text', e.target.value)}
                  placeholder="Enter dialogue text..."
                  rows={2}
                  className="w-full bg-ink-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none resize-none focus-ring"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRecording(recording === d.id ? null : d.id);
                      if (recording !== d.id) {
                        setTimeout(() => {
                          onUpdateDialogue(d.id, 'audioType', 'recorded');
                          onUpdateDialogue(d.id, 'audioName', 'voice_recording.wav');
                          setRecording(null);
                        }, 2000);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-smooth ${
                      recording === d.id
                        ? 'bg-red-500/20 text-red-400 animate-pulse'
                        : d.audioType === 'recorded'
                        ? 'bg-teal/15 text-teal'
                        : 'bg-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    <Mic size={12} />
                    {recording === d.id ? 'Recording...' : t('voiceRecord')}
                  </button>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 text-white/50 hover:text-white cursor-pointer transition-smooth">
                    <Upload size={12} />
                    {t('audioUpload')}
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onUpdateDialogue(d.id, 'audioType', 'uploaded');
                          onUpdateDialogue(d.id, 'audioName', file.name);
                        }
                      }}
                    />
                  </label>
                  {d.audioName && (
                    <span className="flex items-center gap-1 text-xs text-teal">
                      <Check size={12} /> {d.audioName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scene preview */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={14} className="text-violet" />
            <span className="text-xs text-white/50 uppercase tracking-wider">{t('scenePreview')}</span>
          </div>
          <div className="aspect-video rounded-xl bg-ink-850 border border-white/5 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 mesh-grid opacity-30" />
            <div className="text-center relative z-10">
              <Play size={32} className="text-white/20 mx-auto mb-2" />
              <p className="text-xs text-white/30">AI preview will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
