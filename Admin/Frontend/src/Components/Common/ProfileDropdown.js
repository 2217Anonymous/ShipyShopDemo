import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useDispatch } from 'react-redux';

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { Link, useNavigate } from 'react-router-dom';
import Cookie from "js.cookie";
import secureLocalStorage from 'react-secure-storage';

const ProfileDropdown = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [authUser, setAuthUser] = useState("Admin");

    const handleLogOut = () => {
        Cookie.remove("adminInfo");
        localStorage.clear()
        secureLocalStorage.clear()
        window.location.replace(`/`);
    };

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={authUser?.ProfilePic || avatar1}
                            alt="Header Avatar" />
                        {/* <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{`${authUser.Name} ${authUser.SurName}`}</span>
                            <span className="d-none d-xl-block ms-1 fs-13 text-muted user-name-sub-text">{`${authUser.UserRole}`}</span>
                        </span> */}
                    </span> 
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {`Venkateshwaran T`}</h6>
                    {/* <h6 className="dropdown-header">{role}</h6> */}
                    <DropdownItem className='p-0'>
                        <Link to={process.env.PUBLIC_URL + "/profile"} className="dropdown-item">
                            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                            <span className="align-middle"> Profile</span>
                        </Link>
                    </DropdownItem>

                    {/* <DropdownItem className='p-0'>
                        <Link to={process.env.PUBLIC_URL + "/pages-profile-settings"} className="dropdown-item">
                            <span
                                className="badge bg-success-subtle text-success mt-1 float-end">New</span><i
                                    className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i> <span
                                        className="align-middle">Settings</span>
                        </Link>
                    </DropdownItem> */}
                    <DropdownItem className='p-0'>
                        <Link to={process.env.PUBLIC_URL + "/auth-lockscreen-basic"} className="dropdown-item">
                            <i
                                className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Lock screen</span>
                        </Link>
                    </DropdownItem>
                    <DropdownItem className='p-0'>
                        <Link onClick={handleLogOut} className="dropdown-item">
                            <i
                                className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                                    className="align-middle" data-key="t-logout">Logout</span>
                        </Link>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;