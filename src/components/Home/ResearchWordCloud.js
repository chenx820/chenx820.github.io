import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "gatsby-plugin-react-i18next";

// Core interests first; smaller terms come from the site's research and notes.
const words = [
  ["quantum computing", "main"],
  ["compilation", "compilation"],
  ["neutral atoms", "atoms"],
  ["trapped ions", "ions"],
  ["semiconductor quantum dots", "dots"],
  ["quantum circuits", "medium"],
  ["quantum information", "medium"],
  ["charge noise", "medium"],
  ["quantum control", "medium"],
  ["optical tweezers", "small"],
  ["scheduling", "small", true],
  ["placement", "small"],
  ["routing", "small", true],
  ["spin qubits", "small"],
  ["automatic calibration", "small"],
  ["quantum optics", "small"],
  ["zoned architecture", "small"],
  ["atom arrays", "small"],
];

const Cloud = styled.ul`
  position: relative;
  container-type: inline-size;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px 12px;
  width: 100%;
  max-width: 820px;
  margin: 8px auto 0;
  padding: 14px 0;
  list-style: none;
  font-family: ${({ theme }) => theme.typewriter};
  text-align: center;
  li {
    margin: 0;
    padding: 0;
    width: max-content;
    max-width: 100%;
    line-height: 1.1;
  }
  &[data-packed="true"] li {
    position: absolute;
  }
  span {
    display: inline-block;
    transition:
      transform 0.2s,
      color 0.2s;
  }
  li:hover span {
    transform: translateY(-2px);
    color: ${({ theme }) => theme.primaryTextColor};
  }
  .main {
    font-size: clamp(1.5rem, 7cqw, 3.4rem);
    font-weight: 700;
    letter-spacing: -0.065em;
    color: ${({ theme }) => theme.primaryTextColor};
  }
  .compilation {
    font-size: clamp(1.25rem, 4.3cqw, 2.1rem);
    color: ${({ theme }) => theme.accentColor};
  }
  .atoms {
    font-size: clamp(1.2rem, 4.1cqw, 2rem);
  }
  .ions {
    font-size: clamp(1.1rem, 3.6cqw, 1.8rem);
    color: ${({ theme }) => theme.accentColor};
  }
  .dots {
    font-size: clamp(0.875rem, 3.1cqw, 1.5rem);
    color: ${({ theme }) => theme.primaryTextColor};
  }
  .atoms {
    color: ${({ theme }) => (theme.dark ? theme.pastelPink : "#986276")};
  }
  .medium {
    font-size: clamp(0.875rem, 2.3cqw, 1.05rem);
  }
  .small {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.mutedColor};
  }
`;

// Pack measured word bounds along an elliptical spiral, leaving a small gutter.
// Stable placement avoids random jumps; measuring the real font prevents overlap.
function packWords(sizes, width, height) {
  const placed = [];
  for (let index = 0; index < sizes.length; index += 1) {
    const { w, h } = sizes[index];
    let found;
    for (let step = 0; step < 6000; step += 1) {
      const angle = step * 0.22 + index * 2.4;
      const radius = step * 0.085;
      const x = width / 2 + Math.cos(angle) * radius - w / 2;
      const y = height / 2 + Math.sin(angle) * radius * 0.55 - h / 2;
      if (x < 4 || y < 4 || x + w > width - 4 || y + h > height - 4) continue;
      if (
        placed.some(
          (b) =>
            x < b.x + b.w + 5 &&
            x + w + 5 > b.x &&
            y < b.y + b.h + 5 &&
            y + h + 5 > b.y,
        )
      )
        continue;
      found = { x, y, w, h };
      break;
    }
    if (!found) return null;
    placed.push(found);
  }
  return placed;
}

export default function ResearchWordCloud() {
  const { i18n } = useTranslation();
  const ref = useRef(null);
  const [layout, setLayout] = useState(null);
  useEffect(() => {
    const element = ref.current;
    let stopped = false;
    let frame;
    const arrange = () => {
      if (stopped) return;
      const width = element.clientWidth;
      const sizes = Array.from(element.children).map((el, index) => {
        const vertical = words[index][2];
        return {
          w: vertical ? el.offsetHeight : el.offsetWidth,
          h: vertical ? el.offsetWidth : el.offsetHeight,
        };
      });
      // Allow extra height on narrow screens and when the user enlarges text.
      for (let height = width < 500 ? 330 : 270; height <= 750; height += 60) {
        const positions = packWords(sizes, width, height);
        if (positions) {
          setLayout({ positions, height });
          return;
        }
      }
      setLayout(null); // Readable wrapping is the fallback at extreme text sizes.
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(arrange);
    };
    let lastWidth;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === lastWidth) return;
      lastWidth = entry.contentRect.width;
      schedule();
    });
    observer.observe(element);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      stopped = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Cloud
      ref={ref}
      data-packed={Boolean(layout)}
      style={layout ? { height: layout.height } : undefined}
      aria-label={
        i18n.language.startsWith("zh") ? "研究关键词云" : "Research word cloud"
      }
    >
      {words.map(([label, name, vertical], index) => {
        const box = layout?.positions[index];
        return (
          <li
            key={label}
            className={name}
            style={
              box
                ? {
                    left: box.x + box.w / 2,
                    top: box.y + box.h / 2,
                    transform: `translate(-50%, -50%)${vertical ? " rotate(-90deg)" : ""}`,
                  }
                : undefined
            }
          >
            <span>{label}</span>
          </li>
        );
      })}
    </Cloud>
  );
}
