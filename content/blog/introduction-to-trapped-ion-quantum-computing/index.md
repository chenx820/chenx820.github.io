---
title: Introduction to Trapped-Ion Quantum Computing
date: 2023-04-15
author: Chen Huang
blogtags: ["trapped-ion", "quantum computing"]
---

## Basic principles of trapped-ion quantum computing

As one of the earliest platforms to demonstrate quantum computation, trapped-ion quantum computing has been developing for over 30 years. From the initial demonstration of cat states to the fabrication of fully-connected qubit chips, trapped ions have consistently shown great potential as a hardware platform for quantum computation.

The basic principles are:

1. **Qubit Encoding:**  
   Different energy levels within ions (often split into fine or hyperfine structures) are selected to encode qubits. Each ion serves as a single quantum bit (qubit).

2. **Control and Readout:**  
   Different types of lasers and laser interactions are used to initialize, manipulate, and read out the qubits.

3. **Coupling Mechanism:**  
   Ions, being charged, interact via long-range Coulomb forces. In ion-based quantum chips, any two qubits can naturally be coupled using special lasers or microwaves, leading to an inherently fully-connected system.

## Advantages of trapped-ion quantum computing

1. **Homogeneity:**  
   Ions are identical particles with completely identical internal energy levels, making them ideal carriers for qubits.

2. **High Fidelity:**  
   Trapped ions currently hold records for the highest single-qubit and two-qubit gate fidelities among all quantum platforms.

   - Single-qubit gates: up to 99.999% fidelity
   - Two-qubit gates: 99.9% fidelity
   - Readout fidelity: 99.99%  
     These exceed the thresholds required for quantum error correction.

3. **Abundant Resources:**  
   Each ion serves as a qubit, and the variety of elements in nature ensures a rich supply of materials.

4. **Relaxed Operating Environment:**  
   Unlike superconducting platforms, trapped-ion quantum computers can operate at temperatures ranging from 4K to room temperature, requiring only a high vacuum in the trapping chamber.

5. **Diverse Control Methods:**  
   Techniques include laser control, microwave control, and magnetic field tuning. Full laser control is the industry mainstream.

6. **Fully Connected Architecture:**  
   Operations between neighboring and next-neighboring qubits are similarly easy, reducing the need for additional swap gates and allowing for shallower, high-fidelity circuits. Multi-qubit gates can also be realized efficiently.

## Drawback of trapped-ion quantum computing

1. **Operation Speed:**  
   Due to laser power limitations, trapped-ion gate operation times are in the microsecond range, much slower than platforms like superconducting circuits or photonic systems.

2. **Scalability Challenges:**  
   Unlike superconductors, there is no mature classical fabrication process for trapped-ion chips. Improvements in trapping technology are needed, such as modular chip designs and mixed-ion systems.

3. **Technical Requirements:**  
   As microscopic particles confined in a vacuum chamber, ions require specialized methods for addressing and demand very high vacuum levels.

## Recommended literature on trapped-ion quantum computing

- A recent review summarizing the general landscape and the latest experimental advancements: [Trapped-ion quantum computing: Progress and challenges](https://pubs.aip.org/aip/apr/article-abstract/6/2/021314/570103/Trapped-ion-quantum-computing-Progress-and?redirectedFrom=fulltext)

- A Review article deriving basic electromagnetic interaction and fundamental mathematics for trapped-ion quantum computing: [Quantum Dynamics of Single Trapped Ions](https://www.quantumoptics.at/images/publications/papers/rmp03_blatt.pdf)

- A handbook for trapped-ion qubits, easy to understand and suitable for beginners: [The Trapped-Ion Qubit Toolbox](https://www.weizmann.ac.il/complex/ozeri/sites/complex.ozeri/files/publications/00107514.2011.pdf)

## Research groups in trapped-ion quantum computing

### Domestic (China)

1. **Tsinghua University - Institute for Interdisciplinary Information Sciences**

   - Prof. Luming Duan (theory)
   - Prof. Qihuan Jin (experiment)

2. **Southern University of Science and Technology (SUSTech) - Yao Lu’s Group**
   - Originated from the split of Prof. Qihuan Jin’s group.

### International

1. **University of Maryland (USA)** - Christopher Monroe’s group
2. **Sandia National Laboratories (USA)** - Including the QSCOUT program, with a large research team.
3. **University of Innsbruck (Austria)** - Peter Zoller’s group, among the earliest participants in trapped-ion research.
