import { Table } from 'antd';

// 自定义表头行样式
const components = {
  header: {
    row: (props) => (
      <tr {...props} style={{ height: 32 }} /> // 设置表头行高（单位 px）
    ),
    cell: (props) => (
      <th {...props} style={{ padding: '4px 8px', fontSize: 12 }} /> // 设置单元格 padding / 字体等
    )
  }
};

<Table
  columns={columns}
  dataSource={data}
  components={components}
/>
