import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as chai from 'chai';
import * as chaiSpies from 'chai-spies';
import { renderIntoDocument } from '../../TestUtils';

import { Layout } from '../../../sources';

const expect = chai.expect;
chai.use(chaiSpies);

describe('Layout', () => {
    it('should throw error whenever children prop is empty', () => {
        const spy = chai.spy.on(console, 'error');
        renderIntoDocument(<Layout />);
        expect(spy).to.be.called.once;
        expect(spy).to.be.called.with('Warning: Layout should have one child at least');
    });

    it('should be defined and have div element in the root', () => {
        let container = renderIntoDocument(<Layout />);
        let domElement = ReactDOM.findDOMNode(container);

        expect(domElement).to.exist;
        expect(domElement.tagName).to.be.oneOf(['div', 'DIV']);
    });
});
