import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "gatsby-plugin-react-i18next";

const DEFAULT_VISIBLE_COUNT = 5;

const NewsContainer = styled.article`
  position: relative;
  width: 100%;
  margin: 20px 0;
  padding: 24px;
  border-radius: 10px;
  border: 1px solid ${(p) => (p.theme.dark ? "#333333" : "#eef1f8")};
  background-color: ${(p) => p.theme.secondaryColor};
  box-shadow: ${(props) => props.theme.shadowSmall};
`;

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NewsItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: 16px;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
  color: ${(p) => p.theme.textColor};

  &:last-child {
    margin-bottom: 0;
  }

  .news-time {
    flex: 0 0 92px;
    color: ${(p) => p.theme.primaryColor};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .news-content {
    color: ${(p) => p.theme.textColor};
  }

  @media ${(p) => p.theme.media.mobile} {
    flex-direction: column;
    gap: 2px;

    .news-time {
      flex: none;
    }
  }
`;

const ToggleButton = styled.button`
  display: inline-block;
  margin-top: 14px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  color: ${(p) => p.theme.primaryColor};

  &:hover {
    text-decoration: underline;
  }
`;

const formatDate = (dateStr, language) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    if (language === "zh") {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return dateStr;
  }
};

const parseItem = (item) => {
  if (typeof item === "string" && item.includes(" ")) {
    const [time, ...contentParts] = item.split(" ");
    return { time, content: contentParts.join(" ") };
  }
  if (typeof item === "object" && item !== null && item.time && item.content) {
    return { time: item.time, content: item.content };
  }
  return { time: null, content: item };
};

const News = ({ children, items, visibleCount = DEFAULT_VISIBLE_COUNT }) => {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (items && Array.isArray(items)) {
    const visibleItems = expanded ? items : items.slice(0, visibleCount);
    const hasMore = items.length > visibleCount;

    return (
      <NewsContainer>
        <NewsList>
          {visibleItems.map((item, index) => {
            const { time, content } = parseItem(item);
            return (
              <NewsItem key={index}>
                {time && (
                  <span className="news-time">
                    {formatDate(time, i18n.language)}
                  </span>
                )}
                <span className="news-content">{content}</span>
              </NewsItem>
            );
          })}
        </NewsList>
        {hasMore && (
          <ToggleButton
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            {expanded
              ? t("common.show-less", "Show less")
              : t("common.show-more", "Show more ({{count}})", {
                  count: items.length - visibleCount,
                })}
          </ToggleButton>
        )}
      </NewsContainer>
    );
  }

  return <NewsContainer>{children}</NewsContainer>;
};

News.propTypes = {
  children: PropTypes.node,
  visibleCount: PropTypes.number,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        time: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
      }),
    ])
  ),
};

export default News;
