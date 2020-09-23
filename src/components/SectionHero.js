import React from 'react';
import _ from 'lodash';

import {withPrefix, markdownify} from '../utils';

export default class SectionHero extends React.Component {
    render() {
        let section = _.get(this.props, 'section', null);
        return (
            <section id={_.get(this.props, 'section.section_id', null)} className="hero">
                {(_.get(section, 'image', null) || _.get(this.props, 'pageContext.site.data.author.avatar', null)) && (<img src={(_.get(section, 'image', null) ? (withPrefix(_.get(section, 'image', null))) : withPrefix(_.get(this.props, 'pageContext.site.data.author.avatar', null)))}/>)}
                {(_.get(section, 'title', null) || _.get(section, 'subtitle', null)) && (
                <div className="copy">
                    {_.get(section, 'title', null) && (
                    <h1>{_.get(section, 'title', null)}</h1>
                    )}
                    {_.get(section, 'subtitle', null) && (
                    <div>{markdownify(_.get(section, 'subtitle', null))}</div>
                    )}
                </div>
                )}
            </section>
        );
    }
}
