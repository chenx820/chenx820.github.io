import React, { useRef, useEffect, useState } from "react";
import { withTheme } from "styled-components";

import {
  HeroCardWrapper,
  CodeCardWrapper,
  ColorPaletteWrapper,
  ColorBoxWrapper,
} from "./HeroCard.style";

function repeatString(str, count) {
  let maxCount = str.length * count;
  count = Math.floor(Math.log(count) / Math.log(2));
  while (count) {
    str += str;
    count--;
  }
  str += str.substring(0, maxCount - str.length);
  return str;
}

function copyToClipboard(str) {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export const CodeCard = ({ codeLines }) => {
  return (
    <CodeCardWrapper>
      {codeLines.map((line, index) => (
        <pre key={index}>{line}</pre>
      ))}
    </CodeCardWrapper>
  );
};

const ColorBox = ({ color, changeText }) => {
  const tooltipRef = useRef();
  useEffect(() => {
    return tooltipRef.current.addEventListener("animationend", () => {
      tooltipRef.current.classList.remove("tooltip-animate");
    });
  });
  const onClick = () => {
    changeText();
    tooltipRef.current?.classList.add("tooltip-animate");
  };

  return (
    <ColorBoxWrapper
      ref={tooltipRef}
      onClick={onClick}
      style={{ background: color }}
    />
  );
};

export const ColorPalette = withTheme(({ changeText, defaultCode }) => {
  const colors = [
    {
      color: "#082b41",
      message: defaultCode,
    },
    {
      color: "#105286",
      message: [
        `10         self.projects = {`,
        `11             \"Imperial\": [`,
        `12                 \"Charge noise in semiconductor qubits\",`,
        `13                 \"Quantum computing stack optimization\"`,
        `14             ],`,
        `15             \"BAQIS\": [`,
        `16                 \"Quantum compilation with neutral atoms\",`,
        `17                 \"Quantum error correction in neutral atoms\"`,
        `18             ],`,
        `19             \"Baidu\": [`,
        `20                 \"Automatic calibration for trapped-ion systems\"`,
        `21             ]`,
        `22         }`,
      ],
    },
    {
      color: "#F1F2F4",
      message: [
        `23         self.skills = {`,
        `24             \"Programming\": [\"Python\", \"MATLAB\", \"LaTeX\"],`,
        `25             \"Quantum Computing\": [\"Qiskit\", \"QuTiP\"],`,
        `26             \"Experimental\": [`,
        `27                   \"Dilution refrigerators\",`,
        `28                   "Semiconductor device\"`,
        `29             ],`,
        `30             \"Languages\": {`,
        `31                 \"Chinese\": \"Native\",`,
        `32                 \"English\": \"Fluent\"`,
        `33             }`,
        `34         }`,
      ],
    },
    {
      color: "#FDB338",
      message: [
        `35         self.awards_and_honors = {`,
        `36             \"HUST\": [`,
        `37                 \"China National Scholarship\",`,
        `38                 \"Outstanding UG in Term of Academic Performance\",`,
        `39                 \"Outstanding Graduate\"`,
        `40             ],`,
        `41             \"Chinese Academy of Sciences\": [`,
        `42                 \"Yan Ji-Ci Scholarship\",`,
        `43                 \"UCAS Scholarship\"`,
        `44             ],`,
        `45             \"Baidu Research\": [\"Outstanding Intern\"]`,
        `46         }`,
      ],
    },
    {
      color: "#171D1D",
      message: [
        `47        self.leadership = {`,
        `48            \"HerSTEM\": \"Co-founder\",`,
        `49            \"IBPE\": \"President\"`,
        `50        }`,
      ],
    },
  ];

  return (
    <ColorPaletteWrapper>
      {colors.map(({ color, message }) => (
        <ColorBox
          key={color}
          color={color}
          changeText={() => changeText(message)}
        />
      ))}
    </ColorPaletteWrapper>
  );
});

export const HeroCard = () => {
  const defaultCode = [
    `1  class Physicist:`,
    `2      def __init__(self):`,
    `3          self.name = \"Chen Huang\"`,
    `4          self.traits = [\"quantum computing\"]`,
    `5          self.email = \"chen.huang23@imperial.ac.uk\"`,
    `6          self.education = {`,
    `7              \"MSc\": \"Imperial College London\",`,
    `8              \"BSc\": \"Huazhong University of Science and Technology\"`,
    `9          }`,
  ];

  const [codeLines, setCodeLines] = useState(defaultCode);

  const changeText = (lines) => {
    setCodeLines(lines);
  };

  return (
    <HeroCardWrapper>
      <CodeCard codeLines={codeLines} />
      <ColorPalette changeText={changeText} defaultCode={defaultCode} />
    </HeroCardWrapper>
  );
};
