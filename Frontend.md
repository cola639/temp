import React, { useState } from 'react';
import { Table } from 'antd';

const MyTable = ({ dataSource, columns }) => {
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowClassName={(record) =>
        record.key === selectedRowKey ? 'highlight-row' : ''
      }
      onRow={(record) => ({
        onClick: () => setSelectedRowKey(record.key),
      })}
      rowKey="key" // 确保每行都有唯一 key
    />
  );
};
