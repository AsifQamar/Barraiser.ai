export type VerdictType = "Strong Hire" | "Hire" | "Lean Hire" | "No Hire";

export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export interface CodingChallenge {
  title: string;
  difficulty: DifficultyLevel;
  description: string;
  starterCode: string;
  constraints?: string[];
  examples?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
}

export interface LeadershipPrinciple {
  principle: string;
  question: string;
  tip?: string;
}

export interface StarAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface SessionResponse {
  sessionId: string;
  targetRole: string;
  codingChallenge: CodingChallenge;
  leadershipPrinciple: LeadershipPrinciple;
  createdAt?: string;
}

export interface LeadershipScore {
  principle: string;
  score: number; // 1 to 5
  feedback: string;
}

export interface TechnicalEvaluation {
  timeComplexity: string;
  spaceComplexity: string;
  edgeCasesIdentified: string;
}

export interface DossierResponse {
  sessionId: string;
  targetRole?: string;
  verdict: VerdictType;
  summary: string;
  technicalEvaluation: TechnicalEvaluation;
  leadershipScorecard: LeadershipScore[];
  actionableFixes: string[];
  createdAt?: string;
}

export interface HistoryItem {
  sessionId: string;
  targetRole: string;
  createdAt: string;
  verdict: VerdictType;
  summary: string;
  codingTitle: string;
}
