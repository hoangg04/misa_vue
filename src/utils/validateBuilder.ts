type RuleFn = (value: unknown) => boolean

export default class ValidateBuilder {
  private errors: string[] = []
  private rules: RuleFn[] = []

  private error(message: string): false {
    this.errors.push(message)
    return false
  }

  private addRule(rule: RuleFn): this {
    this.rules.push(rule)
    return this
  }

  private toNumber(value: unknown): number | null {
    if (typeof value === 'number') return Number.isNaN(value) ? null : value
    if (typeof value === 'string' && value.trim() !== '') {
      const num = Number(value)
      return Number.isNaN(num) ? null : num
    }
    return null
  }

  public required(message: string): this {
    return this.addRule((value: unknown) => {
      if (value === null || value === undefined || value === '') {
        return this.error(message)
      }
      return true
    })
  }

  public boolean(message: string): this {
    return this.addRule((value: unknown) => {
      if (typeof value !== 'boolean') return this.error(message)
      return true
    })
  }

  public date(message: string): this {
    return this.addRule((value: unknown) => {
      if (typeof value !== 'string') return this.error(message)
      const timestamp = Date.parse(value)
      if (Number.isNaN(timestamp)) return this.error(message)
      return true
    })
  }

  public length(length: number, message: string = 'Length is not valid'): this {
    return this.addRule((value: unknown) => {
      if (typeof value !== 'string') return this.error(message)
      if (value.length !== length) return this.error(message)
      return true
    })
  }

  public string(message: string = 'Value is not a string'): this {
    return this.addRule((value: unknown) => {
      if (typeof value !== 'string') return this.error(message)
      return true
    })
  }

  public number(message: string = 'Value is not a number'): this {
    return this.addRule((value: unknown) => {
      const num = this.toNumber(value)
      if (num === null) return this.error(message)
      return true
    })
  }

  public min(min: number, message: string = 'Value is less than minimum'): this {
    return this.addRule((value: unknown) => {
      // If value is a string, compare its length
      if (typeof value === 'string') {
        if (value.length < min) return this.error(message)
        return true
      }

      // Otherwise compare numeric value
      const num = this.toNumber(value)
      if (num === null) return this.error('Min method only accepts numbers or strings')
      if (num < min) return this.error(message)
      return true
    })
  }

  public max(max: number, message: string = 'Value is greater than maximum'): this {
    return this.addRule((value: unknown) => {
      // If value is a string, compare its length
      if (typeof value === 'string') {
        if (value.length > max) return this.error(message)
        return true
      }

      // Otherwise compare numeric value
      const num = this.toNumber(value)
      if (num === null) return this.error('Max method only accepts numbers or strings')
      if (num > max) return this.error(message)
      return true
    })
  }

  public email(message: string = 'Value is not a email'): this {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return this.regex(regex, message)
  }

  public regex(regex: RegExp, message: string = 'Value does not match pattern'): this {
    return this.addRule((value: unknown) => {
      if (typeof value !== 'string') return this.error('Regex method only accepts strings')
      if (!regex.test(value)) return this.error(message)
      return true
    })
  }

  public phone(message: string = 'Value is not a phone'): this {
    const regex = /^(0|\+84)[0-9]{9,10}$/
    return this.regex(regex, message)
  }

  public check(value: unknown): {
    isValid: boolean
    errors: string[]
    value: unknown
  } {
    this.errors = []
    let isValid = true

    for (const rule of this.rules) {
      if (!rule(value)) {
        isValid = false
        break
      }
    }

    return { isValid, errors: this.errors, value }
  }

  static checkAll(
    values: Record<string, unknown>,
    schema: Record<string, ValidateBuilder>,
  ): {
    isValid: boolean
    errors: { key: string; errors: string[] }[]
    values: Record<string, unknown>
  } {
    let isValid = true
    const errors: { key: string; errors: string[] }[] = []
    // Không lặp theo values để tránh trường hợp value chưa có đủ key.
    // Thay vào đó, lặp theo schema, rồi lấy value tương ứng trong values (có thể là undefined).
    for (const key in schema) {
      const rule = schema[key]!
      // rule chắc chắn tồn tại vì vừa lấy từ schema (non-null assertion)
      const element = values[key]
      const { isValid: isValidRule, errors: errorsRule } = rule.check(element)
      if (!isValidRule) {
        isValid = false
        errors.push({
          key,
          errors: errorsRule,
        })
      }
    }
    return { isValid, errors, values }
  }
}
