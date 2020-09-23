import React from 'react';
import {Helmet} from 'react-helmet';
import _ from 'lodash';

import '../sass/main.scss';
import Header from './Header';
import Footer from './Footer';

export default class Body extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>{_.get(this.props, 'pageContext.frontmatter.title', null) && (_.get(this.props, 'pageContext.frontmatter.title', null) + ' - ')}{_.get(this.props, 'pageContext.site.siteMetadata.title', null)}</title>
                    <meta charSet="utf-8"/>
                    <meta name="viewport" content="width=device-width, initialScale=1, userScalable=no" />
                    <meta name="description" content={_.get(this.props, 'pageContext.frontmatter.excerpt', null) || _.get(this.props, 'pageContext.site.siteMetadata.description', null)}/>
                    <meta name="google" content="notranslate" />
                    {(_.get(this.props, 'pageContext.frontmatter.template', null) === 'post') && ( 
                    _.get(this.props, 'pageContext.frontmatter.canonical_url', null) && (
                    <link rel="canonical" href={_.get(this.props, 'pageContext.frontmatter.canonical_url', null)}/>
                    )
                    )}
                </Helmet>
                <div className="wrapper">
                    <Header {...this.props} />
                    <div className="container">
                        {this.props.children}
                    </div>
                    <Footer {...this.props} />
                </div>
            </React.Fragment>
        );
    }
}
