import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AaIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
    {
        title: "Home",
        path: "/",
        icon: <AaIcons.AiFillHome/>,
        cName: "nav-text",
    },
    {
        title: "Trips",
        path: "/trips",
        icon: <FaIcons.FaTruck/>,
        cName: "nav-text",
    },
    {
        title: "Finance",
        path: "/finance",
        icon: <FaIcons.FaChartLine/>,
        cName: "nav-text",
    },
];