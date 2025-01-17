
export function computeBleu(reference: string, hypothesis: string): number {
   
    if (!reference || !hypothesis) return 0
 
    return reference === hypothesis ? 1 : 0
  }
  
  export function computeRouge(reference: string, hypothesis: string): number {

    return 0
  }
  