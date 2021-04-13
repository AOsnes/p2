import React from'react';

function updateIdValue() {
    let cookieIdValue = undefined;
    if(document.cookie){
        cookieIdValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('id='))
            .split('=')[1];
    }
    return cookieIdValue
}

function updateRoleValue(){
    let cookieRoleValue = undefined;
    if(document.cookie){
        cookieRoleValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('role='))
            .split('=')[1];
    }
    return cookieRoleValue;
}

export const UserContext = React.createContext({
    id: updateIdValue(),
    role: updateRoleValue()
});