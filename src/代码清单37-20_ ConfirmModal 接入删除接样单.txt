<ConfirmModal
  :open="deleteTarget !== null"
  title="删除接样单"
  :message="`确定删除接样单「${deleteTarget?.commissionCode ?? ''}」？其下样品与检测记录将一并删除。`"
  confirm-text="确认删除"
  :loading="receipt.loading"
  @confirm="onDelete"
  @cancel="deleteTarget = null"
/>