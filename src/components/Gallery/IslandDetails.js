import React from "react";

function OrchardTree({ transform }) {
  return (
    <g transform={transform}>
      <ellipse className="detail-shadow" cy="13" rx="13" ry="4" />
      <path className="tree-trunk" d="M-3 0 H3 L4 13 Q0 16 -4 13Z" />
      <path
        className="tree-crown"
        d="M-14 -4 C-20 -12 -13 -22 -6 -23 C-3 -29 7 -28 11 -21 C20 -18 20 -9 15 -4 C17 5 6 9 0 6 C-8 10 -18 4 -14 -4Z"
      />
      <path
        className="tree-highlight"
        d="M-12 -12 Q-11 -20 -5 -20 Q0 -27 7 -20 Q-4 -20 -12 -12Z"
      />
      <circle className="tree-fruit" cx="-8" cy="-7" r="3.2" />
      <circle className="tree-fruit" cx="7" cy="-12" r="3.2" />
      <circle className="tree-fruit" cx="4" cy="0" r="3.2" />
    </g>
  );
}

function CedarTree({ transform }) {
  return (
    <g transform={transform}>
      <ellipse className="detail-shadow" cy="13" rx="11" ry="3.5" />
      <path className="tree-trunk" d="M-2 3 H2 V14 H-2Z" />
      <path
        className="cedar-crown"
        d="M0 -29 Q-4 -22 -8 -17 Q-10 -14 -4 -15 Q-8 -9 -13 -4 Q-15 0 -6 -2 Q-10 4 -15 8 Q0 17 15 8 Q10 4 6 -2 Q15 0 13 -4 Q8 -9 4 -15 Q10 -14 8 -17 Q4 -22 0 -29Z"
      />
      <path
        className="cedar-highlight"
        d="M0 -25 L-5 -16 H0Z M0 -12 L-9 -2 H0Z M0 2 L-11 9 H0Z"
      />
    </g>
  );
}

function MapFlower({ transform }) {
  return (
    <g transform={transform}>
      <path className="flower-stem" d="M0 0 V9 M0 7 Q-6 3 -6 7 Q-4 11 0 9" />
      <path
        className="flower-petals"
        d="M0 -6 C-7 -12 -10 -4 -5 0 C-11 5 -4 11 0 5 C5 11 11 5 5 0 C11 -5 5 -12 0 -6Z"
      />
      <circle className="flower-center" r="2.6" />
    </g>
  );
}

// Decorative island motifs stay in the overview and never receive pointer input.
export default function IslandDetails() {
  return (
    <g className="island-details" aria-hidden="true" pointerEvents="none">
      {[
        [216, 152, 0.72],
        [233, 158, 0.66],
        [343, 287, 0.72],
        [357, 303, 0.62],
        [548, 248, 0.72],
        [563, 257, 0.6],
        [708, 160, 0.72],
        [725, 155, 0.62],
        [881, 335, 0.68],
      ].map(([x, y, scale]) => (
        <OrchardTree
          key={`orchard-${x}`}
          transform={`translate(${x} ${y}) scale(${scale})`}
        />
      ))}
      {[
        [184, 103, 0.74],
        [202, 113, 0.68],
        [665, 89, 0.76],
        [684, 99, 0.64],
        [813, 84, 0.7],
      ].map(([x, y, scale]) => (
        <CedarTree
          key={`cedar-${x}`}
          transform={`translate(${x} ${y}) scale(${scale})`}
        />
      ))}
      {[
        [268, 180],
        [521, 197],
        [773, 169],
        [896, 350],
      ].map(([x, y]) => (
        <MapFlower
          key={`flower-${x}`}
          transform={`translate(${x} ${y}) scale(0.7)`}
        />
      ))}
      <g className="island-shell" transform="translate(91 382) rotate(-15)">
        <ellipse className="detail-shadow" cy="17" rx="22" ry="4" />
        <path
          className="shell-body"
          d="M-7 15 L-24 -2 Q-27 -12 -19 -15 Q-16 -23 -8 -20 Q0 -29 8 -20 Q16 -23 19 -15 Q27 -12 24 -2 L7 15 Q0 20 -7 15Z"
        />
        <path
          className="shell-ribs"
          d="M-17 -12 L-5 12 M-8 -17 L-2 12 M0 -20 V12 M8 -17 L2 12 M17 -12 L5 12"
        />
        <path className="shell-foot" d="M-7 14 Q0 10 7 14 L9 19 H-9Z" />
      </g>
      <g className="island-fish" transform="translate(418 302) rotate(-15)">
        <path d="M-17 0 Q0 -17 15 0 Q0 17 -17 0Z M13 0 L25 -9 V9Z" />
        <circle cx="-9" cy="-1" r="1.7" />
      </g>
      <g
        className="island-fish"
        transform="translate(754 352) scale(0.7) rotate(12)"
      >
        <path d="M-17 0 Q0 -17 15 0 Q0 17 -17 0Z M13 0 L25 -9 V9Z" />
        <circle cx="-9" cy="-1" r="1.7" />
      </g>
    </g>
  );
}
