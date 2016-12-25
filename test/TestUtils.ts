import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

export function renderIntoDocument<P, S, T extends React.Component<P, S>>(element: React.ReactElement<P>): T {
    return TestUtils.renderIntoDocument<P>(element) as T;
}

export function unmountComponent<P, S>(component: React.Component<P, S>): void {
    let element = ReactDOM.findDOMNode(component);
    let parent = element.parentElement;
    if (parent) {
        ReactDOM.unmountComponentAtNode(parent);
    }
}

export function findRenderedComponentWithType<P, S, P2, S2,
    T extends React.Component<P2, S2>,
    C extends React.ComponentClass<P2>>(
    root: React.Component<P, S> | void | Element,
    type: React.ClassType<P2, T, C>): T {
    return TestUtils.findRenderedComponentWithType(root as React.Component<P, S>, type) as T;
}

export function scryRenderedComponentsWithType<P, S, P2, S2,
    T extends React.Component<P2, S2>,
    C extends React.ComponentClass<P2>>(
    root: React.Component<P, S> | void | Element,
    type: React.ClassType<P2, T, C>): T[] {
    if (typeof root === 'undefined' || typeof root === 'Element') {
        return [];
    }
    return TestUtils.scryRenderedComponentsWithType(root, type) as T[];
}

export function simulateScroll(element: Element, scrollLeft?: number, scrollTop?: number): void {
    if (scrollLeft) {
        element.scrollLeft = scrollLeft;
    }

    if (scrollTop) {
        element.scrollTop = scrollTop;
    }

    let e = document.createEvent('CustomEvent');
    e.initCustomEvent('scroll', true, true, null);
    element.dispatchEvent(e);
}
