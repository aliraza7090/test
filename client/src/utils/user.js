import store from "redux/store";

 const isAdmin = () => {
    const {user} = store.getState()?.user;

    return user.role === 'ADMIN'
};

 const isSubAdmin = () => {
    const {user} = store.getState()?.user;

    return user.role === 'SUB_ADMIN'
};
export  {isAdmin , isSubAdmin}