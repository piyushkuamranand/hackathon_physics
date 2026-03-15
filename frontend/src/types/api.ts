export interface PredictionRequest {
  qubits: number;
  phase: number;
  noise: number;
  target_state?: string;
}

export interface CircuitComponent {
  type: string;
  id?: string;
  position?: number;
  ratio?: number;
  phase?: number;
  probability?: number;
  [key: string]: unknown;
}

export interface PredictionResponse {
  best_fidelity: number | null;
  circuit: CircuitComponent[];
  generation: number;
  components: number;
  depth: number;
  runtime: string;
  detector_probabilities: Record<string, number>;
  mode: string;
  status: string;
}

export interface HealthResponse {
  status: string;
  message: string;
  version: string;
  docs: string;
}
