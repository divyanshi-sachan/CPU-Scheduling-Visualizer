# CPU Scheduling Visualizer

A modern, interactive web application for visualizing and understanding CPU scheduling algorithms. Built with React, TypeScript, and Express, this simulator helps students and developers explore how operating systems manage process scheduling.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Supported Algorithms](#supported-algorithms)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

CPU Scheduling is a fundamental concept in Operating Systems that determines which process runs on the CPU at any given time. This visualizer provides:

- **Real-time simulation** of scheduling algorithms
- **Interactive Gantt charts** showing process execution timeline
- **Performance metrics** including waiting time, turnaround time, and context switches
- **Smart algorithm switching** that automatically optimizes based on workload characteristics

Whether you're a student learning OS concepts or a developer building scheduling systems, this tool makes abstract concepts tangible and understandable.

---

## Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Real-time Simulation** | See results update instantly as you modify inputs |
| **Multiple Algorithms** | FCFS, SJF (Preemptive), Round Robin, Priority Scheduling |
| **Interactive Gantt Chart** | Animated visualization of process execution timeline |
| **Performance Metrics** | Average waiting time, turnaround time, throughput, context switches |
| **Smart Algorithm Switcher** | AI-powered recommendation system that suggests optimal algorithms |
| **Modern UI/UX** | Beautiful dark-themed interface with smooth animations |
| **Responsive Design** | Works seamlessly on desktop and tablet devices |

### Smart Algorithm Switching

The simulator includes an intelligent evaluator that can automatically switch algorithms when:

- **Round Robin** causes excessive context switches → Switches to SJF
- **FCFS** leads to convoy effect (high waiting times) → Switches to SJF

This teaches users about the trade-offs between different scheduling strategies.

---

## Supported Algorithms

### 1. First Come First Serve (FCFS)

```
Non-preemptive | Simple | May cause convoy effect
```

The simplest scheduling algorithm. Processes are executed in the order they arrive in the ready queue.

**Characteristics:**
- Non-preemptive
- Easy to implement
- May lead to convoy effect (short processes wait for long ones)
- Best for batch systems

**Example:**
```
Process  Arrival  Burst
P1       0        4
P2       1        3
P3       2        1

Gantt: |--P1--|--P2--|P3|
       0     4     7    8
```

---

### 2. Shortest Job First (SJF) - Preemptive (SRTF)

```
Preemptive | Optimal waiting time | Requires burst time prediction
```

Also known as Shortest Remaining Time First (SRTF). The process with the smallest remaining burst time is executed. If a new process arrives with a shorter burst, preemption occurs.

**Characteristics:**
- Preemptive
- Minimizes average waiting time (provably optimal)
- Requires knowledge of burst times (often predicted)
- May cause starvation of long processes

**Example:**
```
Process  Arrival  Burst
P1       0        7
P2       2        4
P3       4        1

Gantt: |P1|--P2--|P3|--P2--|---P1---|
       0  2      4   5     7       12
```

---

### 3. Round Robin (RR)

```
Preemptive | Time-sliced | Fair | High context switches
```

Each process gets a fixed time quantum. After the quantum expires, the process is preempted and added to the end of the ready queue.

**Characteristics:**
- Preemptive with time quantum
- Fair allocation of CPU time
- Response time depends on quantum size
- Higher context switch overhead

**Time Quantum Selection:**
- Too small → High overhead from context switches
- Too large → Degenerates to FCFS
- Optimal → 80% of CPU bursts should complete within one quantum

**Example (Quantum = 2):**
```
Process  Arrival  Burst
P1       0        5
P2       1        3
P3       2        1

Gantt: |P1|P2|P1|P3|P2|P1|
       0  2  4  5  6  7  8
```

---

### 4. Priority Scheduling

```
Non-preemptive | Priority-based | May cause starvation
```

Each process is assigned a priority. The CPU is allocated to the process with the highest priority (lowest number = highest priority in this implementation).

**Characteristics:**
- Can be preemptive or non-preemptive (our implementation is non-preemptive)
- Flexible priority assignment
- May cause starvation (solved with aging)
- Used in real-time systems

**Example:**
```
Process  Arrival  Burst  Priority
P1       0        4      2
P2       1        3      1  (highest)
P3       2        1      3

Gantt: |--P1--|--P2--|P3|
       0     4     7    8
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks and concurrent features |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Animation library for smooth transitions |
| **GSAP** | Advanced animations |
| **MUI X Charts** | Modern charting library |
| **React Router** | Client-side routing |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express** | Web framework |
| **TypeScript** | Type-safe JavaScript |
| **ts-node-dev** | Development server with hot reload |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Landing   │  │  Simulator  │  │      Components         │  │
│  │    Page     │  │    Page     │  │  - GanttChart           │  │
│  │             │  │             │  │  - ProcessTable         │  │
│  │  - Hero     │  │  - Inputs   │  │  - MetricsCards         │  │
│  │  - Features │  │  - Results  │  │  - AlgorithmDropdown    │  │
│  │  - CTA      │  │  - Charts   │  │  - BarChart             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                            │                                     │
│                            │ HTTP POST /api/simulate             │
│                            ▼                                     │
├─────────────────────────────────────────────────────────────────┤
│                          Backend                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                      Express Server                          ││
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  ││
│  │  │   Routes    │  │  Algorithms  │  │     Evaluator      │  ││
│  │  │             │  │              │  │                    │  ││
│  │  │ /simulate   │──▶│  - FCFS     │  │  - Smart Switcher  │  ││
│  │  │             │  │  - SJF       │──▶│  - Optimization    │  ││
│  │  │             │  │  - RR        │  │  - Recommendations │  ││
│  │  │             │  │  - Priority  │  │                    │  ││
│  │  └─────────────┘  └──────────────┘  └────────────────────┘  ││
│  │                            │                                 ││
│  │                            ▼                                 ││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │                    Metrics Engine                        │││
│  │  │  - Waiting Time  - Turnaround Time  - Context Switches  │││
│  │  │  - Completion Time  - Throughput                        │││
│  │  └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CPU-Scheduling-Visualizer.git
   cd CPU-Scheduling-Visualizer
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:3001`

2. **Start the frontend dev server** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build
```

---

## Usage

### Basic Workflow

1. **Navigate to Simulator** - Click "Get Started" on the landing page
2. **Add Processes** - Configure process ID, arrival time, burst time, and priority
3. **Select Algorithm** - Choose from FCFS, SJF, Round Robin, or Priority
4. **View Results** - See real-time Gantt chart, metrics, and per-process data

### Process Configuration

| Field | Description | Example |
|-------|-------------|---------|
| **PID** | Process identifier | P1, P2, P3 |
| **Arrival Time** | When process enters ready queue | 0, 2, 4 |
| **Burst Time** | CPU time required | 4, 2, 6 |
| **Priority** | Priority level (lower = higher priority) | 1, 2, 3 |

### Understanding Results

#### Gantt Chart
Visual timeline showing which process runs at each time unit. Each bar represents a process execution period.

#### Metrics
- **Average Waiting Time**: Mean time processes spend in ready queue
- **Average Turnaround Time**: Mean time from arrival to completion
- **Context Switches**: Number of times CPU switches between processes

#### Per-Process Table
Detailed breakdown showing completion time, waiting time, and turnaround time for each process.

---

## API Documentation

### POST /api/simulate

Runs a CPU scheduling simulation with the specified algorithm and processes.

#### Request Body

```json
{
  "algorithm": "round_robin",
  "timeQuantum": 2,
  "processes": [
    { "pid": 1, "arrivalTime": 0, "burstTime": 4, "priority": 1 },
    { "pid": 2, "arrivalTime": 1, "burstTime": 3, "priority": 2 },
    { "pid": 3, "arrivalTime": 2, "burstTime": 1, "priority": 1 }
  ]
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `algorithm` | string | Yes | One of: `fcfs`, `sjf`, `round_robin`, `priority` |
| `timeQuantum` | number | No | Time slice for Round Robin (default: 2) |
| `processes` | array | Yes | Array of process objects |

#### Response

```json
{
  "chosenAlgorithm": "round_robin",
  "usedAlgorithm": "sjf",
  "reasonSwitched": "Round Robin caused too many context switches (8). System switched to SJF to reduce turnaround time by 25%.",
  "ganttChart": [
    { "pid": 1, "start": 0, "end": 2 },
    { "pid": 2, "start": 2, "end": 5 },
    { "pid": 3, "start": 5, "end": 6 }
  ],
  "metrics": {
    "avgWaitingTime": 2.33,
    "avgTurnaroundTime": 5.0,
    "contextSwitches": 2,
    "throughput": 0.5
  },
  "processes": [
    {
      "pid": 1,
      "arrivalTime": 0,
      "burstTime": 4,
      "waitingTime": 2,
      "turnaroundTime": 6,
      "completionTime": 6
    }
  ],
  "contextSwitches": 2
}
```

---

## Project Structure

```
CPU-Scheduling-Visualizer/
├── backend/
│   ├── src/
│   │   ├── algorithms/
│   │   │   ├── fcfs.ts          # First Come First Serve
│   │   │   ├── sjf.ts           # Shortest Job First (Preemptive)
│   │   │   ├── rr.ts            # Round Robin
│   │   │   └── priority.ts      # Priority Scheduling
│   │   ├── evaluator/
│   │   │   └── switcher.ts      # Smart algorithm switcher
│   │   ├── metrics.ts           # Performance metrics calculator
│   │   ├── routes.ts            # API routes
│   │   ├── server.ts            # Express server setup
│   │   ├── types.ts             # TypeScript interfaces
│   │   └── logger.ts            # Logging utility
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg          # App icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── GanttChart.tsx   # Gantt chart visualization
│   │   │   ├── LocomotiveScroll.tsx
│   │   │   └── landing/         # Landing page components
│   │   │       ├── AnimatedText.tsx
│   │   │       ├── CPUVisual.tsx
│   │   │       ├── FloatingShapes.tsx
│   │   │       ├── GlowButton.tsx
│   │   │       └── ...
│   │   ├── pages/
│   │   │   ├── Landing.tsx      # Landing page
│   │   │   ├── Simulator.tsx    # Main simulator page
│   │   │   ├── InputPage.tsx    # Legacy input page
│   │   │   └── Results.tsx      # Legacy results page
│   │   ├── App.tsx              # Root component with routing
│   │   ├── main.tsx             # Entry point
│   │   ├── index.css            # Global styles
│   │   └── types.ts             # Shared TypeScript types
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## How It Works

### Metrics Calculation

#### Waiting Time
```
Waiting Time = Turnaround Time - Burst Time
```
Time a process spends waiting in the ready queue.

#### Turnaround Time
```
Turnaround Time = Completion Time - Arrival Time
```
Total time from process arrival to completion.

#### Context Switches
Number of times the CPU switches from one process to another. Higher context switches mean more overhead.

#### Throughput
```
Throughput = Number of Processes / Total Time
```
Number of processes completed per unit time.

### Smart Switching Logic

The evaluator uses heuristics to detect suboptimal scheduling:

```typescript
// Too many context switches in Round Robin
if (contextSwitches > processes.length * 2.5) {
  // Switch to SJF for better efficiency
}

// Convoy effect in FCFS
if (avgWaitingTime > sjfWaitingTime * 2) {
  // Switch to SJF for lower waiting times
}
```

---

## Key Formulas

| Metric | Formula |
|--------|---------|
| Completion Time (CT) | Time when process finishes execution |
| Turnaround Time (TAT) | CT - Arrival Time |
| Waiting Time (WT) | TAT - Burst Time |
| Average Waiting Time | Σ(WT) / n |
| Average Turnaround Time | Σ(TAT) / n |
| Throughput | n / max(CT) |

---

## Future Enhancements

- [ ] **Multilevel Queue Scheduling**
- [ ] **Multilevel Feedback Queue**
- [ ] **Priority Aging** to prevent starvation
- [ ] **Preemptive Priority Scheduling**
- [ ] **Challenge Mode** with gamification
- [ ] **Algorithm Comparison** side-by-side view
- [ ] **Export Results** as PDF/Image
- [ ] **Process Generator** for random test cases
- [ ] **Dark/Light Theme** toggle

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Operating System concepts from Silberschatz, Galvin, and Gagne
- UI inspiration from modern design systems
- Open source community for amazing tools and libraries

---

<p align="center">
  Built with ❤️ for Operating Systems Education
</p>
