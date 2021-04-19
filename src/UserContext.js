import React from'react';

export function updateIdValue(cookie) {
    let cookieIdValue = undefined;
    if(cookie){
        try {
            cookieIdValue = cookie
                .split('; ')
                .find(row => row.startsWith('id='))
                .split('=')[1];
        } catch (e) {}
    }
    return cookieIdValue
}

export function updateRoleValue(cookie){
    let cookieRoleValue = undefined;
    if(cookie){
        try {
            cookieRoleValue = cookie
                .split('; ')
                .find(row => row.startsWith('role='))
                .split('=')[1];
        } catch (e) {}
    }
    return cookieRoleValue;
}

export function updateNameValue(cookie){
    let cookieNameValue = undefined;
    if(cookie){
        try {
            cookieNameValue = cookie
                .split('; ')
                .find(row => row.startsWith('name='))
                .split('=')[1];
        } catch (e) {}
    }
    return cookieNameValue;
}

export const UserContext = React.createContext({
    id: updateIdValue(document.cookie),
    role: updateRoleValue(document.cookie),
    name: updateNameValue(document.cookie)
});