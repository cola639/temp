import { Table } from 'antd';
import React from 'react';
import './index_v1.scss';

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
    width: 200
  },
  {
    title: 'Tier',
    dataIndex: 'tier',
    key: 'tier',
    width: 120
  },
  {
    title: 'ITAC',
    dataIndex: 'itac',
    key: 'itac',
    width: 100
  },
  {
    title: 'Environment',
    dataIndex: 'environment',
    key: 'environment',
    width: 200
  }
];

export default function TableWithGap() {
  return (
    <div className="w1500 rc">
      <Table bordered dataSource={dataSource} columns={columns} pagination={false} rowClassName={(_, index) => `custom-row row-${index}`} />
    </div>
  );
}
