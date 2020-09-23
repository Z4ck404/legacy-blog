import React from 'react';
import _ from 'lodash';
import moment from 'moment-strftime';
import {graphql} from 'gatsby';

import {Layout} from '../components/index';
import {withPrefix, htmlToReact} from '../utils';

// this minimal GraphQL query ensures that when 'gatsby develop' is running,
// any changes to content files are reflected in browser
export const query = graphql`
  query($url: String) {
    sitePage(path: {eq: $url}) {
      id
    }
  }
`;

export default class Post extends React.Component {
    render() {
        return (
            <Layout {...this.props}>
            <section className="post">
                {_.get(this.props, 'pageContext.frontmatter.content_img_path', null) && (
                <img className="header-image" src={withPrefix(_.get(this.props, 'pageContext.frontmatter.content_img_path', null))} alt=""/>
                )}
                <header className="hero">
                    <div className="copy">
                        <h1>{_.get(this.props, 'pageContext.frontmatter.title', null)}</h1>
                        {_.get(this.props, 'pageContext.frontmatter.subtitle', null) && (
                        <h3>{htmlToReact(_.get(this.props, 'pageContext.frontmatter.subtitle', null))}</h3>
                        )}
                        <h3 className="publish-date">{moment(_.get(this.props, 'pageContext.frontmatter.date', null)).strftime('%A, %B %e, %Y')}</h3>
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
