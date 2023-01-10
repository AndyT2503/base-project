export function downloadFile(response: Blob, fileName: string): void {
  const link = document.createElement('a');
  link.id = 'download-file';
  link.href = window.URL.createObjectURL(response);
  link.download = fileName;
  link.click();
}
