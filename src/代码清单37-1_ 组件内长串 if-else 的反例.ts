function syncButtons(status: string, role: string): void {
  if (status === '受理' && role === 'inspector') {
    showStartButton.value = true;
  } else if (status === '检测中' && role === 'inspector') {
    showGenerateReportButton.value = true;
  } else if (status === '报告生成' && role === 'reviewer') {
    showApproveButton.value = true;
    showRejectButton.value = true;
  } else if (status === '驳回' && role === 'inspector') {
    showReopenButton.value = true;
  } else {
    showStartButton.value = false;
    showGenerateReportButton.value = false;
    showApproveButton.value = false;
    showRejectButton.value = false;
    showReopenButton.value = false;
  }
}