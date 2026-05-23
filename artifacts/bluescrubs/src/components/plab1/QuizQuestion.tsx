import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Volume2, Languages } from "lucide-react";

interface QuizQuestionProps {
  currentQuestion: any;
  selectedAnswer: string;
  showExplanation: boolean;
  translateQuestions: boolean;
  setTranslateQuestions: (v: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (v: string) => void;
  translatedQuestions: Record<string, any>;
  speechEnabled: boolean;
  setSpeechEnabled: (v: boolean) => void;
  selectedVoice: string;
  setSelectedVoice: (v: string) => void;
  availableVoices: SpeechSynthesisVoice[];
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  speakCurrentQuestion: () => void;
  onAnswerSelect: (answer: string) => void;
}

export function QuizQuestion({
  currentQuestion,
  selectedAnswer,
  showExplanation,
  translateQuestions,
  setTranslateQuestions,
  selectedLanguage,
  setSelectedLanguage,
  translatedQuestions,
  speechEnabled,
  setSpeechEnabled,
  selectedVoice,
  setSelectedVoice,
  availableVoices,
  isSpeaking,
  speakText,
  stopSpeaking,
  speakCurrentQuestion,
  onAnswerSelect,
}: QuizQuestionProps) {
  const cacheKey = `${currentQuestion.id}_${selectedLanguage}`;
  const translatedQ = translatedQuestions[cacheKey];

  let correctAnswerIndex = currentQuestion.correctAnswer ?? currentQuestion.correct_answer ?? currentQuestion.answer;
  if (typeof correctAnswerIndex === 'string') {
    correctAnswerIndex = correctAnswerIndex.charCodeAt(0) - 65;
  }

  const getOptions = (): string[] => {
    if (translateQuestions && selectedLanguage !== 'en' && translatedQ?.options) {
      return Array.isArray(translatedQ.options) ? translatedQ.options : Object.values(translatedQ.options);
    }
    if (currentQuestion.options) {
      if (Array.isArray(currentQuestion.options)) return currentQuestion.options;
      if (typeof currentQuestion.options === 'object') return Object.values(currentQuestion.options);
    }
    return [];
  };

  const options = getOptions();

  return (
    <Card className="mb-6 rounded-2xl border-slate-200">
      <CardContent className="p-6">
        {/* Controls - Translation and Voice */}
        <div className="flex justify-between items-start mb-4 gap-4 flex-wrap">
          {/* Translation Controls */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={translateQuestions}
                aria-label="Toggle translation"
                onClick={() => setTranslateQuestions(!translateQuestions)}
                className={`inline-flex items-center gap-2 h-9 px-3 rounded-full text-sm font-semibold border transition-colors ${
                  translateQuestions
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : 'bg-white border-slate-300 text-slate-600 hover:border-teal-400'
                }`}
                data-testid="toggle-translate"
              >
                <Languages className="w-4 h-4" />
                Translate
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                  translateQuestions ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {translateQuestions ? 'ON' : 'OFF'}
                </span>
              </button>
              {translateQuestions && (
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-36 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 overflow-y-auto">
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="ar">🇸🇦 Arabic</SelectItem>
                    <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
                    <SelectItem value="ur">🇵🇰 Urdu</SelectItem>
                    <SelectItem value="bn">🇧🇩 Bengali</SelectItem>
                    <SelectItem value="ta">🇮🇳 Tamil</SelectItem>
                    <SelectItem value="te">🇮🇳 Telugu</SelectItem>
                    <SelectItem value="gu">🇮🇳 Gujarati</SelectItem>
                    <SelectItem value="mr">🇮🇳 Marathi</SelectItem>
                    <SelectItem value="pa">🇮🇳 Punjabi</SelectItem>
                    <SelectItem value="kn">🇮🇳 Kannada</SelectItem>
                    <SelectItem value="ml">🇮🇳 Malayalam</SelectItem>
                    <SelectItem value="ne">🇳🇵 Nepali</SelectItem>
                    <SelectItem value="si">🇱🇰 Sinhala</SelectItem>
                    <SelectItem value="my">🇲🇲 Myanmar</SelectItem>
                    <SelectItem value="th">🇹🇭 Thai</SelectItem>
                    <SelectItem value="vi">🇻🇳 Vietnamese</SelectItem>
                    <SelectItem value="id">🇮🇩 Indonesian</SelectItem>
                    <SelectItem value="ms">🇲🇾 Malay</SelectItem>
                    <SelectItem value="tl">🇵🇭 Filipino</SelectItem>
                    <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                    <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                    <SelectItem value="ko">🇰🇷 Korean</SelectItem>
                    <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                    <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
                    <SelectItem value="fr">🇫🇷 French</SelectItem>
                    <SelectItem value="de">🇩🇪 German</SelectItem>
                    <SelectItem value="it">🇮🇹 Italian</SelectItem>
                    <SelectItem value="ru">🇷🇺 Russian</SelectItem>
                    <SelectItem value="tr">🇹🇷 Turkish</SelectItem>
                    <SelectItem value="fa">🇮🇷 Persian</SelectItem>
                    <SelectItem value="ps">🇦🇫 Pashto</SelectItem>
                    <SelectItem value="sw">🇰🇪 Swahili</SelectItem>
                    <SelectItem value="am">🇪🇹 Amharic</SelectItem>
                    <SelectItem value="ha">🇳🇬 Hausa</SelectItem>
                    <SelectItem value="yo">🇳🇬 Yoruba</SelectItem>
                    <SelectItem value="ig">🇳🇬 Igbo</SelectItem>
                    <SelectItem value="zu">🇿🇦 Zulu</SelectItem>
                    <SelectItem value="af">🇿🇦 Afrikaans</SelectItem>
                    <SelectItem value="nl">🇳🇱 Dutch</SelectItem>
                    <SelectItem value="pl">🇵🇱 Polish</SelectItem>
                    <SelectItem value="cs">🇨🇿 Czech</SelectItem>
                    <SelectItem value="hu">🇭🇺 Hungarian</SelectItem>
                    <SelectItem value="ro">🇷🇴 Romanian</SelectItem>
                    <SelectItem value="bg">🇧🇬 Bulgarian</SelectItem>
                    <SelectItem value="hr">🇭🇷 Croatian</SelectItem>
                    <SelectItem value="sr">🇷🇸 Serbian</SelectItem>
                    <SelectItem value="sl">🇸🇮 Slovenian</SelectItem>
                    <SelectItem value="el">🇬🇷 Greek</SelectItem>
                    <SelectItem value="he">🇮🇱 Hebrew</SelectItem>
                    <SelectItem value="uk">🇺🇦 Ukrainian</SelectItem>
                    <SelectItem value="ka">🇬🇪 Georgian</SelectItem>
                    <SelectItem value="hy">🇦🇲 Armenian</SelectItem>
                    <SelectItem value="az">🇦🇿 Azerbaijani</SelectItem>
                    <SelectItem value="kk">🇰🇿 Kazakh</SelectItem>
                    <SelectItem value="uz">🇺🇿 Uzbek</SelectItem>
                    <SelectItem value="mn">🇲🇳 Mongolian</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Voice Controls */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={speechEnabled}
                aria-label="Toggle voice reading"
                onClick={() => {
                  const next = !speechEnabled;
                  setSpeechEnabled(next);
                  if (!next) stopSpeaking();
                }}
                className={`inline-flex items-center gap-2 h-9 px-3 rounded-full text-sm font-semibold border transition-colors ${
                  speechEnabled
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : 'bg-white border-slate-300 text-slate-600 hover:border-teal-400'
                }`}
                data-testid="toggle-voice"
              >
                <Volume2 className="w-4 h-4" />
                Voice
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                  speechEnabled ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {speechEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
              {speechEnabled && (
                <>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="w-48 h-8 text-xs">
                      <SelectValue placeholder="Select Voice" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto">
                      {availableVoices.map((voice) => {
                        const isEnglish = voice.lang.startsWith('en');
                        const countryCode = voice.lang.split('-')[1] || '';
                        const flagEmoji = ({
                          'US': '🇺🇸', 'GB': '🇬🇧', 'AU': '🇦🇺', 'CA': '🇨🇦',
                          'AR': '🇸🇦', 'ES': '🇪🇸', 'FR': '🇫🇷', 'DE': '🇩🇪',
                          'IT': '🇮🇹', 'PT': '🇵🇹', 'RU': '🇷🇺', 'CN': '🇨🇳',
                          'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳'
                        } as Record<string, string>)[countryCode] || '🌐';
                        const voiceName = voice.name.length > 20
                          ? voice.name.substring(0, 17) + '...'
                          : voice.name;
                        return (
                          <SelectItem key={voice.name} value={voice.name}>
                            <div className="flex items-center gap-2">
                              <span>{flagEmoji}</span>
                              <span className="text-xs">{voiceName}</span>
                              {isEnglish && <span className="text-xs text-teal-600">★</span>}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant={isSpeaking ? "destructive" : "default"}
                    onClick={isSpeaking ? stopSpeaking : speakCurrentQuestion}
                    className="h-8 px-2"
                  >
                    {isSpeaking ? "Stop" : "Play"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Clinical Image (dermatology spot diagnosis) */}
        {currentQuestion.imageUrl && (
          <div className="mb-5 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clinical Image</span>
            </div>
            <img
              src={currentQuestion.imageUrl}
              alt={`Clinical image: ${currentQuestion.title || currentQuestion.topic || 'dermatology'}`}
              className="w-full max-h-72 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Clinical Scenario */}
        {currentQuestion.scenario && (
          <div className="mb-6 bg-teal-50/70 rounded-2xl p-4 border border-teal-100">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">📋</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-teal-900 mb-2">Clinical Scenario</h3>
                {(() => {
                  if (translateQuestions && selectedLanguage !== 'en' && translatedQ?.scenario) {
                    return (
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">English:</p>
                          <p className="text-gray-700 leading-relaxed">{currentQuestion.scenario}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-teal-200">
                          <p className="text-xs text-teal-700 mb-1 font-semibold">Translation</p>
                          <p className="text-gray-700 leading-relaxed">{translatedQ.scenario}</p>
                        </div>
                      </div>
                    );
                  }
                  return <p className="text-gray-700 leading-relaxed">{currentQuestion.scenario}</p>;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Question */}
        <div className="mb-6">
          {(() => {
            if (translateQuestions && selectedLanguage !== 'en' && translatedQ?.question) {
              return (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">English:</p>
                    <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {currentQuestion.question || currentQuestion.stem}
                    </h2>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-teal-200">
                    <p className="text-xs text-teal-700 mb-1 font-semibold">Translation</p>
                    <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {translatedQ.question}
                    </h2>
                  </div>
                </div>
              );
            }
            return (
              <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
                {currentQuestion.question || currentQuestion.stem}
              </h2>
            );
          })()}
        </div>

        {/* Answer Options */}
        <div className="space-y-2 mb-8">
          {options.map((option: string, index: number) => {
            const isCorrectAnswer = index === correctAnswerIndex;
            const isSelectedAnswer = selectedAnswer === index.toString();
            const isIncorrectlySelected = showExplanation && isSelectedAnswer && !isCorrectAnswer;
            const originalOptions = Array.isArray(currentQuestion.options)
              ? currentQuestion.options
              : Object.values(currentQuestion.options || {});
            const originalOption = originalOptions[index];

            return (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                  showExplanation
                    ? isCorrectAnswer
                      ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-100'
                      : isIncorrectlySelected
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-slate-200 bg-slate-50 opacity-60'
                    : isSelectedAnswer
                    ? 'border-teal-500 bg-teal-50 shadow-sm shadow-teal-100'
                    : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/40'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={index.toString()}
                  checked={selectedAnswer === index.toString()}
                  onChange={() => !showExplanation && onAnswerSelect(index.toString())}
                  disabled={showExplanation}
                  className="w-4 h-4 mr-3 accent-teal-600"
                />

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-sm transition-colors ${
                    showExplanation && isCorrectAnswer
                      ? 'bg-teal-600 text-white'
                      : showExplanation && isIncorrectlySelected
                      ? 'bg-rose-500 text-white'
                      : isSelectedAnswer
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>

                <div className="flex-1">
                  {(() => {
                    if (translateQuestions && selectedLanguage !== 'en' && translatedQ?.options) {
                      return (
                        <div className="space-y-2">
                          {showExplanation && isCorrectAnswer && (
                            <span className="inline-flex items-center gap-1 mb-2">
                              <span className="text-teal-700 font-bold text-sm">✓ Correct</span>
                            </span>
                          )}
                          {showExplanation && isIncorrectlySelected && (
                            <span className="inline-flex items-center gap-1 mb-2">
                              <span className="text-rose-600 font-bold text-sm">✗ Your choice</span>
                            </span>
                          )}
                          <div className="bg-white/70 p-2 rounded border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">English:</p>
                            <span className={`text-base leading-relaxed ${
                              showExplanation && isCorrectAnswer
                                ? 'text-teal-900 font-bold'
                                : showExplanation && isIncorrectlySelected
                                ? 'text-rose-800'
                                : 'text-slate-800'
                            }`}>
                              {originalOption}
                            </span>
                          </div>
                          <div className="bg-teal-50 p-2 rounded-lg border border-teal-200">
                            <p className="text-xs text-teal-700 mb-1 font-semibold">Translation</p>
                            <span className={`text-base leading-relaxed ${
                              showExplanation && isCorrectAnswer
                                ? 'text-teal-900 font-bold'
                                : showExplanation && isIncorrectlySelected
                                ? 'text-rose-800'
                                : 'text-slate-800'
                            }`}>
                              {option}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <span className={`text-base leading-relaxed ${
                        showExplanation && isCorrectAnswer
                          ? 'text-teal-900 font-bold'
                          : showExplanation && isIncorrectlySelected
                          ? 'text-rose-800'
                          : 'text-slate-800'
                      }`}>
                        {showExplanation && isCorrectAnswer && (
                          <span className="inline-flex items-center gap-1 mr-2">
                            <span className="text-teal-700 font-bold text-sm">✓ Correct</span>
                          </span>
                        )}
                        {showExplanation && isIncorrectlySelected && (
                          <span className="inline-flex items-center gap-1 mr-2">
                            <span className="text-rose-600 font-bold text-sm">✗ Your choice</span>
                          </span>
                        )}
                        <span className={showExplanation && isCorrectAnswer ? 'text-teal-900 font-bold' : ''}>
                          {option}
                        </span>
                      </span>
                    );
                  })()}
                </div>

                {speechEnabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(option);
                    }}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-teal-600 ml-2"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                )}

                {showExplanation && isCorrectAnswer && (
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 ml-2" />
                )}
                {showExplanation && isIncorrectlySelected && (
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 ml-2" />
                )}
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
