/**
 * Translation Utility for the Admin Dashboard.
 * Uses the MyMemory API (free, no key needed) as a placeholder.
 * Can be easily swapped for Google Cloud Translation or DeepL.
 */

const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";

export async function translateToArabic(text: string): Promise<string> {
  if (!text || text.trim() === "") return "";

  try {
    const response = await fetch(
      `${MYMEMORY_API_URL}?q=${encodeURIComponent(text)}&langpair=en|ar`
    );
    
    if (!response.ok) {
      throw new Error("Translation request failed");
    }

    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }

    // Fallback to mirroring if API returns unexpected structure
    return text;
  } catch (error) {
    console.error("Translation Error:", error);
    // Fallback to mirroring to ensure the application still works
    return text;
  }
}
