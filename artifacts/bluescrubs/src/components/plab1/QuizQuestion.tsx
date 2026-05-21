import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Controls - Translation and Voice */}
        <div className="flex justify-between items-start mb-4 gap-4">
          {/* Translation Controls */}
          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="flex items-center gap-3">
              <Languages className="w-4 h-4 text-blue-600" />
              <Switch
                checked={translateQuestions}
                onCheckedChange={setTranslateQuestions}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className="text-sm text-gray-700">Translate</span>
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
          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-green-600" />
              <Switch
                checked={speechEnabled}
                onCheckedChange={(checked) => {
                  setSpeechEnabled(checked);
                  if (!checked) stopSpeaking();
                }}
                className="data-[state=checked]:bg-green-600"
              />
              <span className="text-sm text-gray-700">Voice</span>
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
                              {isEnglish && <span className="text-xs text-blue-600">★</span>}
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

        {/* Clinical Scenario */}
        {currentQuestion.scenario && (
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">📋</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Clinical Scenario</h3>
                {(() => {
                  if (translateQuestions && selectedLanguage !== 'en' && translatedQ?.scenario) {
                    return (
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">English:</p>
                          <p className="text-gray-700 leading-relaxed">{currentQuestion.scenario}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded border border-blue-300">
                          <p className="text-xs text-blue-600 mb-1">Translation:</p>
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
                  <div className="bg-blue-100 p-3 rounded border border-blue-300">
                    <p className="text-xs text-blue-600 mb-1">Translation:</p>
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
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  showExplanation
                    ? isCorrectAnswer
                      ? 'border-green-500 bg-green-100 shadow-lg shadow-green-200'
                      : isIncorrectlySelected
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                    : isSelectedAnswer
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={index.toString()}
                  checked={selectedAnswer === index.toString()}
                  onChange={() => !showExplanation && onAnswerSelect(index.toString())}
                  disabled={showExplanation}
                  className="w-4 h-4 mr-3 text-blue-600"
                />

                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center mr-3 font-bold text-sm">
                  {String.fromCharCode(65 + index)}
                </div>

                <div className="flex-1">
                  {(() => {
                    if (translateQuestions && selectedLanguage !== 'en' && translatedQ?.options) {
                      return (
                        <div className="space-y-2">
                          {showExplanation && isCorrectAnswer && (
                            <span className="inline-flex items-center gap-1 mb-2">
                              <span className="text-green-700 font-bold text-lg">✓ CORRECT:</span>
                            </span>
                          )}
                          {showExplanation && isIncorrectlySelected && (
                            <span className="inline-flex items-center gap-1 mb-2">
                              <span className="text-red-600 font-bold">✗ YOUR CHOICE:</span>
                            </span>
                          )}
                          <div className="bg-white/70 p-2 rounded border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">English:</p>
                            <span className={`text-base leading-relaxed ${
                              showExplanation && isCorrectAnswer
                                ? 'text-green-900 font-bold'
                                : showExplanation && isIncorrectlySelected
                                ? 'text-red-800'
                                : 'text-gray-800'
                            }`}>
                              {originalOption}
                            </span>
                          </div>
                          <div className="bg-blue-50 p-2 rounded border border-blue-200">
                            <p className="text-xs text-blue-600 mb-1">Translation:</p>
                            <span className={`text-base leading-relaxed ${
                              showExplanation && isCorrectAnswer
                                ? 'text-green-900 font-bold'
                                : showExplanation && isIncorrectlySelected
                                ? 'text-red-800'
                                : 'text-gray-800'
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
                          ? 'text-green-900 font-bold'
                          : showExplanation && isIncorrectlySelected
                          ? 'text-red-800'
                          : 'text-gray-800'
                      }`}>
                        {showExplanation && isCorrectAnswer && (
                          <span className="inline-flex items-center gap-1 mr-2">
                            <span className="text-green-700 font-bold text-lg">✓ CORRECT:</span>
                          </span>
                        )}
                        {showExplanation && isIncorrectlySelected && (
                          <span className="inline-flex items-center gap-1 mr-2">
                            <span className="text-red-600 font-bold">✗ YOUR CHOICE:</span>
                          </span>
                        )}
                        <span className={showExplanation && isCorrectAnswer ? 'text-green-900 font-bold' : ''}>
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
                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 ml-2"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                )}

                {showExplanation && isCorrectAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                )}
                {showExplanation && isIncorrectlySelected && (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
                )}
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
