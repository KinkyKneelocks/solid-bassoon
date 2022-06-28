const createDateFormat = (initialdate) => {       
    const propDate = new Date(initialdate)    
    const propYear = propDate.getFullYear()
    const propMonth = propDate.getMonth() +1 
    const modMonth = (propMonth < 10 ? `0${propMonth}` : propMonth)
    const propDay = propDate.getDate()
    const propHour = propDate.getHours() + 2
    const propMinute = propDate.getMinutes() 

    const today = new Date()      
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth() + 1     
    const todayDay = today.getDate()
    const todayHour = today.getHours()
    const todayMinute = today.getMinutes()

    if (propYear === todayYear &&
        propMonth === todayMonth &&
        propDay === todayDay && 
        propHour === todayHour) {
            return `${todayMinute - propMinute} minutes ago`
        } else if (propYear === todayYear &&
            propMonth === todayMonth &&
            propDay === todayDay 
            ) {
                return `${todayHour - propHour} hours ago`
        } else {
            return `${propYear}.${modMonth}.${propDay} ${propHour}:${propMinute}`
               }
}

export default createDateFormat