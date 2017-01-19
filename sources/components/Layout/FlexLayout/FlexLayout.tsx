import * as React from 'react';

import { LayoutProps, layoutPropTypes } from  './FlexLayoutProps';
import { LayoutState } from  './FlexLayoutState';
import { LayoutChildContext, layoutChildContextTypes } from './FlexLayoutContext';
// import { LayoutSplitter } from  '../LayoutSplitter';

import { classNames } from '../../../utils';

import '../../../styles/flex-layout.css';

export class Layout extends React.PureComponent<LayoutProps, LayoutState> {

    static defaultProps: LayoutProps = {
        showSplitter: false
    };

    static propTypes = layoutPropTypes;

    static contextTypes = layoutChildContextTypes;
    static childContextTypes = layoutChildContextTypes;

    constructor(props?: LayoutProps, context?: LayoutChildContext) {
        super(props, context);
        this.handleSplitterResizing = this.handleSplitterResizing.bind(this);
        this.handleSplitterResizeEnd = this.handleSplitterResizeEnd.bind(this);
        this.state = {
            splitterCoord: this.getInitialSplitterCoord()
        };
    }

    getChildContext(): LayoutChildContext {
        return {
            orientation: this.props.orientation ? this.props.orientation : this.context.orientation,
            parent: this
        };
    }

    ref: HTMLDivElement | undefined = undefined;

    handleSplitterResizing: (newCoord: number) => void = (newCoord) => {
        if (this.ref) {
            if (this.context.orientation === 'vertical') {
                this.ref.style.height = newCoord + 'px';
            } else if (this.context.orientation === 'horizontal') {
                this.ref.style.width = newCoord + 'px';
            }
            this.setState({
                splitterCoord: this.context.orientation === 'vertical' ? this.ref.offsetHeight : this.ref.offsetWidth
            });
        }
    }

    handleSplitterResizeEnd: () => void = () => {
        if (this.ref) {
            this.setState({
                splitterCoord: this.context.orientation === 'vertical' ? this.ref.offsetHeight : this.ref.offsetWidth
            });
        }
    }

    getInitialSplitterCoord(): number {
        if (this.context.orientation === 'vertical' && typeof this.props.height === 'number') {
            return this.props.height;
        } else if (this.context.orientation === 'horizontal' && typeof this.props.width === 'number') {
            return this.props.width;
        }
        return 0;
    }

    componentDidMount(): void {
        if (this.props.showSplitter && this.ref) {
            this.setState({
                splitterCoord: this.context.orientation === 'vertical' ? this.ref.offsetHeight : this.ref.offsetWidth
            });
        }
    }

    render(): JSX.Element | null {
        let layoutPaneStyle: {};
        let className: string;
        if (this.context.orientation === 'vertical') {
            className = this.props.height === '100%' ? 'layout-second' : 'layout-vert-first';
            layoutPaneStyle = {
                height: this.props.height
            };
        } else {
            className = this.props.width === '100%' ? 'layout-second' : 'layout-horz-first';
            if (this.props.width !== '100%') {
                layoutPaneStyle = {
                    width: this.props.width
                };
            } else {
                layoutPaneStyle = {};
            }
        }

        // let splitter = this.props.showSplitter ? (
        //     <LayoutSplitter orientation={this.context.orientation}
        //         onResizing={this.handleSplitterResizing}
        //         onResizeEnd={this.handleSplitterResizeEnd}
        //         coord={this.state.splitterCoord} />
        // ) : null;

        let child = this.props.orientation ? (
            <div className={this.props.orientation === 'vertical' ? 'layout-vert-container' : 'layout-horz-container'}
                style={{
                    height: this.context.parent ? '100%' : this.props.height,
                    width: this.context.parent ? '100%' : this.props.width
                }}
            >
                {this.props.children}
            </div>
        ) : null;

        let component = this.props.orientation && !this.context.parent ? child : (
            <div className={classNames(className, this.props.className)}
                style={layoutPaneStyle}
                ref={(ref: HTMLDivElement) => this.ref = ref}
            >
                {this.props.orientation ? child : this.props.children}
            </div>
        );

        return component;
    }
}