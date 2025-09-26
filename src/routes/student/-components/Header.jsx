import { ListCheck } from 'lucide-react'
import { ProfileDropdown } from '../../_authenticated/student/features/tasks/-components/student-profile-dropdown'

function Header() {
  return (
    <>
      <div className='navbar bg-base-100 sticky top-0 z-10 flex justify-between shadow-md'>
        {/* Menu toogle for mobile view or small screen */}
        <div className=''>
          <label
            htmlFor='left-sidebar-drawer'
            className='btn gradiant-btn drawer-button clg:hidden float-right'
          >
            <ListCheck className='inline-block h-5 w-5' />
          </label>
        </div>

        <div className='flex-none'>
          <ProfileDropdown />
        </div>
      </div>
    </>
  )
}

export default Header
