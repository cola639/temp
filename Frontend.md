const ROLE_MAP = {
  "platform-owner": [
    "Platform Owner",
    "Platform Owner Delegate"
  ],
  "cybersecurity-sme": [
    "Cybersecurity SME",
    "Cybersecurity SME Delegate"
  ]
};

let arr = [];

if (loaderData.admin) {
  // 管理员看到全部
  arr = [
    "Platform Owner",
    "Platform Owner Delegate",
    "Cybersecurity SME",
    "Cybersecurity SME Delegate"
  ];
} else {
  // 根据 role
  arr = ROLE_MAP[role] || [];
}

const roleOptions = arr.map(k => ({
  label: k,
  value: k
}));
