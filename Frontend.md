import React from 'react';
import { Table, Tag } from 'antd';

const columns = [
  {
    title: 'Platforms',
    dataIndex: 'platform',
    fixed: 'left',
    width: 120,
  },
  {
    title: 'Baselines',
    dataIndex: 'baselines',
  },
  {
    title: 'Configurations',
    dataIndex: 'configurations',
  },
  {
    title: 'Checks',
    dataIndex: 'checks',
  },
  {
    title: 'Violations',
    children: [
      {
        title: 'High',
        dataIndex: 'high',
        render: (text) => <Tag color="red">{text}</Tag>,
      },
      {
        title: 'Medium',
        dataIndex: 'medium',
        render: (text) => <Tag color="orange">{text}</Tag>,
      },
      {
        title: 'Low',
        dataIndex: 'low',
        render: (text) => <Tag color="green">{text}</Tag>,
      },
    ],
  },
  {
    title: 'Exceptions',
    children: [
      {
        title: 'Approved',
        dataIndex: 'approved',
        render: (text) => <Tag color="green">{text}</Tag>,
      },
      {
        title: 'Pending',
        dataIndex: 'pending',
        render: (text) => <Tag color="gold">{text}</Tag>,
      },
      {
        title: 'Completed',
        dataIndex: 'completed',
        render: (text) => <Tag color="blue">{text}</Tag>,
      },
    ],
  },
];

const data = [
  {
    key: '1',
    platform: 'Unix',
    baselines: 2243,
    configurations: 10,
    checks: 185,
    high: 77,
    medium: 10,
    low: 185,
    approved: 77,
    pending: 77,
    completed: 10,
  },
  {
    key: '2',
    platform: 'Windows',
    baselines: 419,
    configurations: 162,
    checks: 88,
    high: 169,
    medium: 162,
    low: 88,
    approved: 169,
    pending: 169,
    completed: 162,
  },
  // 你可以继续添加其他行的数据...
];

const DashboardTable = () => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      pagination={false}
      scroll={{ x: 1440 }}
    />
  );
};

export default DashboardTable;
