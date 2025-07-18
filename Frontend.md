import React, { useState } from 'react';

const initialForm = {
  username: '',
  email: '',
  age: '',
};

const rules = {
  username: [
    { required: true, message: '用户名必填' },
    { min: 3, message: '用户名至少3位' },
  ],
  email: [
    { required: true, message: '邮箱必填' },
    { pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: '邮箱格式不正确' },
  ],
  age: [
    { required: true, message: '年龄必填' },
    { validator: value => Number(value) > 0, message: '年龄需大于0' },
  ],
};

function validateField(field, value, rules) {
  const fieldRules = rules[field] || [];
  for (const rule of fieldRules) {
    if (rule.required && !value) return rule.message;
    if (rule.min && value.length < rule.min) return rule.message;
    if (rule.pattern && !rule.pattern.test(value)) return rule.message;
    if (rule.validator && !rule.validator(value)) return rule.message;
  }
  return '';
}

function validateForm(form, rules) {
  const errors = {};
  for (const key in form) {
    const errorMsg = validateField(key, form[key], rules);
    if (errorMsg) errors[key] = errorMsg;
  }
  return errors;
}

export default function MyForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false); // 控制高亮与错误提示

  // 输入时只更新表单，不高亮
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // 可选：输入时自动清除该字段的错误提示
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // 提交时校验
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm(form, rules);
    setErrors(newErrors);
    setSubmitted(true); // 标记已经提交，显示错误提示

    if (Object.keys(newErrors).length === 0) {
      alert('提交成功: ' + JSON.stringify(form));
      // 可选: 重置
      // setForm(initialForm);
      // setSubmitted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      {Object.keys(form).map((key) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            {key}
          </label>
          <input
            name={key}
            value={form[key]}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: 8,
              border: submitted && errors[key] ? '1px solid red' : '1px solid #ccc',
              outline: 'none',
              borderRadius: 4,
            }}
          />
          {submitted && errors[key] && (
            <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
              {errors[key]}
            </div>
          )}
        </div>
      ))}
      <button type="submit">提交</button>
    </form>
  );
}
