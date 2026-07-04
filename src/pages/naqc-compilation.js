import React, { useMemo, useState } from "react";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import styled from "styled-components";

import SEO from "@components/seo";
import Layout from "@components/Layout/Layout";
import PageHeader from "@common/PageHeader";
import papers from "../data/naqcCompilationPapers";

/* ----------------------------- labels ----------------------------- */

const L = {
  en: {
    title: "Neutral Atom QC Compilation Papers",
    intro:
      "A curated literature review of compilation for neutral atom (Rydberg atom array) quantum computers — qubit mapping, routing, atom movement scheduling, gate/pulse synthesis, fault-tolerant compilation, and architecture co-design. Maintained for internal lab use; last updated July 2026.",
    count: (n) => `${n} papers`,
    views: { time: "Timeline", arch: "Architecture", problem: "Problem Type" },
    arch: {
      fixed: "Fixed Array",
      movable: "Movable Atoms / DPQA",
      zoned: "Zoned Architecture",
      analog: "Analog / Hamiltonian",
      general: "General / Cross-Platform",
    },
    problem: {
      mapping: "Mapping & Placement",
      routing: "Routing & Atom Movement",
      scheduling: "Scheduling",
      synthesis: "Synthesis & Pulse-Level",
      qec: "Fault Tolerance & QEC Compilation",
      analogc: "Analog Compilation & Problem Encoding",
      codesign: "Co-Design & Systems",
      framework: "Surveys, Benchmarks & Case Studies",
    },
  },
  zh: {
    title: "中性原子量子计算编译文献综述",
    intro:
      "中性原子（里德堡原子阵列）量子计算编译方向的文献整理——涵盖比特映射、路由、原子移动调度、门/脉冲综合、容错编译与架构协同设计。供实验室内部参考，最近更新于 2026 年 7 月。",
    count: (n) => `共 ${n} 篇`,
    views: { time: "时间线", arch: "体系架构", problem: "问题类型" },
    arch: {
      fixed: "静态阵列",
      movable: "可移动原子 / DPQA",
      zoned: "分区架构",
      analog: "模拟 / 哈密顿量",
      general: "通用 / 跨平台",
    },
    problem: {
      mapping: "映射与布局",
      routing: "路由与原子移动",
      scheduling: "调度",
      synthesis: "门综合与脉冲级",
      qec: "容错与纠错编译",
      analogc: "模拟编译与问题编码",
      codesign: "协同设计与系统",
      framework: "综述、评测与案例研究",
    },
  },
};

const ARCH_ORDER = ["fixed", "movable", "zoned", "analog", "general"];
const PROBLEM_ORDER = [
  "mapping",
  "routing",
  "scheduling",
  "synthesis",
  "qec",
  "analogc",
  "codesign",
  "framework",
];

/* ----------------------------- styles ------------------------------ */

const Wrapper = styled.section`
  padding-bottom: 60px;
`;

const Intro = styled.p`
  max-width: 720px;
  margin: -60px auto 40px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
`;

const ViewSwitcher = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 56px;
`;

const ViewButton = styled.button`
  padding: 8px 18px;
  border: 1px solid
    ${(props) =>
      props.$active
        ? props.theme.primaryColor
        : props.theme.dark
        ? "#444"
        : "#dfe4f2"};
  border-radius: 999px;
  background: ${(props) =>
    props.$active ? props.theme.primaryColor : "transparent"};
  color: ${(props) => (props.$active ? "#fff" : props.theme.textColor)};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

const Section = styled.section`
  margin-bottom: 64px;
`;

const SectionHeading = styled.h2`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  font-size: 1.3rem;

  small {
    font-size: 0.85rem;
    font-weight: 400;
    color: ${(props) => props.theme.textColor};
  }

  &:after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${(props) =>
      props.theme.dark ? "rgba(255, 255, 255, 0.16)" : "#dfe4f2"};
  }
`;

const PaperList = styled.div`
  display: grid;
  gap: 16px;
`;

