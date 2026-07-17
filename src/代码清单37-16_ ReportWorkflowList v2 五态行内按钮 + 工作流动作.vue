type WorkflowAction = 'submit' | 'approve' | 'reject' | 'issue' | 'archive'
// 状态机：draft --submit--> reviewing --approve--> issued --issue--> printed --archive--> archived
//         reviewing --reject--> draft
// 行内按钮按 r.status 派发：
<template v-if="r.status === 'draft'">
  <button @click="actionTarget = { report: r, action: 'submit' }">提交审核</button>
  <button @click="formOpen = true">编辑</button>
  <button @click="deleteTarget = r">删除</button>
</template>
<template v-else-if="r.status === 'reviewing'">
  <button @click="actionTarget = { report: r, action: 'approve' }">批准</button>
  <button @click="actionTarget = { report: r, action: 'reject' }">退回</button>
</template>
<template v-else-if="r.status === 'issued'">
  <button @click="actionTarget = { report: r, action: 'issue' }">发放</button>
</template>
<template v-else-if="r.status === 'printed'">
  <button @click="actionTarget = { report: r, action: 'archive' }">归档</button>
</template>
<template v-else-if="r.status === 'archived'">
  <button class="text-gray-400 cursor-default">查看</button>
</template>