import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "gatsby-plugin-react-i18next";

const appear = keyframes`from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); }`;
const Interests = styled.div`
  margin-top: 26px;
  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
  }
  button {
    position: relative;
    padding: 6px 0;
    border: 0;
    background: none;
    color: ${({ theme }) => theme.textColor};
    font: 14px/1.5 ${({ theme }) => theme.typewriter};
    cursor: pointer;
  }
  button::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s;
  }
  button:hover::after,
  button[aria-pressed="true"]::after {
    transform: scaleX(1);
  }
  button[aria-pressed="true"] {
    color: ${({ theme }) => theme.primaryTextColor};
  }
  .description {
    min-height: 4.5em;
    margin-top: 12px;
    max-width: 440px;
  }
  p {
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.75;
    animation: ${appear} 0.25s ease-out;
  }
`;
export default function ResearchInterests() {
  const { i18n } = useTranslation();
  const zh = i18n.language.startsWith("zh");
  const [active, setActive] = useState(0);
  const topics = zh
    ? [
        ["quantum computing", "从量子态的演化，到实际可运行的计算。"],
        [
          "compilation",
          "如何把量子线路映射到真实硬件？这是我在中性原子系统中关注的问题。",
        ],
        [
          "quantum systems",
          "中性原子、离子阱、半导体量子比特——不同的物理系统，共同的计算问题。",
        ],
      ]
    : [
        [
          "quantum computing",
          "From the evolution of a quantum state to a computation we can actually run.",
        ],
        [
          "compilation",
          "How do we map a quantum circuit onto real hardware? I explore this question with neutral atoms.",
        ],
        [
          "quantum systems",
          "Neutral atoms, trapped ions, semiconductor qubits. Different physics, shared computational questions.",
        ],
      ];
  return (
    <Interests>
      <div
        className="topics"
        role="group"
        aria-label={zh ? "研究兴趣" : "Research interests"}
      >
        {topics.map(([label], index) => (
          <button
            type="button"
            key={label}
            aria-pressed={index === active}
            onClick={() => setActive(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="description" aria-live="polite">
        <p key={`${i18n.language}-${active}`}>{topics[active][1]}</p>
      </div>
    </Interests>
  );
}
