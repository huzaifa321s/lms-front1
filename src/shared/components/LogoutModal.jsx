import * as React from 'react'
import { useState } from 'react'
import { LogOut, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'


export function LogoutModal({ modalCondition, handleModalClose, logout, isLoading }) {

  // A local handler to simulate the logout process and update loading state.
  const handleLogout =  () => {
     logout();
    handleModalClose(false);
  };

  return (
    <Dialog
      open={modalCondition} // Overriding with 'true' to always show for demonstration
      onOpenChange={() => handleModalClose(false)}
    >
      <DialogContent className='sm:max-w-sm rounded-3xl p-8 bg-white/90 backdrop-blur-lg shadow-2xl border border-gray-200 transition-all duration-300'>
        <DialogHeader className='text-left'>
          <div className='flex items-center justify-between'>
            <DialogTitle className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
              <LogOut className='h-6 w-6 text-red-500' />
              Logout
            </DialogTitle>
            <DialogClose asChild>
              
            </DialogClose>
          </div>
          <DialogDescription className='text-sm text-gray-500 mt-2'>
            Are you sure you want to log out? You will need to sign in again to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-3 flex-col-reverse sm:flex-row sm:justify-end mt-4'>
          <DialogClose asChild>
            <Button
              size='sm'
              variant='outline'
              className='rounded-full px-5 text-sm font-medium transition-colors duration-200 hover:bg-gray-100'
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            size='sm'
            variant='destructive'
            className='rounded-full px-5 text-sm font-medium transition-colors duration-200 bg-red-500 hover:bg-red-600'
            onClick={handleLogout}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading  ? 'Logging out...' : 'Logout'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LogoutModal;
