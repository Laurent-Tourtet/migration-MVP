import {writable} from 'svelte/store';

export const authToken = writable(null);
export const user = writable(null);

export function setUser(data) {
    user.set({
        id: data.user_id,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        location: data.location,
    })
}