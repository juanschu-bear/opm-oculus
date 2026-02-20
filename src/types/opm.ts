export interface OPMSession {
  session_id: string;
  video: string;
  video_hash: string;
  chunks_processed: number;
  findings_raw: number;
  findings_final: number;
  total_time_sec: number;
  cygnus_time_sec: number;
  oracle_time_sec: number;
  lucid_time_sec: number;
  status: "processing" | "complete" | "failed";
  created_at: string;
}

export interface OPMFinding {
  id: string;
  type: string;
  person_id: string | null;
  chunk_index: number;
  timestamp_start: number;
  timestamp_end: number;
  confidence: number;
  description: string;
  action_units?: string[];
  cross_modal_flags?: string[];
  reference_image_folder?: string;
}

export interface OPMChunkResult {
  chunk_index: number;
  chunk_range: [number, number];
  findings: OPMFinding[];
  lucid_interpretation: string;
  person_profiles: Record<string, OPMPersonProfile>;
}

export interface OPMPersonProfile {
  person_id: string;
  display_name?: string;
  dominant_emotion: string;
  emotion_scores: Record<string, number>;
  vocal_stability?: number;
  cross_modal_coherence?: string;
}

export interface OPMSessionInterpretation {
  session_arc: string;
  recurring_patterns: string;
  cross_person_dynamics: string;
  key_insight: string;
}

export interface OPMFullResult {
  session: OPMSession;
  chunks: OPMChunkResult[];
  session_interpretation: OPMSessionInterpretation;
}
