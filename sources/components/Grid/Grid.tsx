import * as React from 'react';

import { GridProps, gridPropTypes } from './GridProps';
import { GridState } from './GridState';
import { Column } from './Column';
import { ColumnGroup } from './ColumnGroup';
import { ColumnProps } from './Column/ColumnProps';

export class Grid extends React.PureComponent<GridProps, GridState> {

    static propTypes = gridPropTypes;

    static defaultProps: GridProps = {
        fixedColumnCount: 0,
        fixedRowCount: 0,
        headerHeight: 0,
        rowData: [],
        rowHeight: 0
    };

    constructor(props?: GridProps) {
        super(props);

        this.handleVerticalScrollPosChanged = this.handleVerticalScrollPosChanged.bind(this);
        this.handleHorizontalScrollVisibilityChanged = this.handleHorizontalScrollVisibilityChanged.bind(this);
        this.state = this.calculateState();
    }

    handleVerticalScrollPosChanged: (scrollTop: number) => void = (scrollTop) => {
        if (this.state.scrollTop !== scrollTop) {
            this.setState({
                scrollTop
            });
        }
    }

    render(): JSX.Element {
        return (
            <div className="layout2-container" style={{
                height: '100%',
                width: '100%'
            }}>
                <div className="layout2-horz-first" style={{
                    width: this.state.fixedColumnsWidth || 0
                }}>
                    <ColumnGroup width={this.state.fixedColumnsWidth || 0}
                        headerHeight={this.props.headerHeight}
                        showEdgeForTheLeftCell
                        rowData={this.props.rowData}
                        columnProps={this.state.fixedColumns ? this.state.fixedColumns : []}
                        rowHeight={this.props.rowHeight}
                        scrollTop={this.state.scrollTop}
                        colsThumbHeight={this.state.colsThumbHeight}
                        overflowX="hidden"
                        overflowY="hidden"
                    />
                </div>
                <div className="layout2-horz-second" style={{
                    left: this.state.fixedColumnsWidth || 0
                }}>
                    <ColumnGroup width="100%"
                        headerHeight={this.props.headerHeight}
                        rowData={this.props.rowData}
                        columnProps={this.state.scrollableColumns ? this.state.scrollableColumns : []}
                        rowHeight={this.props.rowHeight}
                        overflowX="auto"
                        overflowY="auto"
                        onScrollPosChanged={this.handleVerticalScrollPosChanged}
                        onHorizontalScrollVisibilityChanged={this.handleHorizontalScrollVisibilityChanged}
                    />
                </div>
            </div>
        );
    }

    handleHorizontalScrollVisibilityChanged: (visible: boolean, thumbHeight: number) => void = (visible: boolean, thumbHeight: number) => {
        this.setState({
            colsThumbHeight: thumbHeight
        });
    }

    calculateState(): GridState {
        let columns = React.Children
            .toArray(this.props.children).filter((value: React.ReactChild): boolean =>
                typeof value !== 'string' && typeof value !== 'number' && value.type === Column
            )
            .map((value: React.ReactChild) =>
                (value as React.ReactElement<ColumnProps>).props
            );

        let fixedColumns = columns.slice(0, this.props.fixedColumnCount);
        let scrollableColumns = columns.slice(this.props.fixedColumnCount);

        // TODO calculate columnsWidth whether columnProps is changed
        let fixedColumnsWidth = fixedColumns
            .map((value: ColumnProps): number => value.width)
            .reduce((prevValue: number, currValue: number) => prevValue + currValue, 0);

        return {
            fixedColumns,
            fixedColumnsWidth,
            scrollableColumns
        };
    }
}
