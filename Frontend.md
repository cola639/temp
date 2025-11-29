// RhelText.jsx
import React, { useMemo } from 'react';

function splitByComma(str, groupCount = 2) {
  const parts = str.split(',');
  if (parts.length <= groupCount) return [str];

  const first =
    parts
      .slice(0, groupCount)
      .join(',')
      .trimEnd() + ',';

  const second = parts.slice(groupCount).join(',').trim();
  return [first, second];
}

function RhelText({ value, groupCount = 2, className }) {
  const [first, second] = useMemo(
    () => splitByComma(value, groupCount),
    [value, groupCount]
  );

  return (
    <span className={className}>
      {first}
      {second && (
        <>
          <br />
          {second}
        </>
      )}
    </span>
  );
}

export default RhelText;
