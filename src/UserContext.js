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

function updateNameValue(){
    let cookieNameValue = undefined;
    if(document.cookie){
        cookieNameValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('name='))
            .split('=')[1];
    }
    return cookieNameValue;
}

export const UserContext = React.createContext({
    id: updateIdValue(),
    role: updateRoleValue(),
    name: updateNameValue()
});