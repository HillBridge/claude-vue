import { ref, reactive, watch } from 'vue'
import type { Ref } from 'vue'

interface FormRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  message: string
  validator?: (value: unknown) => boolean | string
}

type FormRules<T> = {
  [K in keyof T]?: FormRule[]
}

type FormErrors<T> = {
  [K in keyof T]?: string
}

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  rules: FormRules<T> = {},
) {
  const form = reactive({ ...initialValues }) as T
  const errors = reactive({}) as FormErrors<T>
  const dirty = ref(false)
  const submitting = ref(false)

  function validateField(field: keyof T): boolean {
    const fieldRules = rules[field]
    if (!fieldRules?.length) return true

    const value = form[field]

    for (const rule of fieldRules) {
      if (rule.required && (value === '' || value === null || value === undefined)) {
        errors[field] = rule.message
        return false
      }

      if (rule.min !== undefined && typeof value === 'string' && value.length < rule.min) {
        errors[field] = rule.message
        return false
      }

      if (rule.max !== undefined && typeof value === 'string' && value.length > rule.max) {
        errors[field] = rule.message
        return false
      }

      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors[field] = rule.message
        return false
      }

      if (rule.validator) {
        const result = rule.validator(value)
        if (result !== true) {
          errors[field] = typeof result === 'string' ? result : rule.message
          return false
        }
      }

      errors[field] = undefined
    }

    return true
  }

  function validate(): boolean {
    const fields = Object.keys(rules) as (keyof T)[]
    return fields.every((field) => validateField(field))
  }

  function reset() {
    Object.assign(form, initialValues)
    Object.keys(errors).forEach((key) => {
      errors[key as keyof T] = undefined
    })
    dirty.value = false
  }

  function setValues(values: Partial<T>) {
    Object.assign(form, values)
  }

  watch(
    () => ({ ...form }),
    () => {
      dirty.value = true
    },
    { deep: true },
  )

  return {
    form: form as Ref<T> extends never ? T : T,
    errors,
    dirty,
    submitting,
    validateField,
    validate,
    reset,
    setValues,
  }
}
