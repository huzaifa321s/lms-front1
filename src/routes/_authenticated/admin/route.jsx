import { createFileRoute} from '@tanstack/react-router'
import { AuthenticatedLayout } from './layout/admin-authenticated-layout'
import { initializeAxios } from './-utils/InitializeAxios'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad:() =>{
    initializeAxios();
  },
  component:AuthenticatedLayout ,
})

