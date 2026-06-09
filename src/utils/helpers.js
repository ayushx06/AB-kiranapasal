export const classNames = (...classes) => classes.filter(Boolean).join(' ');

export const exportRowsToCsv = (filename, rows) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((header) => `"${String(row[header] ?? '').replaceAll('"', '""')}"`).join(',')
    )
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const makeOrderId = () => `AKP-${Date.now().toString(36).toUpperCase()}`;
