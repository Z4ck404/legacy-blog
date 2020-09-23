import React from 'react';
import _ from 'lodash';

import {htmlToReact, Link, withPrefix} from '../utils';

export default class Footer extends React.Component {
    render() {
        return (
            <footer className="footer container">
                {_.get(this.props, 'pageContext.site.siteMetadata.footer.content', null) && (
                <div className="copyright">{htmlToReact(_.get(this.props, 'pageContext.site.siteMetadata.footer.content', null))}</div>
                )}
                {_.get(this.props, 'pageContext.site.siteMetadata.footer.links', null) && (
                <nav>
                    {_.map(_.get(this.props, 'pageContext.site.siteMetadata.footer.links', null), (link, link_idx) => (
                    <Link key={link_idx} className="subtle-link" to={withPrefix(_.get(link, 'url', null))}{...(_.get(link, 'new_window', null) ? ({target: '_blank', rel: 'noopener'}) : null)}>{_.get(link, 'label', null)}</Link>
                    ))}
                </nav>
                )}
                {_.get(this.props, 'pageContext.site.siteMetadata.footer.has_social', null) && (
                <div className="social-links">
                    {_.map(_.get(this.props, 'pageContext.site.siteMetadata.footer.social_links', null), (link, link_idx) => (
                    link && (
                    <Link key={link_idx} className="subtle-link" to={withPrefix(_.get(link, 'url', null))}{...(_.get(link, 'new_window', null) ? ({target: '_blank', rel: 'noopener'}) : null)}>{_.get(link, 'label', null)}</Link>
                    )
                    ))}
                </div>
                )}
            </footer>
        );
    }
}
