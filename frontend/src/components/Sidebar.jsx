import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => (
    <aside className="w-64 bg-gray-800 text-white h-full">
        <nav className="space-y-2 p-4">
            {role === 'admin' && (
                <>
                    <Link to="/admin-dashboard/all-users" className="block">View All Users</Link>
                    <Link to="/admin-dashboard/add-user" className="block">Add User</Link>
                    <Link to="/admin-dashboard/add-group-expense" className="block">Add Group Expense</Link>
                    <Link to="/admin-dashboard/all-history" className="block">All History</Link>
                </>
            )}
            {role === 'user' && (
                <>
                    <Link to="/user-dashboard/user-balance" className="block">Your Balance</Link>
                    <Link to="/user-dashboard/member-history" className="block">Your History</Link>
                </>
            )}
        </nav>
    </aside>
);

export default Sidebar;
