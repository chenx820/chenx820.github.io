import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import styled from "styled-components";

import PageHeader from "@common/PageHeader";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import PatentCard from "./PatentCard";

const PatentsWrapper = styled.section`
  ${(props) => props.theme.spacing.sectionBottom};

  width: 100%;
  height: 100%;

  padding: 0 0;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;

  .slick-slide {
    padding: 10px;
  }
`;

const Patents = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const patents = useStaticQuery(graphql`
    query {
      allPatentsJson {
        edges {
          node {
            id
            title
            date(formatString: "MMMM DD, YYYY", locale: "en")
            number
            status
            inventor
            links {
              src
              file
            }
            description
          }
        }
      }
      allPatentsZhJson {
        edges {
          node {
            id
            title
            date(formatString: "MMMM DD, YYYY", locale: "zh")
            number
            status
            inventor
            links {
              src
              file
            }
            description
          }
        }
      }
    }
  `);

  const patentData =
    currentLanguage === "zh"
      ? patents.allPatentsZhJson
      : patents.allPatentsJson;

  const settings = {
    dots: true,
    infinite: patentData.edges.length > 3,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: true,
    centerMode: true,
    centerPadding: "40px",
    swipeToSlide: true,
    arrows: false,
    accessibility: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          centerPadding: "15px",
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          speed: 500,
          slidesToShow: 1,
          centerPadding: "15px",
        },
      },
    ],
  };

  return (
    <PatentsWrapper id="patents">
      <PageHeader>{t("patents.title")}</PageHeader>
      <Slider {...settings}>
        {patentData.edges.map(({ node }) => (
          <PatentCard
            key={node.id}
            title={node.title}
            number={node.number}
            status={node.status}
            date={node.date}
            inventor={node.inventor}
            links={node.links}
            description={node.description}
          />
        ))}
      </Slider>
    </PatentsWrapper>
  );
};

export default Patents;
