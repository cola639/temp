import axios from "axios";

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 1. 校验扩展名
  const fileName = file.name;
  const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
  if (ext !== 'xlsx') {
    alert("只支持上传 .xlsx 文件！");
    return;
  }

  // 2. 生成随机数（比如6位数字）
  const randomnum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  // 3. 组装formData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("randomnum", randomnum);

  try {
    const res = await axios.post('/api/draft/randomnum', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // 成功处理
    alert("上传成功，randomnum：" + randomnum);
    // 或 setState/res.data 等
  } catch (err) {
    alert("上传失败：" + (err?.message || "未知错误"));
  }
};
