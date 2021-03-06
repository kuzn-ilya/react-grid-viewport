import * as PropTypes from 'prop-types';
import { ValidationMap } from '../../../react';
import { ColumnProps } from '../Columns/Column/ColumnProps';
import { List } from 'immutable';

export interface HeaderRowProps {
    // tslint:disable-next-line:no-any
    columnProps: List<ColumnProps<any>>;
    height: number;
    showEdgeForTheLeftCell?: boolean;
}

export const headerRowPropTypes: ValidationMap<HeaderRowProps> = {
    columnProps: PropTypes.instanceOf(List).isRequired,
    height: PropTypes.number.isRequired,
    showEdgeForTheLeftCell: PropTypes.bool
};
