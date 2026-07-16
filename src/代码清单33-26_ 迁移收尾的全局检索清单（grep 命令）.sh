# Vue.set / $set / $delete 直接赋值即可
grep -rn 'Vue\.set\|this\.\$set\|this\.\$delete' src/

# filter 选项与管道符
grep -rn 'filters:' src/
grep -rn '| currency\|| formatDate\|| uppercase' src/

# 事件总线残留
grep -rn '\$on\|\$once\|\$off\|new Vue()' src/

# 老的环境变量前缀
grep -rn 'process\.env\.VUE_APP_' src/