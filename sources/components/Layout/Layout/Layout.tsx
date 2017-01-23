import * as React from 'react';
import { List } from 'immutable';

import { LayoutProps, layoutPropTypes } from  './LayoutProps';
import { LayoutState, LayoutChildState, LayoutPanelChildState, LayoutSplitterChildState } from  './LayoutState';
import { LayoutPanel } from  '../LayoutPanel';
import { LayoutPanelProps } from  '../LayoutPanel/LayoutPanelProps';
import { Internal } from  '../InternalLayoutPanel';
// TODO: How to avoid alias for namespace here
import { Internal as Internal2} from  '../InternalLayoutSplitter';
import { LayoutSplitter } from  '../LayoutSplitter';
import { classNames } from '../../../utils';

import '../../../styles/layout.css';
import '../../../styles/common.css';

export class Layout extends React.PureComponent<LayoutProps, LayoutState> {

    static propTypes = layoutPropTypes;

    constructor(props?: LayoutProps) {
        super(props);

        this.state = this.calculateState(this.props);
    }

    calculateState(props: { children?: React.ReactNode }): LayoutState {
        let newCoords = {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0
        };

        let prevAlign: 'left' | 'right' | 'top' | 'bottom' | undefined = undefined;

        function calculatePanelState(panelProps: LayoutPanelProps): LayoutPanelChildState | undefined {
            let { align } = panelProps;

            let state: LayoutPanelChildState = {
                align,
                bottom: align !== 'top' ? newCoords.bottom : undefined,
                height: panelProps.height,
                left: align !== 'right' ? newCoords.left : undefined,
                right: align !== 'left' ? newCoords.right : undefined,
                top: align !== 'bottom' ? newCoords.top : undefined,
                type: 'panel',
                width: panelProps.width
            };

            prevAlign = align === 'client' ? undefined : align;
            if (align !== 'client') {
                newCoords[align] += panelProps[getMeasurementByAlign(align)];
            }

            return state;
       }

        function calculateSplitterState(align: 'left' | 'right' | 'bottom' | 'top'): LayoutSplitterChildState {
            return {
                bottom: align === 'top' ? undefined : newCoords.bottom,
                left: align === 'right' ? undefined : newCoords.left,
                orientation: align,
                right: align === 'left' ? undefined : newCoords.right,
                top: align === 'bottom' ? undefined : newCoords.top,
                type: 'splitter'
            };
        }

        let childrenStates: LayoutChildState[] = React.Children.map(props.children, (child, index) => {
            if (typeof child === 'string' || typeof child === 'number') {
                return undefined;
            } else if (child.type === LayoutPanel ) {
                return calculatePanelState(child.props as LayoutPanelProps);
            } else if (child.type === LayoutSplitter && prevAlign !== undefined) {
                return calculateSplitterState(prevAlign);
            } else {
                return undefined;
            }
        });

        for (let i = 0; i < childrenStates.length; i++) {
            let state = childrenStates[i];
            if (state && state.type === 'splitter') {
                // TODO: Splitters must be processed as siblings as well as panels.
                let prevIndexes = [];
                for (let j = i - 1; j >= 0; j--) {
                    let panelState = childrenStates[j];
                    if (panelState && panelState.type === 'panel' && isPanelPreviousForSplitter(panelState, state)) {
                        prevIndexes.push(j);
                    }
                }

                let nextIndexes = [];
                for (let j = i + 1; j < childrenStates.length; j++) {
                    let panelState = childrenStates[j];
                    if (panelState && panelState.type === 'panel' && isPanelNextForSplitter(panelState, state)) {
                        nextIndexes.push(j);
                    }
                }

                state.onResizing = this.handleSplitterResizing.bind(this, i, prevIndexes, nextIndexes);
                state.onResizeEnd = this.handleSplitterResizeEnd.bind(this, i, prevIndexes, nextIndexes);
            }
        }

        return {
            childrenStates: List(childrenStates)
        };
    }

