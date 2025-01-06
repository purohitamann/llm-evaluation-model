// File: lib/metrics.ts

export function computeBleu(reference: string, hypothesis: string): number {
    // Simplistic approach! Real BLEU involves tokenization, n-gram matching, etc.
    if (!reference || !hypothesis) return 0
    // placeholder logic
    return reference === hypothesis ? 1 : 0
  }
  
  export function computeRouge(reference: string, hypothesis: string): number {
    // placeholder logic
    // Real ROUGE might parse into tokens, compute recall, etc.
    return 0
  }
  