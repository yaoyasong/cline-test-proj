import Link from 'next/link'
import { ChevronDownIcon, CodeIcon } from '@heroicons/react/outline'

const DropdownMenu = ({ children }) => {
  return (
    <div className="relative group">
      {children}
    </div>
  )
}

const DropdownTrigger = ({ children }) => {
  return (
    <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
      {children}
      <ChevronDownIcon className="ml-1 h-4 w-4" />
    </button>
  )
}

const DropdownContent = ({ children }) => {
  return (
    <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-1">
      <div className="py-1">
        {children}
      </div>
    </div>
  )
}

const DropdownItem = ({ children }) => {
  return (
    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
      {children}
    </a>
  )
}

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center text-xl font-bold">
            <CodeIcon className="h-6 w-6 mr-2" />
            DG Helper
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <DropdownMenu>
              <DropdownTrigger>Dashboard</DropdownTrigger>
              <DropdownContent>
                <DropdownItem>Overview</DropdownItem>
                <DropdownItem>Analytics</DropdownItem>
                <DropdownItem>Reports</DropdownItem>
              </DropdownContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownTrigger>Settings</DropdownTrigger>
              <DropdownContent>
                <DropdownItem>Profile</DropdownItem>
                <DropdownItem>Preferences</DropdownItem>
                <DropdownItem>Security</DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
