// src/composables/useValidation.ts
import { reactive, computed } from 'vue'

// 验证函数的类型：接收任意值，返回错误信息字符串或 null（通过即为 null）
export type validatorFn = (value: unknown) => string | null

// useValidation 的参数：字段名到验证规则数组的映射
interface ValidationRules {
  [field: string]: validatorFn[]
}

// useValidation 的返回值
interface UseValidationReturn {
  errors: Record<string, string | null>
  validate: () => boolean
  hasErrors: boolean
}

/**
 * 通用表单验证 Composable
 * @param formRef reactive 表单对象的引用（由调用方传入）
 * @param rules 每字段的验证规则数组
 * @returns { errors, validate, hasErrors }
 */
export function useValidation(
  formRef: Record<string, unknown>,
  rules: ValidationRules
): UseValidationReturn {
  // errors 是响应式的，每字段一项，初始全为 null（通过验证）
  const errors = reactive<Record<string, string | null>>({})

  // 初始化 errors 对象的每个字段
  Object.keys(rules).forEach((field) => {
    errors[field] = null
  })

  // validate 方法：运行所有字段的所有规则，返回是否有错误
  function validate(): boolean {
    let isValid = true

    Object.entries(rules).forEach(([field, fieldRules]) => {
      const value = formRef[field]
      let fieldError: string | null = null

      // 逐条运行规则，找到第一条未通过的就停下
      for (const rule of fieldRules) {
        const result = rule(value)
        if (result !== null) {
          fieldError = result
          isValid = false
          break
        }
      }

      errors[field] = fieldError
    })

    return isValid
  }

  // hasErrors 是 computed，依赖 errors 自动重算
  const hasErrors = computed(() => {
    return Object.values(errors).some((e) => e !== null)
  })

  return { errors, validate, hasErrors }
}