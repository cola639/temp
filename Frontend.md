import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';   // 主题样式

const QuillEditor = ({ value, onChange, placeholder = '请输入内容…' }) => {
  // 工具栏配置
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  // 拦截图片粘贴/上传，转存服务器（示例）
  const handleImageUpload = () => {
    const quill = ReactQuill.quill;          // 拿到实例
    if (!quill) return;

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const url = await res.text();          // 返回图片 URL

      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', url); // 插入图片
      quill.setSelection(range.index + 1);
    };
  };

  // 把图片按钮绑定成自定义上传
  modules.toolbar.handlers = { image: handleImageUpload };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder}
    />
  );
};

export default QuillEditor;






--------

import React, { useState } from 'react';
import QuillEditor from '../components/QuillEditor';

export default function Demo() {
  const [content, setContent] = useState('');

  return (
    <div style={{ padding: 24 }}>
      <h2>quill@2.0.3 在 React 中的使用示例</h2>
      <QuillEditor value={content} onChange={setContent} />
      <h3>实时 HTML 输出</h3>
      <pre style={{ background: '#f6f6f6', padding: 12 }}>{content}</pre>
    </div>
  );
}



------

/* 让编辑区默认更高一点 */
.ql-editor {
  min-height: 300px;
}
