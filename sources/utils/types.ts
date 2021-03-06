import * as PropTypes from 'prop-types';
import * as sprintf from 'fbjs/lib/sprintf';

export type Overflow = 'auto' | 'hidden' | 'scroll' | 'visible';

export const overflowPropType = PropTypes.oneOf([
    'auto',
    'hidden',
    'scroll',
    'visible'
]);

export type Size = '100%' | number;

export const sizePropType = PropTypes.oneOfType([
    PropTypes.oneOf(['100%']),
    PropTypes.number
]);

export type Edge = 'left' | 'right' | 'top' | 'bottom';

export const edgePropType = PropTypes.oneOf([
    'left',
    'right',
    'top',
    'bottom'
]);

export type Align = Edge | 'client';

export const alignPropType = PropTypes.oneOfType([
    edgePropType,
    PropTypes.oneOf(['client'])
]);

export function getOppositeEdge(align: Edge): Edge {
    switch (align) {
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        case 'bottom':
            return 'top';
        case 'top':
            return 'bottom';
        default:
            throw new Error(sprintf('Got unexpected "%s"', align));
    }
}

export function isHorizontal(align: Edge): boolean {
    return align === 'left' || align === 'right';
}

export function isVertical(align: Edge): boolean {
    return align === 'top' || align === 'bottom';
}

export type Direction = 'left' | 'right' | 'up' | 'down';

export const directionPropTypes = PropTypes.oneOf([
    'left',
    'right',
    'up',
    'down'
]);

export type TextAlign = 'left' | 'right' | 'center';

export const textAlignPropType = PropTypes.oneOf([
    'left',
    'right',
    'center'
]);
