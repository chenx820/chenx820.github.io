import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { graphql } from "gatsby";
import { Trans, useTranslation } from "gatsby-plugin-react-i18next";
import SEO from "@components/seo";

import Layout from "@components/Layout/Layout";

const UnstyledUl = styled.ul`
  list-style: initial;
  margin-left: 15px;
  line-height: 30px;
  font-weight: 600;
`;

const Goodies = () => {
  const { t } = useTranslation();
  const [links, setLinks] = useState();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("https://api.github.com/gists/0d7483bb276abfa9f0bc074b954add1c")
      .then((res) => res.json())
      .then((data) => {
        setLinks(JSON.parse(data.files["goodies.json"].content));
      })
      .catch(() => setFailed(true));
  }, []);

  return (
    <Layout>
      <SEO title={t("goodies.title") + " | " + t("global.name")} />

      <h1>{t("goodies.title")}</h1>
      <p>{t("goodies.intro")}</p>
      <hr />

      {!links && <p>{t(failed ? "goodies.load-error" : "common.loading")}</p>}
      {links &&
        Object.entries(links).map((obj) => {
          return (
            <React.Fragment key={obj[0]}>
              <h2>{obj[0]}</h2>
              <UnstyledUl>
                {obj[1].map((link) => {
                  return (
                    <li key={link[0]}>
                      <a target="__blank" href={link[0]}>
                        {link[1]}
                      </a>
                    </li>
                  );
                })}
              </UnstyledUl>
            </React.Fragment>
          );
        })}
    </Layout>
  );
};

export default Goodies;

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
