import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { classNames, listenToResize, updateCSSPosition } from '../../../utils';

import { ScrollableContainerProps, scrollableContainerPropTypes } from  './ScrollableContainerProps';
import { ScrollableContainerState } from  './ScrollableContainerState';
import { ScrollableContent } from '../ScrollableContent';
import { ScrollBar } from '../ScrollBar';

import * as emptyFunction from 'fbjs/lib/emptyFunction';
import * as invariant from 'fbjs/lib/invariant';

import '../../../styles/container.css';
import '../../../styles/common.css';

export class ScrollableContainer extends React.PureComponent<ScrollableContainerProps, ScrollableContainerState> {

    static defaultProps: ScrollableContainerProps = {
        className: '',
        contentHeight: '100%',
        contentWidth: '100%',
        customScrollBars: false,
        height: '100%',
        horzScrollBarReplacerHeight: 0,
        onHorizontalScrollVisibilityChanged: emptyFunction,
        onScrollPosChanged: emptyFunction,
        onVerticalScrollVisibilityChanged: emptyFunction,
        overflowX: 'auto',
        overflowY: 'auto',
        scrollLeft: 0,
        scrollTop: 0,
        style: {},
        vertScrollBarReplacerWidth: 0,
        width: '100%'
    };

    static propTypes = scrollableContainerPropTypes;

