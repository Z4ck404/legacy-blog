import React from 'react';
import _ from 'lodash';
import {graphql} from 'gatsby';

import {Layout} from '../components/index';
import {htmlToReact} from '../utils';

// this minimal GraphQL query ensures that when 'gatsby develop' is running,
// any changes to content files are reflected in browser
export const query = graphql`
  query($url: String) {
    sitePage(path: {eq: $url}) {
      id
    }
  }
`;

export default class Page extends React.Component {
    render() {
        return (
            <Layout {...this.props}>
            <section className="page">
                <header className="hero">
                    <div className="copy">
                        <h1>{_.get(this.props, 'pageContext.frontmatter.title', null)}</h1>
                        {_.get(this.props, 'pageContext.frontmatter.subtitle', null) && (
                        <h3>{htmlToReact(_.get(this.props, 'pageContext.frontmatter.subtitle', null))}</h3>
                        )}
                    </div>
                </header>
                <div className="content">
                    {htmlToReact(_.get(this.props, 'pageContext.html', null))}
                </div>
            </section>
            </Layout>
        );
    }
}
