import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { useSearch } from '@tanstack/react-router'
import { useState } from 'react'

export const useCachedData = (key, page, input) => {
  const queryClient = useQueryClient()
  const cachedData = queryClient.getQueryData([key, page, input])

  return cachedData
}

export const useDebounceInput = (searchInput, time) => {
  const [debouncedSearch] = useDebounce(searchInput, time ? time : 5000)
  return debouncedSearch
}

export const getFileUrl = (path, prefix = '') => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const baseUrl = import.meta.env.VITE_REACT_APP_STORAGE_BASE_URL || 'http://localhost:5000'
  return `${baseUrl}/${prefix ? prefix + '/' : ''}${path}`
}

export const getRenderPaginationButtons = (
  currentPage,
  pages,
  handlePageChange
) => {

  const buttons = []
  const maxButtons = 4
  const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
  const endPage = Math.min(pages, startPage + maxButtons - 1)

  if (startPage > 1) {
    buttons.push(
      <Button key='first' onClick={() => handlePageChange(1)} size='sm'>
        1
      </Button>
    )
  }

  if (startPage > 2) {
    buttons.push(
      <Button variant='outline' size='sm'>
        <span key='ellipsis-1'>...</span>
      </Button>
    )
  }

  for (let i = startPage; i <= endPage; i++) {
    buttons.push(
      <Button
        key={i}
        variant={currentPage === i ? 'outline' : 'default'}
        onClick={() => handlePageChange(i)}
        size='sm'
      >
        {i}
      </Button>
    )
  }

  if (endPage < pages) {
    if (endPage < pages - 1) {
      buttons.push(
        <Button variant='outline' size='sm'>
          <span key='ellipssis-2' className='btn'>
            ...
          </span>
        </Button>
      )
    }
    buttons.push(
      <Button onClick={() => handlePageChange(pages)} size='sm'>
        {pages}
      </Button>
    )
  }
  return buttons
}

export const setCardAsDefault = async ({ paymentMethodId, queryClient, queryOptions }) => {
  try {
    let response = await axios.put(
      `/student/payment/set-card-as-default/${paymentMethodId}`
    )
    response = response.data
    if (response.success) {
      if (queryOptions) {
        await queryClient.invalidateQueries({ queryKey: queryOptions().queryKey })
      }
      toast.success(response.message)
    }
  } catch (error) {
    console.log('Error: ', error)
  }
}


export function useSearchInput(from, key = 'q') {
  const value = useSearch({ from, select: s => s[key], structuralSharing: true }) || ''
  return useState(value)
}


export function exportToCSV(students) {
  if (!students || students.length === 0) return;

  // Define CSV headers
  const headers = ["Name", "Email", "Phone", "Plan", "Status"];

  // Map student data
  const rows = students.map((s) => [
    s.name,
    s.email,
    s.phone,
    s.plan || "—",
    s.planActive ? "Active" : "Inactive",
  ]);

  // Combine headers + rows
  const csvContent = [headers, ...rows]
    .map((e) => e.join(","))
    .join("\n");

  // Create a downloadable file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "students.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

