import { Table } from 'antd';
import React from 'react';
import './index.scss';

const dataSource = Array.from({ length: 5 }).map((_, i) => ({
  key: i.toString(),
  host: `CNW20012${860 + i}`,
  tier: `Tier ${1 + (i % 3)}`,
  itac: Math.random() < 0.5 ? 'Yes' : 'No',
  environment: ['Production', 'Contingency', 'Pre-Prod'][i % 3]
}));

const columns = [
  {
    title: 'Host',
    dataIndex: 'host',
    key: 'host',
    render: (text: string) => <div style={{ width: '100px', textAlign: 'left' }}>{text}</div>
  },
  {
    title: 'Tier',
    dataIndex: 'tier',
    key: 'tier',
    render: (text: string) => <div style={{ width: '100px', textAlign: 'left' }}>{text}</div>
  },
  {
    title: 'ITAC',
    dataIndex: 'itac',
    key: 'itac',
    render: (text: string) => <div style={{ width: '100px', textAlign: 'left' }}>{text}</div>
  },
  {
    title: 'Environment',
    dataIndex: 'environment',
    key: 'environment',
    render: (text: string) => <div style={{ width: '100px', textAlign: 'left' }}>{text}</div>
  }
];

export default function TableWithGap() {
  return (
    <Table
      className="rc"
      style={{
        width: '800px'
      }}
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={false}
    />
  );
}
