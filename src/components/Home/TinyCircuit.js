import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "gatsby-plugin-react-i18next";

const travel = keyframes`from { transform: translateX(0); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } to { transform: translateX(92px); opacity: 0; }`;
const flip = keyframes`from { transform: translateY(-5px); opacity: .2; } to { transform: translateY(0); opacity: 1; }`;
const Circuit = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font: 14px/1.5 ${({ theme }) => theme.typewriter};
  .wire {
    display: flex;
    align-items: center;
    position: relative;
  }
  .wire::before,
  .wire::after {
    content: "";
    width: 30px;
    height: 1px;
    background: ${({ theme }) => theme.borderColor};
  }
  button {
    width: 34px;
    height: 32px;
    border: 1px solid ${({ theme }) => theme.textColor};
    border-radius: 0;
    background: ${({ theme }) => theme.bgColor};
    color: inherit;
    font: inherit;
    cursor: pointer;
    transition: transform 0.15s;
  }
  sup {
    font-size: 10px;
    margin-left: 1px;
  }
  button:hover {
    background: ${({ theme }) => theme.pastelYellow};
    color: #303649;
    transform: rotate(-8deg);
  }
  button:active {
    transform: scale(0.9);
  }
  .pulse {
    position: absolute;
    left: 0;
    top: 14px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primaryColor};
    pointer-events: none;
    animation: ${travel} 0.45s both;
  }
  output {
    display: inline-block;
    animation: ${flip} 0.25s;
  }
  .hint {
    font-size: 12px;
    opacity: 0.6;
  }
  @media (max-width: 480px) {
    .hint {
      display: none;
    }
  }
`;
export default function TinyCircuit() {
  const [count, setCount] = useState(0);
  const { i18n } = useTranslation();
  const zh = i18n.language.startsWith("zh");
  return (
    <Circuit>
      <span>|0⟩</span>
      <div className="wire">
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          aria-label={
            zh
              ? "对输出态施加 X 门，翻转量子比特"
              : "Apply X to the output state to flip the qubit"
          }
        >
          X<sup>{count}</sup>
        </button>
        {count > 0 && <i className="pulse" key={count} />}
      </div>
      <span aria-live="polite">
        <output key={count}>|{count % 2}⟩</output>
      </span>
      <span className="hint">{zh ? "点一下 X" : "give X a click"}</span>
    </Circuit>
  );
}
