import { useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LuUserRound } from "react-icons/lu";

function UserButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        {/* Profile button */}
        <div className="fixed top-4 right-6">
          <Menu>
            <MenuButton className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white cursor-pointer p-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none ">
              <LuUserRound className="size-6" />
            </MenuButton>
            <MenuItems
              transition
              anchor="bottom end"
              className="w-35 origin-top-right rounded-md shadow-md border border-white/5 bg-white p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
            >
              <MenuItem className="px-4 py-2 rounded-md">
                <a
                  className="block data-focus:bg-blue-50 text-sm"
                  href="/profile"
                >
                  Your Profile
                </a>
              </MenuItem>
              <hr className="my-1 border-gray-200" />
              <MenuItem className="px-4 py-2 rounded-md">
                <a
                  className="block data-focus:bg-blue-50 text-sm"
                  onClick={handleLogout}
                  href="/support"
                >
                  Sign Out
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default UserButton;
