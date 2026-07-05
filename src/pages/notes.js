import React, { useMemo, useState } from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import styled from "styled-components";
import SEO from "@components/seo";

import Layout from "@components/Layout/Layout";
import NoteCard from "@components/Notes/NoteCard";
import NoteLayout from "@components/Notes/NotesLayout";
import ScrollExtras from "@common/ScrollExtras";

const SearchInput = styled.input`
  width: 100%;
  margin-bottom: 28px;
  padding: 12px 16px;
  font-size: 15px;
  font-family: inherit;
  color: ${(p) => p.theme.textColor};
  background: ${(p) => p.theme.secondaryColor};
  border: 1px solid ${(p) => (p.theme.dark ? "#333333" : "#eef1f8")};
  border-radius: 10px;
  box-shadow: ${(p) => p.theme.shadowSmall};
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${(p) => p.theme.primaryColor};
  }

  &::placeholder {
    color: ${(p) => (p.theme.dark ? "#888888" : "#a4adc4")};
  }
`;

const NoResults = styled.p`
  color: ${(p) => p.theme.textColor};
  opacity: 0.7;
`;

const NotesPage = ({ data }) => {
  const { t } = useTranslation();
  const { allMarkdownRemark } = data;
  const [query, setQuery] = useState("");

  const filteredEdges = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return allMarkdownRemark.edges;
    }
    return allMarkdownRemark.edges.filter(({ node }) => {
      const haystack = [
        node.frontmatter.title,
        node.excerpt,
        node.frontmatter.institution,
        ...(node.frontmatter.notetags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [query, allMarkdownRemark.edges]);

  return (
    <Layout>
      <SEO title={t("notes.title") + " | " + t("global.name")} />

      <NoteLayout>
        <SearchInput
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("notes.search-placeholder", "Search notes...")}
          aria-label={t("notes.search-placeholder", "Search notes...")}
        />

        {filteredEdges.length === 0 && (
          <NoResults>{t("notes.no-results", "No notes found.")}</NoResults>
        )}

        {filteredEdges.map(({ node }) => (
          <NoteCard
            key={node.id}
            slug={node.fields.slug}
            title={node.frontmatter.title}
            date={node.frontmatter.date}
            notetags={node.frontmatter.notetags}
            institution={node.frontmatter.institution}
            excerpt={node.excerpt}
          />
        ))}
      </NoteLayout>

      <ScrollExtras showProgress={false} />
    </Layout>
  );
};

export default NotesPage;

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
    allMarkdownRemark(
      filter: {
        fields: { posttype: { eq: "notes" }, language: { eq: $language } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY", locale: $language)
            notetags
            institution
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