    constructor(props?: ScrollableContainerProps) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleVertScroll = this.handleVertScroll.bind(this);
        this.handleHorzScroll = this.handleHorzScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleContentResize = this.handleContentResize.bind(this);
        this.setRef = this.setRef.bind(this);
        this.setScrollableContentRef = this.setScrollableContentRef.bind(this);
        this.state = {
            containerHeight: 0,
            containerWidth: 0,
            contentHeight: 0,
            contentWidth: 0,
            horzScrollThumbHeight: 0,
            scrollLeft: this.props.scrollLeft || 0,
            scrollTop: this.props.scrollTop || 0,
            vertScrollThumbWidth: 0
        };
    }

    private removeResizeEventListener: () => void = emptyFunction;

    componentDidMount(): void {
        this.measureScrollbars();
        this.updateScrollPositions();
        this.removeResizeEventListener = listenToResize(this.ref, this.handleResize);
    }

    componentDidUpdate(): void {
        this.updateScrollPositions();
    }

    componentWillUnmount(): void {
        this.removeResizeEventListener();
    }

    private ref: HTMLDivElement;
    private scrollableContentDOMRef: HTMLElement;

    private setRef: (ref: HTMLDivElement) => void = (ref) => {
        this.ref = ref;
        this.handleResize();
    }

    private setScrollableContentRef: (ref: ScrollableContent) => void = (ref) => {
        this.scrollableContentDOMRef = ReactDOM.findDOMNode(ref) as HTMLElement;
        if (this.scrollableContentDOMRef) {
            this.handleContentResize(this.scrollableContentDOMRef.offsetWidth, this.scrollableContentDOMRef.offsetHeight);
        } else {
            this.handleContentResize(0, 0);
        }
    }

    handleResize: () => void = () => {
        this.setStateInternal({
            containerHeight: this.ref ? this.ref.offsetHeight : 0,
            containerWidth: this.ref ? this.ref.offsetWidth : 0
        });
        this.measureScrollbars();
    }

    private handleContentResize: (newWidth: number, newHeight: number) => void = (newWidth, newHeight) => {
        this.setStateInternal({
            contentHeight: newHeight,
            contentWidth: newWidth
        });
        this.measureScrollbars();
    }

    // TODO: Implement class for both shadows.
    render(): JSX.Element {
        // TODO: overflowX & overflowY other values
        let horzScrollBar = this.props.customScrollBars && this.props.overflowX === 'auto' && this.state.vertScrollThumbWidth ? (
            <ScrollBar
                orientation="horizontal"
                min={0}
                max={this.state.contentWidth - this.state.containerWidth + this.state.horzScrollThumbHeight}
                pageSize={10}
                largeChange={50}
                smallChange={10}
                position={this.props.scrollLeft || this.props.scrollLeft!}
                rightOrBottom={this.state.horzScrollThumbHeight}
                showButtons
                onScroll={this.handleHorzScroll}
            />
        ) : null;

        let vertScrollBar = this.props.customScrollBars && this.props.overflowY === 'auto' && this.state.horzScrollThumbHeight ? (
            <ScrollBar
                orientation="vertical"
                min={0}
                max={this.state.contentHeight - this.state.containerHeight + this.state.vertScrollThumbWidth}
                pageSize={10}
                largeChange={50}
                smallChange={10}
                position={this.state.scrollTop || this.props.scrollTop!}
                rightOrBottom={this.state.vertScrollThumbWidth}
                showButtons
                onScroll={this.handleVertScroll}
            />
        ) : null;

        let contentStyle = {
        };

        if (this.props.customScrollBars) {
            updateCSSPosition(contentStyle, -(this.state.scrollLeft || this.props.scrollLeft!),
                -(this.state.scrollTop || this.props.scrollTop!));
        }

        let style = {
            bottom: this.props.horzScrollBarReplacerHeight
                ? this.props.horzScrollBarReplacerHeight + 'px' : '0px',
            overflowX: this.props.customScrollBars ? 'hidden' : this.props.overflowX,
            overflowY: this.props.customScrollBars ? 'hidden' : this.props.overflowY,
            right: this.props.vertScrollBarReplacerWidth
                ? this.props.vertScrollBarReplacerWidth + 'px' : '0px'
        };

        return (
            <div
                className={classNames('scrollable-container', this.props.className!)}
                style={{
                    height: this.props.height,
                    width: this.props.width
                }}
                id={this.props.id}
            >
                <div className={classNames({
                        'scrollable-container-scrollable': true,
                        'scrollable-container-scrollable-boost': !this.props.customScrollBars
                            && (this.props.overflowX !== 'hidden' || this.props.overflowY !== 'hidden'),
                        'right-shadow': Boolean(this.props.showShadowForReplacer && this.props.vertScrollBarReplacerWidth),
                        'bottom-shadow': Boolean(this.props.showShadowForReplacer && this.props.horzScrollBarReplacerHeight)
                    })}
                    style={style}
                    ref={this.setRef}
                    onScroll={this.props.customScrollBars ? undefined : this.handleScroll}
                >
                    <ScrollableContent contentWidth={this.props.contentWidth} contentHeight={this.props.contentHeight}
                        dataRenderer={this.props.dataRenderer}
                        data={this.props.data}
                        onResize={this.handleContentResize}
                        ref={this.setScrollableContentRef}
                        style={contentStyle}
                    >
                        {this.props.children}
                    </ScrollableContent>
                    {horzScrollBar}
                    {vertScrollBar}
                </div>
            </div>
        );
    }

    private handleScroll: (event: React.UIEvent<HTMLDivElement>) => void = (event) => {
        let scrollLeft = (event.currentTarget as Element).scrollLeft;
        let scrollTop = (event.currentTarget as Element).scrollTop;
        this.props.onScrollPosChanged!(scrollLeft, scrollTop);
    }

    private handleVertScroll: (newPosition: number) => void = (newPosition) => {
        let scrollLeft = this.state.scrollLeft || this.props.scrollLeft!;
        this.setStateInternal({
            scrollTop: newPosition
        });
        this.props.onScrollPosChanged!(scrollLeft, newPosition);
    }

    private handleHorzScroll: (newPosition: number) => void = (newPosition) => {
        let scrollTop = this.state.scrollTop || this.props.scrollTop!;
        this.setStateInternal({
            scrollLeft: newPosition
        });
        this.props.onScrollPosChanged!(newPosition, scrollTop);
    }

    private updateScrollPositions(): void {
        if (!this.props.customScrollBars && this.ref) {
            if (this.props.scrollLeft !== undefined) {
                this.ref.scrollLeft = this.props.scrollLeft;
            }
            if (this.props.scrollTop !== undefined) {
                this.ref.scrollTop = this.props.scrollTop;
            }
        }
    }

    private calculateScrollThumbsMeasurements(): ScrollableContainerState {
        invariant(!!this.ref, 'calculateScrollThumbsMeasurements: this.ref must be defined.');
        if (this.props.customScrollBars) {
            invariant(!!this.scrollableContentDOMRef, 'calculateScrollThumbsMeasurements: this.scrollableContentDOMRef must be defined.');
            return {
                horzScrollThumbHeight: this.ref.offsetHeight < this.scrollableContentDOMRef.offsetHeight ? 17 : 0,
                vertScrollThumbWidth: this.ref.offsetWidth < this.scrollableContentDOMRef.offsetWidth ? 17 : 0
            }  as ScrollableContainerState;
        } else {
            return {
                horzScrollThumbHeight: this.ref.offsetHeight - this.ref.clientHeight,
                vertScrollThumbWidth: this.ref.offsetWidth - this.ref.clientWidth
            } as ScrollableContainerState;
        }
    }

    private vertScrollThumbWidth: number = 0;
    private horzScrollThumbWidth: number = 0;

    setStateInternal(state: Partial<ScrollableContainerState>): void {
        if (state.horzScrollThumbHeight !== undefined) {
            this.horzScrollThumbWidth = state.horzScrollThumbHeight;
        }
        if (state.vertScrollThumbWidth !== undefined) {
            this.vertScrollThumbWidth = state.vertScrollThumbWidth;
        }

        this.setState(state as ScrollableContainerState);
    }

    private measureScrollbars: () => void = () => {
        if (this.ref && (!this.props.customScrollBars || this.scrollableContentDOMRef)) {
            let newState = this.calculateScrollThumbsMeasurements();
            if (this.vertScrollThumbWidth !== newState.vertScrollThumbWidth) {
                this.props.onVerticalScrollVisibilityChanged!(newState.vertScrollThumbWidth > 0, newState.vertScrollThumbWidth);
            }
            if (this.horzScrollThumbWidth !== newState.horzScrollThumbHeight) {
                this.props.onHorizontalScrollVisibilityChanged!(newState.horzScrollThumbHeight > 0, newState.horzScrollThumbHeight);
            }
            this.setStateInternal(newState);
        }
    }

    setScrollLeft(position: number): void {
        if (this.ref) {
            this.ref.scrollLeft = position;
        }
    }

    setScrollTop(position: number): void {
        if (this.ref) {
            this.ref.scrollTop = position;
        }
    }
}
