import React from'react';

const cookieIdValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('id='))
    .split('=')[1];

const cookieRoleValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('role='))
    .split('=')[1];

export const UserContext = React.createContext({
    id: cookieIdValue,
    role: cookieRoleValue
});