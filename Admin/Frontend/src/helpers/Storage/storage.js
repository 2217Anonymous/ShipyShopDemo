import  securelocalStorage  from  "react-secure-storage";

export const removeUserData = (() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authUser')
    securelocalStorage.removeItem('userData')
    securelocalStorage.removeItem('userId')
    securelocalStorage.removeItem('userMenu')
    securelocalStorage.removeItem('permission')
    securelocalStorage.removeItem('historyId')
})

export const storeAuthToken = ((data) => {
    if(data){
        localStorage.setItem('accessToken',data)
    }
})

export const getAuthToken = (() => {
    return localStorage.getItem('accessToken')
})

export const storeAuthUser = ((data) => {
    if(data){
        securelocalStorage.setItem('authUser',data)
    }
})

export const getAuthUser = (() => {
    return securelocalStorage.getItem('authUser')
})

export const storeUserData = ((data) => {
    if(data){
        securelocalStorage.setItem('userData',data)
    }
}) 

export const getUserData = (() => {
    return securelocalStorage.getItem('userData')
}) 

export const storeUserId = ((data) => {
    if(data){
        securelocalStorage.setItem('userId',data)
    }
}) 

export const getUserId = (() => {
    return securelocalStorage.getItem('userId')
}) 

export const storeAdminData = (() => {
    securelocalStorage.setItem('adminPass','Falcon_4817')
}) 

export const getAdminData = (() => {
    return securelocalStorage.getItem('adminPass')
}) 

export const storeUserMenu = ((data) => {
    if(data){
        securelocalStorage.setItem('userMenu',data)
    }
}) 

export const getUserMenu = (() => {
    return securelocalStorage.getItem('userMenu')
}) 

export const storePermission = ((data) => {
    if(data){
        securelocalStorage.setItem('permission',data)
    }
}) 

export const getPermission = (() => {
    return securelocalStorage.getItem('permission')
}) 

export const setHistory = ((data) => {
    securelocalStorage.removeItem('historyId')
    if(data){
        securelocalStorage.setItem('historyId',data)
    }
}) 

export const getHistory = (() => {
    return securelocalStorage.getItem('historyId')
}) 

export const storeCompanyId = ((data) => {
    securelocalStorage.removeItem('CompanyId')
    if(data){
        securelocalStorage.setItem('CompanyId',data)
    }
}) 

export const getComId= (() => {
    return securelocalStorage.getItem('CompanyId')
}) 

export const setTblRow = ((data) => {
    securelocalStorage.removeItem('tblId')
    if(data){
        securelocalStorage('tblId',data)
    }
})

export const getTblRow = (() => {
    return securelocalStorage.getItem('tblId')
})
