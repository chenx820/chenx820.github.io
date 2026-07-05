import React, { useState } from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import styled from "styled-components";

import Button from "@common/Button";
import PageHeader from "@common/PageHeader";

const PublicationsWrapper = styled.section`
  padding-bottom: 40px;
`;

const PublicationsIntro = styled.p`
  max-width: 680px;
  margin: -60px auto 72px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
`;

const PublicationSection = styled.section`
  margin-bottom: 72px;
`;

const SectionHeading = styled.h2`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
  font-size: 1.35rem;

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
  gap: 18px;
`;

const PaperCard = styled.article`
  display: grid;
  gap: 14px;
  padding: 28px;
  border: 1px solid ${(props) => (props.theme.dark ? "#333333" : "#eef1f8")};
  border-radius: 10px;
  background: ${(props) => props.theme.secondaryColor};
  box-shadow: ${(props) => props.theme.shadowSmall};

  h3 {
    margin-top: 0;
    font-size: 1.15rem;
  }
`;

const Metadata = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: ${(props) => props.theme.textColor};

  span:not(:last-child):after {
    content: "/";
    margin-left: 8px;
    color: ${(props) => props.theme.primaryColor};
  }
`;

const LinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PublicationLinkButton = styled(Button)`
  padding: 8px 10px;
  font-size: 11px;
  line-height: 1;
`;

const PatentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media ${(props) => props.theme.media.fablet} {
    grid-template-columns: 1fr;
  }
`;

const PatentCard = styled.article`
  display: grid;
  gap: 14px;
  align-content: start;
  min-height: 260px;
  padding: 28px;
  border: 1px solid ${(props) => (props.theme.dark ? "#333333" : "#eef1f8")};
  border-radius: 10px;
  background: ${(props) => props.theme.secondaryColor};
  box-shadow: ${(props) => props.theme.shadowSmall};

  h3 {
    margin-top: 0;
    font-size: 1rem;
  }
`;

const PeopleLine = styled.p`
  color: ${(props) => props.theme.textColor};

  strong {
    font-weight: 700;
  }
`;

const buildBibtex = (paper) => {
  const cleanAuthors = (paper.authors || "")
    .replace(/\*/g, "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  const firstAuthorLastName =
    cleanAuthors[0]?.split(" ").pop()?.toLowerCase() || "unknown";
  const firstTitleWord =
    (paper.title || "")
      .split(" ")[0]
      ?.replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase() || "paper";
  const citeKey = `${firstAuthorLastName}${paper.year || ""}${firstTitleWord}`;

  const authorField = cleanAuthors.join(" and ");
  const isArxiv = /arxiv/i.test(paper.venue || "");

  const lines = [];
  if (paper.kind === "journal") {
    lines.push(`@article{${citeKey},`);
    lines.push(`  journal = {${paper.venue}},`);
  } else if (paper.kind === "conference") {
    lines.push(`@inproceedings{${citeKey},`);
    lines.push(`  booktitle = {${paper.venue}},`);
  } else {
    lines.push(`@misc{${citeKey},`);
    if (isArxiv) {
      const arxivId = (paper.venue.match(/arXiv:([\d.]+)/i) || [])[1];
      if (arxivId) {
        lines.push(`  eprint = {${arxivId}},`);
        lines.push(`  archivePrefix = {arXiv},`);
      }
    } else if (paper.venue) {
      lines.push(`  howpublished = {${paper.venue}},`);
    }
  }
  lines.splice(1, 0, `  title = {${paper.title}},`, `  author = {${authorField}},`);
  if (paper.year) lines.push(`  year = {${paper.year}},`);
  if (paper.status && paper.status !== "Published")
    lines.push(`  note = {${paper.status}},`);
  lines.push("}");
  return lines.join("\n");
};

const BibtexButton = ({ paper }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildBibtex(paper));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      // clipboard unavailable; ignore
    }
  };

  return (
    <PublicationLinkButton as="button" type="button" onClick={handleCopy}>
      {copied ? t("common.copied") : t("common.copy-bibtex")}
    </PublicationLinkButton>
  );
};

const highlightOwnName = (people) => {
  if (!people) {
    return null;
  }

  return people.split(/(Chen Huang)/g).map((part, index) =>
    part === "Chen Huang" ? <strong key={index}>{part}</strong> : part
  );
};

