import {  useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


const DeleteBlogModal = ({
  deleteBlog,
  modalCondition,
  handleModalClose,
  isLoading,
}) => {
  const [showInput, setShowInput] = useState(false)
  const handleSubmit = async () => {
    await deleteBlog()
    handleModalClose(false)
  }
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <Dialog open={modalCondition} onOpenChange={() => handleModalClose(false)}>
        <form onSubmit={handleSubmit}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Delete Blog</DialogTitle>
              <DialogDescription>
                <span className='text-xl font-bold'>
                  Are you sure you want to delete this blog?
                </span>
                <br />
         
                
              </DialogDescription>
              
              {showInput && (
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='deleteInput'>Please Type 'delete' here</Label>
                  <Input
                    id='deleteInput'
                    type='text'
                    placeholder='delete'
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              )}
            </DialogHeader>

            <DialogFooter >
              <DialogClose asChild>
                <Button
                  size='sm'
                  disabled={isLoading}
                  variant='outline'
                  onClick={() => handleModalClose(false)}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                size='sm'
                type={inputValue === 'delete' ? 'submit' : '' }
                variant='destructive'
                disabled={isLoading || showInput && inputValue !== 'delete'  }
                onClick={() => {
                  inputValue === 'delete' ? handleSubmit() : setShowInput((prev) => !prev)
                }}
                loading={isLoading}
              >
               
                  Delete
               
              </Button>

            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  )
}

export default DeleteBlogModal
