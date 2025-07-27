// Utility function to call LanguageTool public API for grammar correction
// Docs: https://languagetool.org/http-api/

export async function grammarCorrect(text: string): Promise<string> {
  if (!text.trim()) return "";
  try {
    const response = await fetch("https://api.languagetoolplus.com/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `language=en-US&text=${encodeURIComponent(text)}`,
    });
    if (!response.ok) throw new Error("Grammar API failed");
    const data = await response.json();
    let corrected = text;
    if (data.matches && Array.isArray(data.matches)) {
      // Apply corrections from end to start to avoid index shifting
      const corrections = data.matches
        .filter((m: any) => m.replacements && m.replacements.length > 0)
        .map((m: any) => ({
          offset: m.offset,
          length: m.length,
          replacement: m.replacements[0].value,
        }))
        .sort((a: any, b: any) => b.offset - a.offset);
      corrections.forEach(({ offset, length, replacement }) => {
        corrected =
          corrected.slice(0, offset) + replacement + corrected.slice(offset + length);
      });
    }
    return corrected;
  } catch (err) {
    return "Grammar correction failed. Please try again.";
  }
}
