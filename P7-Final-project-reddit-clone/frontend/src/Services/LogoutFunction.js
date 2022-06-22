
const logout = () => {    

    fetch('http://localhost:3000/api/users/logout', {
        credentials: 'include'
    })
    .then((res) => {
        if (res.status !== 200) {
            throw Error('Service is not available')
        } else {
            console.log('Logged out')  
        }
    })
}

export default logout