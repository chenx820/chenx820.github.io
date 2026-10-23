import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "gatsby-plugin-react-i18next";

const SocialShareSection = ({ baseSlugUrl, title }) => {
  const { t } = useTranslation();
  const url = encodeURIComponent(baseSlugUrl);
  const text = encodeURIComponent(title);
  const fbShareLink = `https://facebook.com/sharer/sharer.php?u=${url}`;
  const twShareLink = `https://twitter.com/share?text=${text}&url=${url}`;
  const rdShareLink = `https://www.reddit.com/submit?url=${url}&title=${text}`;

  return (
    <div className="note__social-share">
      <a
        aria-label={t("common.share-platform", { platform: "Facebook" })}
        rel="noopener norefferer"
        target="__blank"
        href={fbShareLink}
      >
        <FontAwesomeIcon style={{ fontSize: 24 }} icon={["fab", "facebook"]} />
      </a>
      <a
        aria-label={t("common.share-platform", { platform: "Twitter" })}
        rel="noopener norefferer"
        target="__blank"
        href={twShareLink}
      >
        <FontAwesomeIcon style={{ fontSize: 24 }} icon={["fab", "twitter"]} />
      </a>
      <a
        aria-label={t("common.share-platform", { platform: "Reddit" })}
        rel="noopener norefferer"
        target="__blank"
        href={rdShareLink}
      >
        <FontAwesomeIcon style={{ fontSize: 24 }} icon={["fab", "reddit"]} />
      </a>
    </div>
  );
};

SocialShareSection.propTypes = {
  baseSlugUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default SocialShareSection;