const PaperCard = styled.article`
  display: grid;
  gap: 10px;
  padding: 24px 28px;
  border: 1px solid ${(props) => (props.theme.dark ? "#333333" : "#eef1f8")};
  border-radius: 8px;
  background: ${(props) => props.theme.secondaryColor};
  box-shadow: ${(props) => props.theme.shadowSmall};

  h3 {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.45;

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        color: ${(props) => props.theme.primaryColor};
      }
    }
  }
`;

const Metadata = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 0;
  font-size: 0.85rem;
  color: ${(props) => props.theme.textColor};

  span:not(:last-child):after {
    content: "/";
    margin-left: 8px;
    color: ${(props) => props.theme.primaryColor};
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  background: ${(props) =>
    props.theme.dark ? "rgba(255,255,255,0.08)" : "#f0f3fb"};
  font-size: 0.72rem;
  color: ${(props) => props.theme.textColor};
`;

const ArchTag = styled(Tag)`
  background: ${(props) => props.theme.primaryColor};
  color: #fff;
`;

const Summary = styled.p`
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.7;
  color: ${(props) => props.theme.textColor};
`;

const Authors = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${(props) => props.theme.textColor};
  opacity: 0.85;

  strong {
    font-weight: 700;
    opacity: 1;
  }
`;

/* ----------------------------- helpers ----------------------------- */

const highlightOwnName = (people) => {
  if (!people) return null;
  return people
    .split(/(Chen Huang)/g)
    .map((part, index) =>
      part === "Chen Huang" ? <strong key={index}>{part}</strong> : part,
    );
};

const byDate = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

const Paper = ({ paper, labels }) => (
  <PaperCard>
    <h3>
      <a href={paper.links[0].href} target="_blank" rel="noreferrer">
        {paper.title}
      </a>
    </h3>
    <Metadata>
      <span>{paper.venue}</span>
      <span>{paper.date}</span>
    </Metadata>
    <TagRow>
      <ArchTag>{labels.arch[paper.arch]}</ArchTag>
      {paper.tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </TagRow>
    <Summary>{paper.lang === "zh" ? paper.zh : paper.en}</Summary>
    <Authors>{highlightOwnName(paper.authors)}</Authors>
  </PaperCard>
);

/* ------------------------------ page ------------------------------- */

const NaqcCompilationPage = () => {
  const { language } = useI18next();
  const lang = language === "zh" ? "zh" : "en";
  const labels = L[lang];
  const [view, setView] = useState("time");

  const sections = useMemo(() => {
    const sorted = [...papers].sort(byDate).map((p) => ({ ...p, lang }));

    if (view === "time") {
      const years = {};
      sorted.forEach((p) => {
        const year = p.date.slice(0, 4);
        (years[year] = years[year] || []).push(p);
      });
      return Object.keys(years)
        .sort()
        .map((year) => ({ key: year, title: year, items: years[year] }));
    }

    const order = view === "arch" ? ARCH_ORDER : PROBLEM_ORDER;
    const labelMap = view === "arch" ? labels.arch : labels.problem;
    const field = view === "arch" ? "arch" : "problem";

    return order
      .map((key) => ({
        key,
        title: labelMap[key],
        items: sorted.filter((p) => p[field] === key),
      }))
      .filter((section) => section.items.length > 0);
  }, [view, lang, labels]);

  return (
    <Layout>
      <SEO title={labels.title} />
      <Wrapper>
        <PageHeader>{labels.title}</PageHeader>
        <Intro>
          {labels.intro} ({labels.count(papers.length)})
        </Intro>

        <ViewSwitcher>
          {Object.entries(labels.views).map(([key, name]) => (
            <ViewButton
              key={key}
              $active={view === key}
              onClick={() => setView(key)}
            >
              {name}
            </ViewButton>
          ))}
        </ViewSwitcher>

        {sections.map((section) => (
          <Section key={section.key}>
            <SectionHeading>
              {section.title} <small>({section.items.length})</small>
            </SectionHeading>
            <PaperList>
              {section.items.map((paper) => (
                <Paper key={paper.id} paper={paper} labels={labels} />
              ))}
            </PaperList>
          </Section>
        ))}
      </Wrapper>
    </Layout>
  );
};

export default NaqcCompilationPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(
      filter: { ns: { in: ["common"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
