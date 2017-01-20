import * as React from 'react';

import { LayoutSplitterProps, layoutSplitterPropTypes } from  './LayoutSplitterProps';
import { MouseCapture } from  '../../../utils';

import '../../../styles/layout-splitter.css';

export namespace Internal {
    export class LayoutSplitter extends React.PureComponent<LayoutSplitterProps, {}> {
        static propTypes = layoutSplitterPropTypes;

        constructor(props?: LayoutSplitterProps) {
            super(props);
            this.handleMouseDown = this.handleMouseDown.bind(this);
            this.handleWindowMouseMove = this.handleWindowMouseMove.bind(this);
            this.handleReleaseMouseCapture = this.handleReleaseMouseCapture.bind(this);
        }

        startCoord: number = 0;
        mouseCapture?: MouseCapture = undefined;

        handleMouseDown: React.EventHandler<React.MouseEvent<HTMLDivElement>> = (e) => {
            this.mouseCapture = MouseCapture.captureMouseEvents(e.nativeEvent, this.handleWindowMouseMove, this.handleReleaseMouseCapture);
            this.startCoord = this.props.orientation === 'top' || this.props.orientation === 'bottom'
                ? e.pageY  - this.props.top : e.pageX - this.props.left;
        }

        handleWindowMouseMove: (e: MouseEvent) => void = (e) => {
            let newCoord = (this.props.orientation === 'top' || this.props.orientation === 'bottom' ? e.pageY : e.pageX) - this.startCoord;
            if (this.props.onResizing) {
                this.props.onResizing(newCoord);
            }
        }

        handleReleaseMouseCapture: () => void = () => {
            if (this.mouseCapture) {
                this.mouseCapture = undefined;
                if (this.props.onResizeEnd) {
                    this.props.onResizeEnd();
                }
            }
        }

        getClassName(): string {
            return this.props.orientation === 'top' || this.props.orientation === 'bottom'
                ? 'layout-vert-splitter' : 'layout-horz-splitter';
        }

        getStyle(): React.CSSProperties {
            switch(this.props.orientation) {
                case 'top':
                    return {
                        heigth: 6,
                        left: this.props.left,
                        right: this.props.right,
                        top: this.props.top - 3
                    };
                case 'bottom':
                    return {
                        bottom: this.props.bottom - 3,
                        heigth: 6,
                        left: this.props.left,
                        right: this.props.right
                    };
                case 'left':
                    return {
                        bottom: this.props.bottom,
                        left: this.props.left - 3,
                        top: this.props.top,
                        width: 6
                    };
                case 'right':
                    return {
                        bottom: this.props.bottom,
                        right: this.props.right - 3,
                        top: this.props.top,
                        width: 6
                    };
                default:
                    return {
                    };
            }
        }

        render(): JSX.Element {
            return (
                <div className={this.getClassName()}
                    style={this.getStyle()}
                    onMouseDown={this.handleMouseDown}>
                </div>
            );
        }
    }
}
