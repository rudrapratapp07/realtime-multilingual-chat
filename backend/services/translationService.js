const { GoogleGenerativeAI } = require('@google/generative-ai');

class TranslationService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    this.languageNames = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ko': 'Korean',
      'it': 'Italian'
    };
  }

  async translateMessage(text, sourceLanguage, targetLanguage) {
    try {
      // If source and target are the same, return original text
      if (sourceLanguage === targetLanguage) {
        return {
          translatedText: text,
          originalText: text,
          sourceLanguage,
          targetLanguage
        };
      }

      const sourceLang = this.languageNames[sourceLanguage] || sourceLanguage;
      const targetLang = this.languageNames[targetLanguage] || targetLanguage;

      const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. 
Provide ONLY the translation without any additional explanations, notes, or formatting.

Text to translate: "${text}"

Translation:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text().trim();

      return {
        translatedText,
        originalText: text,
        sourceLanguage,
        targetLanguage
      };
    } catch (error) {
      console.error('Translation error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      if (error.response) {
        console.error('API Response:', await error.response.text());
      }

      // Fallback: return original text if translation fails
      return {
        translatedText: text,
        originalText: text,
        sourceLanguage,
        targetLanguage,
        error: 'Translation service unavailable'
      };
    }
  }

  async detectLanguage(text) {
    try {
      const prompt = `Detect the language of the following text. 
Respond with ONLY the two-letter ISO 639-1 language code (e.g., en, es, fr, de, zh, ja, ar, hi, pt, ru, ko, it).
Do not provide any explanation, just the code.

Text: "${text}"

Language code:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const detectedCode = response.text().trim().toLowerCase();

      // Validate the detected code
      if (this.languageNames[detectedCode]) {
        return detectedCode;
      }

      // Default to English if detection fails
      return 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  async batchTranslate(messages, targetLanguage) {
    const translations = await Promise.all(
      messages.map(msg =>
        this.translateMessage(msg.text, msg.sourceLanguage, targetLanguage)
      )
    );
    return translations;
  }
}

module.exports = new TranslationService();
