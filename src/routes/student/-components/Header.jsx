import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
import { handleLogout } from '../../../shared/config/reducers/student/studentAuthSlice'
import { ListCheck } from 'lucide-react'
import { ProfileDropdown } from '../../_authenticated/student/features/tasks/-components/student-profile-dropdown'



function Header() {

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const defaultProfile = "https://img.freepik.com/premium-vector/people-profile-graphic_24911-21373.jpg?w=826"
    const credentials = useSelector((state) => state.studentAuth.credentials);
    const { noOfNotifications, pageTitle } = useSelector(state => state.header)


    function logoutUser() {
        // window.location.href = '/teacher/login'
        dispatch(handleLogout());
        navigate('/');
    }

    return (
        // navbar fixed  flex-none justify-between bg-base-300  z-10 shadow-md

        <>
            <div className="navbar sticky top-0 bg-base-100  z-10 shadow-md flex justify-between">


                {/* Menu toogle for mobile view or small screen */}
                <div className="">
                    <label htmlFor="left-sidebar-drawer" className="btn gradiant-btn float-right drawer-button clg:hidden">
                        <ListCheck className="h-5 inline-block w-5" /></label>
                    {/* <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1> */}
                </div>



                <div className="flex-none ">

                    {/* Multiple theme selection, uncomment this if you want to enable multiple themes selection, 
                also includes corporate and retro themes in tailwind.config file */}

                    {/* <select className="select select-sm mr-4" data-choose-theme>
                    <option disabled selected>Theme</option>
                    <option value="light">Default</option>
                    <option value="dark">Dark</option>
                    <option value="corporate">Corporate</option>
                    <option value="retro">Retro</option>
                </select> */}


                    {/* Light and dark theme selection toogle **/}
                    {/* <label className="swap ">
                        <input type="checkbox" />
                        <SunIcon data-set-theme="light" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 " + (currentTheme === "dark" ? "swap-on" : "swap-off")} />
                        <MoonIcon data-set-theme="dark" data-act-class="ACTIVECLASS" className={"fill-current w-6 h-6 " + (currentTheme === "light" ? "swap-on" : "swap-off")} />
                    </label> */}


                    {/* Notification icon */}
                    {/* <button className="btn btn-ghost ml-4  btn-circle" onClick={() => openNotification()}>
                        <div className="indicator">
                            <BellIcon className="h-6 w-6" />
                            {noOfNotifications > 0 ? <span className="indicator-item badge badge-secondary badge-sm">{noOfNotifications}</span> : null}
                        </div>
                    </button> */}


                    {/* Profile icon, opening menu on click */}
               <ProfileDropdown/>
                </div>
            </div>

        </>
    )
}

export default Header