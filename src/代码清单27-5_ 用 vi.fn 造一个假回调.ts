import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import SearchBox from './SearchBox.vue'

it('回车后调用 onSearch 回调', async () => {
  const onSearch = vi.fn()                  // 假回调
  const wrapper = mount(SearchBox, {
    props: { onSearch }
  })
  await wrapper.find('input').setValue('Vue')
  await wrapper.find('input').trigger('keyup.enter')
  expect(onSearch).toHaveBeenCalledTimes(1)
  expect(onSearch).toHaveBeenCalledWith('Vue')
})