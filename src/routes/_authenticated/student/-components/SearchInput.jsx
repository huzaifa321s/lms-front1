import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'


export default function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  onSubmit,
  isFetching = false,
}) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <Label htmlFor="search-input" className="flex items-center gap-2 grow">
        <Input
          id="search-input"
          name="search"
          size="sm"
          type="text"
          className="grow rounded-[8px] border border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="text-black"
          disabled={isFetching}
        >
          {!isFetching && <Search size={18} />}
        </Button>
      </Label>
    </form>
  )
}
