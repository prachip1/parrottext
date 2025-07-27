import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { grammarCorrect } from "@/lib/grammarCorrect";
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

  // ...existing code...

  // Real-time grammar correction and translation
  useEffect(() => {
    let ignore = false;
    const handler = setTimeout(() => {
      const runAsync = async () => {
        if (!inputText.trim()) {
          setCorrectedText("");
          setTranslatedText("");
          return;
        }
        setIsProcessing(true);
        try {
          const corrected = await grammarCorrect(inputText);
          if (!ignore) setCorrectedText(corrected);
          const translated = await translateToHindi(corrected);
          if (!ignore) setTranslatedText(translated);
        } catch {
          if (!ignore) {
            setCorrectedText("Grammar correction failed. Please try again.");
            setTranslatedText("Translation failed. Please try again. (अनुवाद में त्रुटि हुई है)");
          }
        } finally {
          if (!ignore) setIsProcessing(false);
        }
      };
      runAsync();
    }, 1200); // 1200ms debounce
    return () => {
      ignore = true;
      clearTimeout(handler);
    };
  }, [inputText]);

  // Translation function using MyMemory API (free)
  const translateToHindi = async (text: string): Promise<string> => {
    if (!text.trim()) return "";
    
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`
      );
      
      if (!response.ok) {
        throw new Error('Translation API failed');
      }
      
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        return data.responseData.translatedText;
      } else {
        throw new Error('Invalid response from translation API');
      }
    } catch (error) {
      console.error('Translation error:', error);
      return `Translation failed. Please try again. (अनुवाद में त्रुटि हुई है)`;
    }
  };

  const processText = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      const corrected = await grammarCorrect(inputText);
      const translated = await translateToHindi(corrected);
      setCorrectedText(corrected);
      setTranslatedText(translated);
      toast({
        title: "Text processed successfully!",
        description: "Grammar corrected and translated to Hindi",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
          <h1 className="text-gray-800 text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Grammar Fixer & Language Translator
          </h1>
          <p className="text-muted-foreground text-lg text-gray-800">
            Perfect your text with AI-powered grammar correction and instant translation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="h-fit shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-primary text-gray-800">
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
                className="text-gray-100 w-full bg-indigo-900 hover:opacity-90 transition-all duration-300 shadow-md cursor-pointer"
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
                  <div className="flex items-center gap-2 text-gray-800">
                    <CheckCircle className="w-5 h-5 text-gray-800" />
                    Grammar Corrected
                  </div>
                  {correctedText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(correctedText, "Corrected text")}
                      className=""
                    >
                      <Copy className="w-4 h-4 text-gray-800 hover:scale-50" />
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
                  <div className="flex items-center gap-2 text-gray-800">
                    <Languages className="text-gray-800 w-5 h-5" />
                    Hindi Translation
                  </div>
                  {translatedText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(translatedText, "Translation")}
                      className="hover:scale-75"
                    >
                      <Copy className="w-4 h-4 text-gray-800 hover:scale-50" />
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