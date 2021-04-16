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

export function updateNameValue(cookie){
    let cookieNameValue = undefined;
    if(cookie){
        cookieNameValue = cookie
            .split('; ')
            .find(row => row.startsWith('name='))
            .split('=')[1];
    }
    return cookieNameValue;
}

export const UserContext = React.createContext({
    id: updateIdValue(document.cookie),
    role: updateRoleValue(document.cookie),
    name: updateNameValue(document.cookie)
});