# 🌌 Quantum Optical Experiment Designer (QOED)
### *An Evolutionary Framework for Photonic Circuit Synthesis*

## 📖 Overview
The **Quantum Optical Experiment Designer** is a research-grade computational platform designed to automate the discovery of photonic circuits. By leveraging **Unitary Matrix Transformations** and **Evolutionary Algorithms (DEAP)**, the system "evolves" circuit configurations to achieve specific quantum states (e.g., Bell States, GHZ States) that are traditionally difficult to design manually.

This project bridges the gap between theoretical quantum mechanics (extracted from scientific research papers) and functional experimental simulation.

---

## 🏗️ Technical Architecture & Directory Logic

The project is structured into three primary layers, ensuring a separation of concerns between physical simulation and heuristic optimization:

### 1. 🧬 The Evolutionary Brain (`/ml`)
This module handles the "Inverse Design" problem using Genetic Programming.
* **`population.py`**: Generates the initial diverse set of random circuit configurations.
* **`crossover.py` & `mutation.py`**: Implements genetic variation by swapping circuit segments or applying Gaussian noise to optical phases and beamsplitter angles.
* **`fitness.py`**: The core evaluation metric. It calculates the **Quantum Fidelity ($F$)** between the simulated output and the target state.
* **`optimizer.py`**: Coordinates the evolutionary loop to maximize fidelity over successive generations.

### 2. ⚡ The Physics Engine (`/Physics`)
A high-performance simulation layer built with `NumPy` to model quantum interactions.
* **`beam_splitter.py`**: Models optical components as $N \times N$ **Unitary Matrices**, ensuring probability conservation.
* **`component_mapper.py`**: Translates the visual circuit topology into a sequence of mathematical operators.
* **`physics_engine.py`**: Performs recursive matrix multiplications to derive the global transfer matrix.
* **`detector.py`**: Simulates photon counting and coincidence logic, including the **Hong-Ou-Mandel (HOM)** effect.

### 3. 🖥️ Full-Stack Integration
* **`backend/`**: A **FastAPI** service that manages requests between the UI and the physics engine.
* **`frontend/`**: A **Next.js** dashboard for drag-and-drop circuit design and real-time visualization.

---

## 🚀 Execution Guide

### 1. Prerequisites & Installation
Ensure you have Python 3.9+ and Node.js installed on your Mac. Run this command to install dependencies:
```bash
pip install numpy deap fastapi uvicorn

Running the Optimization (ML Engine)


# Set PYTHONPATH to handle local module imports on MacOS
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Execute the evolutionary search
python3 ml/run_ml.py

Launching the Platform (Full-Stack)
uvicorn backend.main:app --reload
