import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const NewsContainer = styled.article`
  position: relative;
  width: 100%;
  margin: 20px 0;
  padding: 20px;
  border-radius: 10px;
  background-color: ${(p) =>
    p.theme.dark ? p.theme.accentColor : p.theme.secondaryColor};
  box-shadow: ${(props) => props.theme.shadowSmall};
`;

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NewsItem = styled.li`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  color: ${(p) => (p.theme.dark ? p.theme.textColor : p.theme.primaryColor)};

  &:last-child {
    margin-bottom: 0;
  }

  .news-time {
    color: ${(p) => p.theme.primaryColor};
    font-weight: 600;
    margin-right: 12px;
  }

  .news-content {
    color: ${(p) => (p.theme.dark ? p.theme.textColor : p.theme.primaryColor)};
  }
`;

const News = ({ children, items }) => {
  if (items && Array.isArray(items)) {
    return (
      <NewsContainer>
        <NewsList>
          {items.map((item, index) => {
            // 如果item是字符串且包含空格，则分割为时间和内容
            if (typeof item === "string" && item.includes(" ")) {
              const [time, ...contentParts] = item.split(" ");
              const content = contentParts.join(" ");

              // 格式化日期显示
              const formatDate = (dateStr) => {
                try {
                  const date = new Date(dateStr);
                  if (isNaN(date.getTime())) {
                    return dateStr; // 如果不是有效日期，返回原字符串
                  }
                  return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                } catch (error) {
                  return dateStr; // 如果解析失败，返回原字符串
                }
              };

              return (
                <NewsItem key={index}>
                  <span className="news-time">{formatDate(time)}</span>
                  <span className="news-content">{content}</span>
                </NewsItem>
              );
            }
            // 如果item是对象，则使用time和content属性
            if (typeof item === "object" && item.time && item.content) {
              const formatDate = (dateStr) => {
                try {
                  const date = new Date(dateStr);
                  if (isNaN(date.getTime())) {
                    return dateStr;
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

              return (
                <NewsItem key={index}>
                  <span className="news-time">{formatDate(item.time)}</span>
                  <span className="news-content">{item.content}</span>
                </NewsItem>
              );
            }
            // 默认情况，直接显示item
            return <NewsItem key={index}>{item}</NewsItem>;
          })}
        </NewsList>
      </NewsContainer>
    );
  }

  return <NewsContainer>{children}</NewsContainer>;
};

News.propTypes = {
  children: PropTypes.node,
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
