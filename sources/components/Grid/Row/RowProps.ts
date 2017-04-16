import { PropTypes, MouseEvent } from 'react';
import { ValidationMap } from '../../../react';
import { ColumnProps } from '../Columns/Column/ColumnProps';
import { List } from 'immutable';

export interface RowProps {
    // tslint:disable-next-line:no-any
    columnProps: List<ColumnProps<any>>;
    // tslint:disable-next-line:no-any
    data: any;
    rowIndex: number;
    height: number;
    selected: boolean;
    showEdgeForTheLeftCell?: boolean;
    onClick?: (rowIndex: number, e?: MouseEvent<HTMLElement>) => void;
}

export const rowPropTypes: ValidationMap<RowProps> = {
    columnProps: PropTypes.instanceOf(List).isRequired,
    data: PropTypes.any.isRequired,
    height: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    rowIndex: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    showEdgeForTheLeftCell: PropTypes.bool
};
