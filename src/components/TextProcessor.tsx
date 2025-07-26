import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Languages, CheckCircle, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TextProcessor = () => {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Mock grammar correction function
  const correctGrammar = (text: string): string => {
    if (!text.trim()) return "";
    
    // Simple mock corrections for demo
    let corrected = text
      .replace(/\bi\b/g, "I")
      .replace(/\bdont\b/g, "don't")
      .replace(/\bcant\b/g, "can't")
      .replace(/\bwont\b/g, "won't")
      .replace(/\byour\b(?=\s+(welcome|right|wrong))/g, "you're")
      .replace(/\bits\b(?=\s+(a|an|the))/g, "it's")
      .replace(/([.!?])\s*([a-z])/g, (match, punct, letter) => punct + " " + letter.toUpperCase())
      .replace(/^([a-z])/, (match, letter) => letter.toUpperCase());
    
    return corrected;
  };

  // Mock translation function (English to Hindi)
  const translateToHindi = (text: string): string => {
    if (!text.trim()) return "";
    
    // Simple mock translations for demo
    const translations: { [key: string]: string } = {
      "hello": "नमस्ते",
      "world": "दुनिया",
      "good": "अच्छा",
      "morning": "सुबह",
      "evening": "शाम",
      "night": "रात",
      "thank you": "धन्यवाद",
      "welcome": "स्वागत",
      "please": "कृपया",
      "sorry": "माफ करें",
      "yes": "हाँ",
      "no": "नहीं",
      "water": "पानी",
      "food": "खाना",
      "house": "घर",
      "family": "परिवार",
      "friend": "दोस्त",
      "love": "प्यार",
      "happy": "खुश",
      "sad": "उदास"
    };

    let translated = text.toLowerCase();
    Object.entries(translations).forEach(([english, hindi]) => {
      const regex = new RegExp(`\\b${english}\\b`, "gi");
      translated = translated.replace(regex, hindi);
    });

    return translated || "Translation: " + text + " (Hindi translation would appear here)";
  };

  const processText = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const corrected = correctGrammar(inputText);
    const translated = translateToHindi(corrected);
    
    setCorrectedText(corrected);
    setTranslatedText(translated);
    setIsProcessing(false);
    
    toast({
      title: "Text processed successfully!",
      description: "Grammar corrected and translated to Hindi",
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `${type} copied!`,
        description: "Text copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Grammar Fixer & Language Translator
          </h1>
          <p className="text-muted-foreground text-lg">
            Perfect your text with AI-powered grammar correction and instant translation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="h-fit shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Wand2 className="w-5 h-5" />
                Input Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste or type your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[300px] resize-none border-border/50 focus:border-primary transition-colors"
              />
              <Button 
                onClick={processText}
                disabled={!inputText.trim() || isProcessing}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-md"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Fix Grammar & Translate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Grammar Correction */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-accent">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Grammar Corrected
                  </div>
                  {correctedText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(correctedText, "Corrected text")}
                      className="border-accent/30 hover:bg-accent/10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[150px] p-4 bg-accent-light/20 rounded-lg border border-accent/20">
                  {correctedText ? (
                    <p className="text-foreground leading-relaxed">{correctedText}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Corrected text will appear here...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Translation */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-primary">
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Hindi Translation
                  </div>
                  {translatedText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(translatedText, "Translation")}
                      className="border-primary/30 hover:bg-primary/10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[150px] p-4 bg-primary/5 rounded-lg border border-primary/20">
                  {translatedText ? (
                    <p className="text-foreground leading-relaxed text-lg font-medium">
                      {translatedText}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Hindi translation will appear here...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Perfect for Chrome extension integration • Real-time processing • Copy with one click
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextProcessor;