
import { MOCK_DATA } from '../mock/data'
import { TableDataType } from '../types';

export const ROWS_PER_PAGE = 20;

export const getTableDataCount = () => {
    return MOCK_DATA.length
}

export const getTableData = (page?: number) : Array<TableDataType> => {
    if( page ) 
        return MOCK_DATA.slice((page - 1)*ROWS_PER_PAGE, page*ROWS_PER_PAGE)
    else 
        return MOCK_DATA
}