const PaperEntry = ({ paper }) => {
  const title = paper.title || paper.venue;
  const showBibtex =
    paper.title && ["journal", "conference", "preprint"].includes(paper.kind);

  return (
    <PaperCard>
      {(paper.links?.length > 0 || showBibtex) && (
        <LinkRow>
          {paper.links?.map(({ href, label }) => (
            <PublicationLinkButton
              key={href}
              as="a"
              href={href}
              target="__blank"
            >
              {label}
            </PublicationLinkButton>
          ))}
          {showBibtex && <BibtexButton paper={paper} />}
        </LinkRow>
      )}

      <div>
        <h3>{title}</h3>
        <Metadata>
          {paper.title && <span>{paper.venue}</span>}
          {paper.year && <span>{paper.year}</span>}
          {paper.status && <span>{paper.status}</span>}
        </Metadata>
      </div>

      {paper.authors && (
        <PeopleLine>{highlightOwnName(paper.authors)}</PeopleLine>
      )}
    </PaperCard>
  );
};

const PatentEntry = ({ patent }) => {
  const { t } = useTranslation();

  return (
    <PatentCard>
      <LinkRow>
        <PublicationLinkButton as="a" href={patent.links.src} target="__blank">
          {t("patents.see-patent")}
        </PublicationLinkButton>
        {patent.links.file && (
          <PublicationLinkButton
            as="a"
            href={patent.links.file}
            target="__blank"
          >
            PDF
          </PublicationLinkButton>
        )}
      </LinkRow>

      <div>
        <h3>{patent.title}</h3>
        <Metadata>
          <span>{patent.number}</span>
          <span>{patent.status}</span>
          <span>{patent.date}</span>
        </Metadata>
      </div>

      <PeopleLine>
        {t("patents.inventors")}: {highlightOwnName(patent.inventor)}
      </PeopleLine>
    </PatentCard>
  );
};

const Publications = ({ papers, patents }) => {
  const { t } = useTranslation();
  const journalPapers = papers.filter(({ kind }) => kind === "journal");
  const conferencePapers = papers.filter(({ kind }) => kind === "conference");
  const preprints = papers.filter(({ kind }) => kind === "preprint");
  const talks = papers.filter(({ kind }) => kind === "talk");

  return (
    <PublicationsWrapper>
      <PageHeader>{t("publications.title")}</PageHeader>
      <PublicationsIntro>{t("publications.intro")}</PublicationsIntro>

      {journalPapers.length > 0 && (
        <PublicationSection>
          <SectionHeading>{t("publications.journal-papers")}</SectionHeading>
          <PaperList>
            {journalPapers.map((paper) => (
              <PaperEntry
                key={`${paper.kind}-${paper.venue}-${paper.year}`}
                paper={paper}
              />
            ))}
          </PaperList>
        </PublicationSection>
      )}

      {conferencePapers.length > 0 && (
        <PublicationSection>
          <SectionHeading>{t("publications.conference-papers")}</SectionHeading>
          <PaperList>
            {conferencePapers.map((paper) => (
              <PaperEntry
                key={`${paper.kind}-${paper.title}-${paper.year}`}
                paper={paper}
              />
            ))}
          </PaperList>
        </PublicationSection>
      )}

      {preprints.length > 0 && (
        <PublicationSection>
          <SectionHeading>{t("publications.preprints")}</SectionHeading>
          <PaperList>
            {preprints.map((paper) => (
              <PaperEntry
                key={`${paper.kind}-${paper.title}-${paper.year}`}
                paper={paper}
              />
            ))}
          </PaperList>
        </PublicationSection>
      )}

      {patents.length > 0 && (
        <PublicationSection>
          <SectionHeading>{t("publications.patents")}</SectionHeading>
          <PatentGrid>
            {patents.map((patent) => (
              <PatentEntry key={patent.id} patent={patent} />
            ))}
          </PatentGrid>
        </PublicationSection>
      )}

      {talks.length > 0 && (
        <PublicationSection>
          <SectionHeading>{t("publications.talks")}</SectionHeading>
          <PaperList>
            {talks.map((paper) => (
              <PaperEntry
                key={`${paper.kind}-${paper.title}-${paper.year}`}
                paper={paper}
              />
            ))}
          </PaperList>
        </PublicationSection>
      )}
    </PublicationsWrapper>
  );
};

export default Publications;
