import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled from "styled-components";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ResearchLinks } from "./ResearchTemplate.style";
import { CardText } from "@common/Card";
import Button, { IconButton } from "@common/Button";

// import svg from '@src/static/skew_bg.svg'

const InnerContent = styled.div`
  padding: 190px 0;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`;

const BG = styled.div`
  position: absolute;
  z-index: 0;
  background: ${(p) =>
    p.theme.dark ? p.theme.secondaryColor : p.theme.primaryColor};
  transform: skewY(-3deg);
  right: 0;
  left: 0;
  width: 100%;
  min-height: 630px;
  max-height: 740px;
`;

const PatentWrapper = styled.section`
  ${(props) => props.theme.spacing.sectionBottom};

  margin-top: 100px;

  width: 100%;
  height: 100%;

  .slick-slide {
    padding: 10px;
  }
`;

const PatentCard = styled.div`
  /* because of project links */
  position: relative;
  
  background-color: ${(props) => props.theme.bg};
  border-radius: 10px;
  padding: 30px;
  height: 280px;

  h3 {
    /* color: ${(props) => props.theme.primaryColor}; */
    margin-bottom: 5px;
  }

  .patent__links {
    position: absolute;
    bottom: 20px;
  }
`;

const Patents = () => {
  const patents = useStaticQuery(
    graphql`
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
      }
    `
  );

  const settings = {
    dots: true,
    infinite: patents.allPatentsJson.edges.length > 3,
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

  const PatentTitle = styled.h1`
    position: absolute;
    top: 60px;
    right: 60px;
    transform: skewY(3deg);
    color: #f8f8f8;
    z-index: 1;
  `;

  return (
    <PatentWrapper>
      <BG>
        <PatentTitle>Patents</PatentTitle>
      </BG>
      <InnerContent>
        <Slider {...settings}>
          {patents.allPatentsJson.edges.map(({ node }) => (
            <PatentCard key={node.id}>
              <h4>{node.title}</h4>
              <CardText>
                {node.number} | {node.status} {node.date}
              </CardText>
              <CardText>Inventors: {node.inventor}</CardText>
              <ResearchLinks className="patent__links">
                <Button target="__blank" as="a" href={node.links.src}>
                  See Patent
                </Button>
                <IconButton
                  label="file"
                  icon={["fas", "file-pdf"]}
                  href={node.links.file}
                  target="__blank"
                />
              </ResearchLinks>
            </PatentCard>
          ))}
        </Slider>
      </InnerContent>
    </PatentWrapper>
  );
};

export default Patents;
