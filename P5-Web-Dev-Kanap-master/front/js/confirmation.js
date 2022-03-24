/* This short script gets the URL parameter presen (orderId) and adds it to the specified element in the DOM */
const getUrlParameters = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const orderId = urlParams.get('orderId');
    
        return orderId;
    }

    document.getElementById('orderId').textContent = getUrlParameters();