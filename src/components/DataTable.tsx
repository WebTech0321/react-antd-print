import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Pagination } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { jsPDF, CellConfig } from "jspdf";
import { ROWS_PER_PAGE, getTableData, getTableDataCount } from '../api/TableApi';
import { TableDataType } from '../types';
import { date2str } from '../utils/date';
import { exportToCsv } from '../utils/export';

const columns : ColumnsType<TableDataType> = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
  },
  {
    title: 'Date of birth',
    dataIndex: 'birth',
    key: 'birth',
    render: birth => date2str(birth),
  },
];

const DataTable = () => {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState<TableDataType[]>([])

  useEffect(() => {
    setTotal(getTableDataCount())
  }, [])

  useEffect(() => {
    const tableData = getTableData(page)
    setData(tableData)
  }, [page])

  const handleDownload = () => {
    const allData = getTableData()
    exportToCsv("table.csv", allData)
  }


  const createHeaders = (keys: string[]) => {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {
      result.push({
        name: keys[i],
        prompt: keys[i],
        width: 65,
        align: "center",
        padding: 0
      } as CellConfig);
    }
    return result;
  }


  
  const handlePrint = () => {
    const allData = getTableData().map((row) => ({
      firstName: row.firstName, 
      lastName: row.lastName, 
      birth: date2str(row.birth)
    }))
    
    const headers : CellConfig[] = [
      { name: "firstName", prompt: "First Name", width: 80, align: 'center', padding: 0 },
      { name: "lastName", prompt: "Last Name", width: 80, align: 'center', padding: 0 },
      { name: "birth", prompt: "Date of birth", width: 117, align: 'center', padding: 0 }
    ];
    const doc = new jsPDF({ putOnlyUsedFonts: true });
    doc.table(1, 1, allData, headers, {});
    doc.save("table.pdf")
  }

  return (
    <div className="table-container">
      <Space direction="vertical" style={{ display: 'flex' }}>
        <Space style={{ display: 'flex', justifyContent: 'end' }}>
          <Button type="primary" shape="round" icon={<DownloadOutlined />} onClick={handleDownload}>Download</Button>
          <Button type="primary" shape="round" icon={<PrinterOutlined />} onClick={handlePrint}>Print</Button>
        </Space>
        <Table 
          dataSource={data} 
          columns={columns}
          pagination={false}
        />
        <Pagination 
          current={page} 
          total={total} 
          defaultPageSize={ROWS_PER_PAGE}
          onChange={setPage}
        />
      </Space>
    </div>
  );
}

export default DataTable;
