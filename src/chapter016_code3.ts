interface Props {
  title: string
  count?: number
  list: User[]
}

const props = defineProps<Props>()