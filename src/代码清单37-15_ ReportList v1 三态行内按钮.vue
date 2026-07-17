<template v-if="r.status === 'draft' && canWrite">
  <button class="px-2 py-1 text-purple-600 hover:underline" @click="handleReview(r, 'submit')">提交审核</button>
</template>
<template v-if="r.status === 'reviewing' && canIssue">
  <button class="px-2 py-1 text-green-600 hover:underline" @click="handleReview(r, 'approve')">通过</button>
  <button class="px-2 py-1 text-orange-600 hover:underline" @click="handleReview(r, 'reject')">驳回</button>
</template>