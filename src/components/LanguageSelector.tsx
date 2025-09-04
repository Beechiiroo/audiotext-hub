import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Languages, Globe } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const supportedLanguages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  disabled?: boolean;
}

const LanguageSelector = ({ selectedLanguage, onLanguageChange, disabled = false }: LanguageSelectorProps) => {
  const [autoDetect, setAutoDetect] = useState(true);

  const handleLanguageChange = (value: string) => {
    if (value === "auto") {
      setAutoDetect(true);
    } else {
      setAutoDetect(false);
    }
    onLanguageChange(value);
  };

  const selectedLang = supportedLanguages.find(lang => lang.code === selectedLanguage);

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          Language Settings
        </CardTitle>
        <CardDescription>
          Select the language of your video for better transcription accuracy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Transcription Language</label>
          <Select
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {selectedLanguage === "auto" ? (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Auto-detect language
                  </div>
                ) : selectedLang ? (
                  <div className="flex items-center gap-2">
                    <span>{selectedLang.flag}</span>
                    <span>{selectedLang.name}</span>
                    <span className="text-muted-foreground text-xs">({selectedLang.nativeName})</span>
                  </div>
                ) : (
                  "Select language"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Auto-detect language
                </div>
              </SelectItem>
              {supportedLanguages.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  <div className="flex items-center gap-2">
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                    <span className="text-muted-foreground text-xs">({language.nativeName})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {autoDetect && (
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary">Auto-detection enabled</p>
                <p className="text-muted-foreground">
                  The AI will automatically detect the spoken language in your video
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Popular Languages</h4>
          <div className="flex flex-wrap gap-2">
            {supportedLanguages.slice(0, 3).map((language) => (
              <Badge
                key={language.code}
                variant={selectedLanguage === language.code ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => !disabled && handleLanguageChange(language.code)}
              >
                <span className="mr-1">{language.flag}</span>
                {language.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;