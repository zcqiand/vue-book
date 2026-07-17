<!-- 类型 Tab（全部 / 认证 / 合同 / 接样 / 流程 / 报告 / 用户 / 角色 / 系统） -->
<div class="flex flex-wrap gap-1 bg-white p-2 rounded shadow">
  <button v-for="tab in TABS" :key="tab.value"
    :class="activeTab === tab.value ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
    @click="activeTab = tab.value">
    {{ tab.label }}
  </button>
</div>

<!-- 筛选栏：关键词 / 日期范围 / 重置 / 导出格式 / 导出按钮 -->
<input v-model="keyword" placeholder="操作 / 操作人 / 对象" />
<input v-model="dateFrom" type="date" />
<input v-model="dateTo" type="date" />
<select v-model="exportFormat"><option value="csv">CSV</option><option value="json">JSON</option></select>

<!-- 列表：每行展示 时间 / 类型徽章 / 操作 / 操作人 / 操作对象 / IP / 详情 -->