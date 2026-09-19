import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "gatsby-plugin-react-i18next";

const Panel = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.secondaryColor};
  border-radius: 3px;
  overflow: hidden;
  box-shadow: none;
  .panel-heading,
  .readout {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 22px;
    font: 12px/1.5 monospace;
  }
  .panel-heading {
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    letter-spacing: 0.08em;
  }
  .status {
    color: ${({ theme }) => theme.primaryTextColor};
  }
  .sphere {
    color: ${({ theme }) => theme.primaryColor};
    display: block;
    width: 100%;
    height: 280px;
    cursor: crosshair;
    touch-action: none;
    user-select: none;
    background-image: radial-gradient(
      ${({ theme }) => theme.borderColor} 1px,
      transparent 1px
    );
    background-size: 20px 20px;
  }
  .sphere text {
    font: 14px monospace;
    fill: ${({ theme }) => theme.textColor};
  }
  .controls {
    padding: 0 22px 20px;
  }
  .gates {
    display: flex;
    gap: 8px;
    margin-bottom: 18px;
  }
  button {
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background: transparent;
    color: ${({ theme }) => theme.textColor};
    border-radius: 6px;
    padding: 9px 16px;
    font: 14px monospace;
    transition:
      background 0.2s,
      transform 0.2s;
  }
  button:hover,
  button[aria-pressed="true"] {
    background: ${({ theme }) => theme.primaryColor};
    color: ${({ theme }) => theme.onPrimaryColor};
    transform: translateY(-2px);
  }
  .angles {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    font: 13px/1.5 monospace;
    font-variant-numeric: tabular-nums;
  }
  .probability {
    height: 4px;
    background: ${({ theme }) => theme.borderColor};
  }
  .probability span {
    display: block;
    height: 100%;
    background: ${({ theme }) => theme.primaryColor};
    transition: width 0.15s;
  }
  button[aria-pressed="true"] {
    background: ${({ theme }) => theme.pastelBlue};
    color: #303649;
    border-color: ${({ theme }) => theme.pastelBlue};
  }
  .hint {
    font-size: 13px;
    opacity: 0.7;
    margin-top: 16px;
  }
`;

export default function QuantumState() {
  const { i18n } = useTranslation();
  const zh = i18n.language.startsWith("zh");
  const [theta, setTheta] = useState(60);
  const [phi, setPhi] = useState(40);
  useEffect(() => {
    const followMouse = (event) => {
      if (event.pointerType !== "mouse") return;
      // Viewport coordinates keep the same mapping even after scrolling.
      setTheta(
        Math.round(
          Math.max(
            0,
            Math.min(1, event.clientY / Math.max(1, window.innerHeight)),
          ) * 180,
        ),
      );
      setPhi(
        Math.round(
          Math.max(
            0,
            Math.min(1, event.clientX / Math.max(1, window.innerWidth)),
          ) * 360,
        ),
      );
    };
    window.addEventListener("pointermove", followMouse, {
      passive: true,
      capture: true,
    });
    return () => window.removeEventListener("pointermove", followMouse, true);
  }, []);

  const t = (theta * Math.PI) / 180;
  const p = (phi * Math.PI) / 180;
  const x = Math.sin(t) * Math.cos(p);
  const y = Math.sin(t) * Math.sin(p);
  const z = Math.cos(t);
  // Orthographic projection of the Bloch vector, matching the displayed axes.
  const px = 220 + 100 * x - 45 * y;
  const py = 140 + 30 * x + 48 * y - 100 * z;
  const probability = Math.cos(t / 2) ** 2 * 100;
  const presets = [
    ["|0⟩", 0, 0],
    ["|1⟩", 180, 0],
    ["|+⟩", 90, 0],
    ["|−⟩", 90, 180],
  ];
  const followPointer = (event) => {
    if (event.pointerType === "mouse") return;
    const svg = event.currentTarget;
    if (
      event.type === "pointermove" &&
      event.pointerType !== "mouse" &&
      !svg.hasPointerCapture(event.pointerId)
    )
      return;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    // Account for SVG letterboxing and responsive scaling before mapping angles.
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    setTheta(Math.round(Math.max(0, Math.min(1, (local.y - 28) / 224)) * 180));
    setPhi(Math.round(Math.max(0, Math.min(1, (local.x - 108) / 224)) * 360));
  };
  const moveWithKeys = (event) => {
    const step = event.shiftKey ? 10 : 2;
    if (
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "ArrowUp") setTheta((value) => Math.max(0, value - step));
    if (event.key === "ArrowDown")
      setTheta((value) => Math.min(180, value + step));
    if (event.key === "ArrowLeft")
      setPhi((value) => (value - step + 360) % 360);
    if (event.key === "ArrowRight") setPhi((value) => (value + step) % 360);
  };
  return (
    <Panel>
      <svg
        className="sphere"
        viewBox="0 0 440 280"
        role="group"
        tabIndex={0}
        onPointerMove={followPointer}
        onPointerDown={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          if (event.pointerType !== "mouse")
            event.currentTarget.setPointerCapture(event.pointerId);
          followPointer(event);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onKeyDown={moveWithKeys}
        aria-label={
          zh
            ? "交互布洛赫球。在页面任意位置移动鼠标：上下调整 θ，左右调整 φ；也可聚焦后使用方向键。"
            : "Interactive Bloch sphere. Move the mouse anywhere on the page: vertically for theta, horizontally for phi. When focused, arrow keys also work."
        }
      >
        <circle
          cx="220"
          cy="140"
          r="112"
          fill="currentColor"
          fillOpacity=".035"
          stroke="currentColor"
          strokeOpacity=".3"
        />
        <ellipse
          cx="220"
          cy="140"
          rx="112"
          ry="50"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".4"
          transform="rotate(12 220 140)"
        />
        <ellipse
          cx="220"
          cy="140"
          rx="42"
          ry="112"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".2"
          transform="rotate(-20 220 140)"
        />
        <g stroke="currentColor" strokeOpacity=".35" strokeDasharray="4 5">
          <path d="M220 25V255 M105 105L335 175 M275 82L165 198" />
        </g>
        <text x="228" y="22">
          |0⟩
        </text>
        <text x="228" y="270">
          |1⟩
        </text>
        <text x="342" y="180">
          x
        </text>
        <text x="148" y="211">
          y
        </text>
        <path
          d={`M220 140L${px} ${py}`}
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="220" cy="140" r="3" fill="currentColor" />
        <circle cx={px} cy={py} r="12" fill="currentColor" fillOpacity=".16" />
        <circle cx={px} cy={py} r="5" fill="currentColor" />
      </svg>
      <div className="controls">
        <div className="gates">
          {presets.map(([name, a, b]) => (
            <button
              key={name}
              type="button"
              aria-pressed={theta === a && phi === b}
              onClick={() => {
                setTheta(a);
                setPhi(b);
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="angles">
          <span>
            θ <output>{theta}°</output>
          </span>
          <span>
            φ <output>{phi}°</output>
          </span>
        </div>
        <p className="hint">
          {zh
            ? "在页面任意位置移动鼠标：上下调整 θ，左右调整 φ。触屏可在球上拖动，也支持方向键。"
            : "Move your mouse anywhere on the page: up/down for θ, left/right for φ. On touchscreens, drag on the sphere. Arrow keys work too."}
        </p>
      </div>
      <div className="readout">
        <span>P(0) = {probability.toFixed(1)}%</span>
        <span>P(1) = {(100 - probability).toFixed(1)}%</span>
      </div>
      <div className="probability">
        <span style={{ width: `${probability}%` }} />
      </div>
    </Panel>
  );
}
