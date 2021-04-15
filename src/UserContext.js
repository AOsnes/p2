import React from'react';

export function updateIdValue(cookie) {
    let cookieIdValue = undefined;
    if(cookie){
        cookieIdValue = cookie
            .split('; ')
            .find(row => row.startsWith('id='))
            .split('=')[1];
    }
    return cookieIdValue
}

export function updateRoleValue(cookie){
    let cookieRoleValue = undefined;
    if(cookie){
        cookieRoleValue = cookie
            .split('; ')
            .find(row => row.startsWith('role='))
            .split('=')[1];
    }
    return cookieRoleValue;
}

export const UserContext = React.createContext({
    id: updateIdValue(document.cookie),
    role: updateRoleValue(document.cookie)
});