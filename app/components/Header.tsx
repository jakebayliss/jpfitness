import Link from "next/link"
import { useRef } from "react";

const Header = () => {
    const burgerRef = useRef(null);
    const menuRef = useRef(null);
    const closeRef = useRef(null);

    const handleOpen = () => {
        menuRef.current.classList.toggle('hidden');
    }

    const handleClose = () => {
        menuRef.current.classList.toggle('hidden');
    }

    return (
        <div>
            <nav className="relative flex justify-between items-center">
                <div className="lg:hidden">
                    <button ref={burgerRef} className="navbar-burger flex items-center p-2" onClick={() => handleOpen()}>
                        <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <title>Mobile menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                        </svg>
                    </button>
                </div>
            </nav>
            <div ref={menuRef} className="navbar-menu relative z-50 hidden">
                <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
                <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
                    <button ref={closeRef} className="navbar-close" onClick={() => handleClose()}>
                        <svg className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <ul>
                        <li className="mb-1">
                            <Link className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="/">Home</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Header;