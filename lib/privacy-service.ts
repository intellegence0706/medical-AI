import { PrivacySettings } from './types';

export function applyPrivacyMasking(
  text: string,
  settings: PrivacySettings
): string {
  let maskedText = text;

  if (settings.maskPii) {
    // Mask email addresses
    maskedText = maskedText.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      '[EMAIL_REDACTED]'
    );

    // Mask phone numbers
    maskedText = maskedText.replace(
      /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      '[PHONE_REDACTED]'
    );

    // Mask SSN
    maskedText = maskedText.replace(
      /\b\d{3}-\d{2}-\d{4}\b/g,
      '[SSN_REDACTED]'
    );

    // Mask addresses (simple pattern)
    maskedText = maskedText.replace(
      /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi,
      '[ADDRESS_REDACTED]'
    );

    // Mask names (common pattern: capitalized words)
    maskedText = maskedText.replace(
      /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g,
      (match) => {
        // Don't mask medical terms or common phrases
        const exceptions = ['Day', 'Patient', 'Doctor', 'Main St'];
        if (exceptions.some(ex => match.includes(ex))) {
          return match;
        }
        return '[NAME_REDACTED]';
      }
    );
  }

  if (settings.maskAge) {
    // Mask age mentions
    maskedText = maskedText.replace(
      /\b(\d{1,3})[-\s]?(?:year|yr|y\.o\.|years?)[-\s]?old\b/gi,
      '[AGE_REDACTED]-year-old'
    );
    maskedText = maskedText.replace(
      /\bDOB[:\s]+\d{1,2}\/\d{1,2}\/\d{2,4}\b/gi,
      'DOB [DATE_REDACTED]'
    );
  }

  if (settings.maskGender) {
    // Mask gender pronouns and terms
    maskedText = maskedText.replace(
      /\b(he|him|his|she|her|hers|male|female|man|woman)\b/gi,
      '[GENDER_REDACTED]'
    );
  }

  return maskedText;
}

export function maskAnalysisData(data: any, settings: PrivacySettings): any {
  if (typeof data === 'string') {
    return applyPrivacyMasking(data, settings);
  }

  if (Array.isArray(data)) {
    return data.map(item => maskAnalysisData(item, settings));
  }

  if (typeof data === 'object' && data !== null) {
    const masked: any = {};
    for (const key in data) {
      masked[key] = maskAnalysisData(data[key], settings);
    }
    return masked;
  }

  return data;
}
