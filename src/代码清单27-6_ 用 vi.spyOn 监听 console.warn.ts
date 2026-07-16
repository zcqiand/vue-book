it('非法 Props 时输出警告', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  mount(MyComponent, { props: { invalidProp: true } })
  expect(warnSpy).toHaveBeenCalled()
  warnSpy.mockRestore()                     // 恢复 console.warn
})