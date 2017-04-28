import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';
import { KeyConsts } from '../sources/utils';

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
    if (typeof root === 'undefined' || root instanceof Element) {
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

const keyCodeToKey: { [keyCode: number]: string} = {
    [KeyConsts.ARROW_DOWN]: 'ArrowDown',
    [KeyConsts.ARROW_UP]: 'ArrowUp',
    [KeyConsts.ARROW_LEFT]: 'ArrowLeft',
    [KeyConsts.ARROW_RIGHT]: 'ArrowRight',
}

function simulateKeyEvent(element: Element, type: 'keyup' | 'keydown'| 'keypress', keyCode: KeyConsts): void {
    let key = keyCodeToKey[keyCode];
    let e = document.createEvent('KeyboardEvent');
    if ('initKeyEvent' in e) {
        // FF
        // tslint:disable-next-line:no-any
        (e as any).initKeyEvent(type, true, true, window, false, false, false, false, keyCode, 0);
    } else {
        // Chrome, PhantomJS, IE ...
        e.initKeyboardEvent(type, true, true, window, key, 0, '', false, '');
    }
    element.dispatchEvent(e);
}

export function simulateKeyDown(element: Element, keyCode: KeyConsts) {
    simulateKeyEvent(element, 'keydown', keyCode);
}

export function simulateKeyUp(element: Element, keyCode: KeyConsts) {
    simulateKeyEvent(element, 'keyup', keyCode);
}

export function simulateKeyPress(element: Element, keyCode: KeyConsts) {
    simulateKeyEvent(element, 'keypress', keyCode);
}
