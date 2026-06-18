if (record.status === 'accepted' && user.role === 'tester') {
  showStartButton.value = true
} else if (record.status === 'testing' && user.role === 'tester') {
  showGenerateReportButton.value = true
} else if (record.status === 'report_generated' && user.role === 'reviewer') {
  showApproveButton.value = true
  showRejectButton.value = true
} else if (record.status === 'rejected' && user.role === 'tester') {
  showResubmitButton.value = true
}