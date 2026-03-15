"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ControlPanel from "@/components/dashboard/ControlPanel";
import CircuitCard from "@/components/dashboard/CircuitCard";
import ResultsCardsGrid from "@/components/dashboard/ResultsCardsGrid";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { PredictionRequest, CircuitComponent } from "@/types/api";

export default function Dashboard() {
  const [circuit, setCircuit] = useState<CircuitComponent[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [apiStatus, setApiStatus] = useState({ mode: "physical", status: "" }); 
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  
  const [metrics, setMetrics] = useState({
    fidelity: 0 as number | null,
    components: 0,
    generation: 0,
    depth: 0,
    bsCount: 0,
    psCount: 0,
    dCount: 0,
    spdcCount: 0,
    targetFidelity: 99.7
  });
  const [trace, setTrace] = useState<string[]>([]);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        await apiService.checkHealth();
        setIsBackendConnected(true);
      } catch {
        setIsBackendConnected(false);
      }
    };
    checkAvailability();
    const interval = setInterval(checkAvailability, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleCompile = async (params: PredictionRequest) => {
    setIsOptimizing(true);
    console.log("🚀 Sending to backend:", params); // Debug log
    setTrace([`Starting optimization for ${params.target_state || 'default'} state...`, `Parameters: qubits=${params.qubits}, phase=${params.phase.toFixed(3)}, noise=${params.noise.toFixed(4)}`]);
    setCircuit([]);
    setMetrics({ fidelity: 0, components: 0, generation: 0, depth: 0, bsCount: 0, psCount: 0, dCount: 0, targetFidelity: 99.7 });
    
    try {
      const data = await apiService.optimizeCircuit({
        qubits: params.qubits,
        phase: params.phase,
        noise: params.noise,
        target_state: params.target_state
      });
      
      console.log("📊 Backend response:", data); // Debug log
      const circuitData = data.circuit || [];
      const fidelity = data.best_fidelity === null ? null : data.best_fidelity || 0;
      console.log("✅ Parsed fidelity:", fidelity, "Circuit length:", circuitData.length); // Debug log
      
      setApiStatus({ mode: data.mode || "physical", status: data.status || "Simulated result" });
      setCircuit(circuitData);

      const spdcCount = circuitData.filter((c: CircuitComponent) => c.type === 'SPDC').length || 1; // Assume at least 1 SPDC per experiment
      setMetrics({
        fidelity: fidelity, 
        components: data.components || circuitData.length,
        generation: data.generation || 1,
        depth: data.depth || circuitData.length,
        bsCount: circuitData.filter((c: CircuitComponent) => c.type === 'BS').length,
        psCount: circuitData.filter((c: CircuitComponent) => c.type === 'PS').length,
        dCount: circuitData.filter((c: CircuitComponent) => c.type === 'D').length,
        spdcCount: spdcCount,
        targetFidelity: 99.7
      });

      setTrace(prev => [...prev, 
        `✓ Generated ${circuitData.length} components`,
        `✓ Best fidelity: ${fidelity !== null ? (fidelity * 100).toFixed(1) + '%' : 'Pending'}`,
        `✓ Optimization complete`
      ]);
      setIsBackendConnected(true);
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Optimization failed:", error);
      setTrace(prev => [...prev, `ERROR: ${errMessage}`]);
      setIsBackendConnected(false);

      // Fallback demo data when backend is down
      const fallbackCircuit = [
        { type: "BS", id: "demo_1", position: 0, ratio: 0.5 },
        { type: "PS", id: "demo_2", position: 1, phase: params.phase || 0.5 },
        { type: "BS", id: "demo_3", position: 2, ratio: 0.5 },
        { type: "D", id: "demo_4", position: 3 }
      ];
      
      setApiStatus({ mode: "preview", status: "simulation unavailable" });
      setCircuit(fallbackCircuit as CircuitComponent[]);
      setMetrics({ 
        fidelity: null, // Null fidelity for failure case
        components: 4, 
        generation: 1,
        depth: 4,
        bsCount: 2,
        psCount: 1,
        dCount: 1,
        spdcCount: 1,
        targetFidelity: 99.7
      });
      setTrace(prev => [...prev, `✓ Preview mode: Generated structural layout with 4 components`, `✓ Topology physics pending`]);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <DashboardLayout
      sidebar={
        <ControlPanel
          onCompile={handleCompile}
          isOptimizing={isOptimizing}
        />
      }
      insights={
        <InsightsPanel trace={trace} />
      }
    >
      {isBackendConnected === false && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 bg-red-500/10 border border-red-500/20 text-red-500/80 p-3 rounded-lg flex items-center justify-center mb-6 text-sm">
          ⚠️ Backend API disconnected. Running in restricted fallback mode. Please start the backend server.
        </div>
      )}

      {/* Circuit Card - Featured */}
      <CircuitCard circuit={circuit} isOptimizing={isOptimizing} />

      {/* Results Grid */}
      <ResultsCardsGrid 
        metrics={metrics}
        circuit={circuit}
        mode={apiStatus.mode}
        status={apiStatus.status}
      />
    </DashboardLayout>
  );
}
