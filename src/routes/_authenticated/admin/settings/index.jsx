import { createFileRoute } from '@tanstack/react-router'
import { SettingsBlogCategory } from './blog'
import axios from 'axios'
import { QueryClient, queryOptions } from '@tanstack/react-query'

const queryClient = new QueryClient();

export const blogCategoryQueryOptions = (deps) => 
  queryOptions({
    queryKey:['blog-category',deps.q,deps.page],
    queryFn:async () => {
      try {
        const pageNumber = deps.page;
        const searchQuery = deps.q
        let queryStr = `page=${pageNumber}`
        if (searchQuery) {
          queryStr += `&q=${searchQuery}`
        }
        let response = await axios.get(`/admin/blog-category/get?${queryStr}`)
        response = response.data
        console.log('response ===>',response)
        if (response.success) {
          return {blogCategories:response.data.blogCategories,totalPages:response.data.totalPages};
        }
      } catch (error) {
        console.log('error', error);
        return {blogCategories:[]}
      }
    },
  })

export const Route = createFileRoute('/_authenticated/admin/settings/')({
  validateSearch:(search) => {
    return {q:search.q || '',page: Number(search.page ?? 1)}
  },
  loaderDeps:({search}) => {
    return {q:search.q,page:search.page}
  },
  loader: ({deps}) => queryClient.ensureQueryData(blogCategoryQueryOptions(deps)),
  component: SettingsBlogCategory,
})