    handleSplitterResizing: (splitterIndex: number, prevIndexes: Array<number>, nextIndexes: Array<number>, newCoord: number) => void =
        (splitterIndex, prevIndexes, nextIndexes, newCoord) => {

        function clone(state: LayoutChildState): LayoutChildState {
            let result = { ...state };
            return result;
        }

        let states = this.state.childrenStates;
        let splitterState = clone(states.get(splitterIndex));
        if (splitterState && splitterState.type === 'splitter') {
            let splitterOrientation = splitterState.orientation;

            prevIndexes.forEach((value) => {
                let panelState = clone(states.get(value));
                if (panelState && panelState.type === 'panel') {
                    // Prev for left splitter must be left panel
                    panelState[getMeasurementByAlign(splitterOrientation)] = newCoord - panelState[splitterOrientation];
                    states = states.set(value, panelState);
                }
            });

            nextIndexes.forEach((value) => {
                let panelState = clone(states.get(value));
                if (panelState && panelState.type === 'panel' && panelState.align !== getOppositeAlign(splitterOrientation)) {
                    if (panelState.align === splitterOrientation) {
                        panelState[getMeasurementByAlign(splitterOrientation)] =
                            panelState[getMeasurementByAlign(splitterOrientation)] - newCoord + panelState[splitterOrientation];
                    }
                    panelState[splitterOrientation] = newCoord;
                    states = states.set(value, panelState);
                }
            });
            splitterState[splitterOrientation] = newCoord;
            states = states.set(splitterIndex, splitterState);
        }
        this.setState({childrenStates: states});
    }

    handleSplitterResizeEnd: (splitterIndex: number, prevIndexes: Array<number>, nextIndexes: Array<number>) => void =
        (splitterIndex, prevIndexes, nextIndexes) => {
        return;
    }

    componentWillReceiveProps(nextProps: { children?: React.ReactNode }): void {
        this.setState(this.calculateState(nextProps));
    }

    render(): JSX.Element {
        let children: React.ReactNode = React.Children.map(this.props.children, (child, index) => {
            let childState = this.state.childrenStates.get(index);
            if (childState) {
                switch (childState.type) {
                    case 'panel':
                        let panelProps = (child as React.ReactElement<LayoutPanelProps & {children?: React.ReactChildren}>).props;
                        return (
                            <Internal.LayoutPanel
                                top={childState.top}
                                bottom={childState.bottom}
                                left={childState.left}
                                right={childState.right}
                                width={childState.width}
                                height={childState.height}
                                showBottomShadow={panelProps.showBottomShadow}
                                showRightShadow={panelProps.showRightShadow}
                            >
                                {panelProps.children}
                            </Internal.LayoutPanel>
                        );
                    case 'splitter':
                        return (
                            <Internal2.LayoutSplitter orientation={childState.orientation!}
                                top={childState.top}
                                left={childState.left}
                                bottom={childState.bottom}
                                right={childState.right}
                                onResizing={childState.onResizing}
                                onResizeEnd={childState.onResizeEnd}
                            />
                        );
                    default:
                        break;
                }
            }
            return child;
        });

        let component = (
            <div
                className={classNames('layout-container', this.props.className)}
                style={{
                    height: this.props.height,
                    width: this.props.width
                }}
            >
                {children}
            </div>
        );

        return component;
    }
}

function isPanelPreviousForSplitter(panel: LayoutPanelChildState, splitter: LayoutSplitterChildState): boolean {
    return splitter[splitter.orientation] === panel[splitter.orientation] + panel[getMeasurementByAlign(splitter.orientation)];
}

function isPanelNextForSplitter(panel: LayoutPanelChildState, splitter: LayoutSplitterChildState): boolean {
    return splitter[splitter.orientation] === panel[splitter.orientation];
}

function getOppositeAlign(align: 'left' | 'right' | 'top' | 'bottom'): 'left' | 'right' | 'top' | 'bottom' {
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
            throw new Error('Unexpected error');
    }
}

function getMeasurementByAlign(align: 'left' | 'right' | 'top' | 'bottom'): 'height' | 'width' {
    switch (align) {
        case 'left':
        case 'right':
            return 'width';
        case 'bottom':
        case 'top':
            return 'height';
        default:
            throw new Error('Unexpected error');
    }
}
