import * as React from 'react';
import * as chai from 'chai';
import * as chaiEnzyme from 'chai-enzyme';
import { shallow, mount } from 'enzyme';

import { Container } from '../sources/container/container';

//import { globalJsdom } from './jsdom-helper';

const expect = chai.expect;
chai.use(chaiEnzyme());

describe('Container', () => {
    // let jsdom: () => void;
    // beforeEach((done: () => void) => {
    //     jsdom = globalJsdom();
    //     done();
    // });

    // afterEach((done: () => void) => {
    //     jsdom();
    //     done();
    // });
    
    it('should be defined', () => {
        let wrapper = shallow(<Container overflowX="auto" overflowY="auto"/>);
        expect(wrapper).is.to.be;
    });

    it('should be able to unmount', () => {
        let wrapper = shallow(<Container overflowX="auto" overflowY="auto"/>);
        wrapper.unmount();
        expect(wrapper).is.to.be;
    });

    it('should have one div inside', () => {
        let wrapper = shallow(<Container overflowX="auto" overflowY="auto"/>);
        expect(wrapper.find('div')).to.have.length(1);
    });

    it('should have a class "react-container-container"', () => {
        let wrapper = shallow(<Container overflowX="auto" overflowY="auto"/>);
        expect(wrapper.find('div')).to.have.className('react-container-container');
    });

    it('should render into document', () => {
        let wrapper = mount(<Container overflowX="auto" overflowY="auto"/>);
        expect(wrapper).is.to.be;
    });

    // it('should be able to resize', () => {
    //     let wrapper = mount(<Container overflowX="auto" overflowY="auto"/>);
    //     expect(wrapper).is.to.be;
    //     window.dispatchEvent(new UIEvent('resize'));
    // });
});