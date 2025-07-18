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
  // 新增一份“错误提示是否显示”状态
  const [errorVisible, setErrorVisible] = useState({
    username: false,
    email: false,
    age: false,
  });

  // 输入时：如果高亮过，清除该项的错误和高亮
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (errorVisible[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
      setErrorVisible(prev => ({ ...prev, [name]: false }));
    }
  };

  // 通用表单提交，全部高亮
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm(form, rules);

    // 有错误的字段都显示高亮
    const newErrorVisible = {};
    Object.keys(form).forEach(key => {
      newErrorVisible[key] = !!newErrors[key];
    });

    setErrors(newErrors);
    setErrorVisible(newErrorVisible);

    if (Object.keys(newErrors).length === 0) {
      alert('提交成功');
    }
  };

  // 只高亮指定字段，比如某些业务场景只想显示 email 错误
  const highlightField = (field) => {
    const errMsg = validateField(field, form[field], rules);
    setErrors(prev => ({ ...prev, [field]: errMsg }));
    setErrorVisible(prev => ({ ...prev, [field]: !!errMsg }));
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
              border: errorVisible[key] ? '1px solid red' : '1px solid #ccc',
              outline: 'none',
              borderRadius: 4,
            }}
          />
          {errorVisible[key] && errors[key] && (
            <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
              {errors[key]}
            </div>
          )}
        </div>
      ))}
      <button type="submit">提交</button>

      {/* 举例：只高亮email字段 */}
      <button
        type="button"
        style={{ marginLeft: 8 }}
        onClick={() => highlightField('email')}
      >
        只高亮email
      </button>
    </form>
  );
}
