import React from "react";

import Layout from "@components/Layout/Layout";
import { PageHead } from "@components/seo";

import { Link, Trans, useTranslation } from "gatsby-plugin-react-i18next";
const NotFoundPage = () => (
  <Layout>
    <PageHead title="404: Not found" />
    <h1>Opps, seems like you are lost!</h1>
    <p>
      Mind going back? or <Link to="/notes">read some notes</Link>
    </p>
  </Layout>
);

export default NotFoundPage;
