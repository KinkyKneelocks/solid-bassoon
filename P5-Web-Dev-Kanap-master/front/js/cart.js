let productsApi = 'http://localhost:3000/api/products/';

/* This function makes sure, that the cart element in the local storage is up to date, and the local storage is not overwritten by accident */
const getCartItems = () => {
    if (localStorage.getItem('cart') === null){
        let cart = [];
        return cart;
        } else {
        let cart = JSON.parse(localStorage.getItem('cart'));
        return cart;
    }
}

/* Here we get all cart items, and set all totals to 0, before we start any calculations */
const cartItems = getCartItems();
let totalAmount = 0;
let totalPrice = 0;

/* THis function generates all DOM element from the carts parameters (id, color, uniquekeyid and amount). For each element a different API call is used.
This makes it scale better, as the server does not have to give back large amounts of data, which has to be filtered on the client side, but gives back the only elements necessaery.
Event listeners are added to the elements here, to make it align better to API response delays. */
const createCartItem = (apidata, colorid, amountid, uniqueKeyId) => {
    let productItemArticle = document.createElement('article');
    productItemArticle.classList.add('cart__item');
    productItemArticle.dataset.id = apidata._id;
    productItemArticle.dataset.color = colorid;
    productItemArticle.dataset.uniquekey = uniqueKeyId;
    
    let productItemImgWrapper = document.createElement('div');
    productItemImgWrapper.classList.add('cart__item__img');
    productItemArticle.appendChild(productItemImgWrapper);
    
    let productItemImg = document.createElement('img');
    productItemImg.src = apidata.imageUrl;
    productItemImg.alt = apidata.altTxt;
    productItemImgWrapper.appendChild(productItemImg);
    
    let productItemContentWrapper = document.createElement('div');
    productItemContentWrapper.classList.add('cart__item__content');
    productItemArticle.appendChild(productItemContentWrapper);
    
    let productItemTextWrapper = document.createElement('div');
    productItemTextWrapper.classList.add('cart__item__content__description');
    productItemContentWrapper.appendChild(productItemTextWrapper);
    
    let productItemTextHeading = document.createElement('h2');
    productItemTextHeading.textContent = apidata.name;
    productItemTextWrapper.appendChild(productItemTextHeading);
    
    let productItemTextOne = document.createElement('p');
    productItemTextOne.textContent = colorid;
    productItemTextWrapper.appendChild(productItemTextOne);
    
    let productItemTextTwo = document.createElement('p');
    productItemTextTwo.textContent = '€' + apidata.price;
    productItemTextWrapper.appendChild(productItemTextTwo);
    
    let productItemSettingsWrapper = document.createElement('div');
    productItemSettingsWrapper.classList.add('cart__item__content__settings');
    productItemArticle.appendChild(productItemSettingsWrapper);
    
    let productItemSettingsQuantity = document.createElement('div');
    productItemSettingsQuantity.classList.add('cart__item__content__settings__quantity');
    productItemSettingsWrapper.appendChild(productItemSettingsQuantity);
    
    let productItemSettingsQuantityP = document.createElement('p');
    productItemSettingsQuantityP.textContent = 'Qté : ';
    productItemSettingsQuantity.appendChild(productItemSettingsQuantityP);
    
    let productItemSettingsQuantityInput = document.createElement('input');
    productItemSettingsQuantityInput.type = 'number';
    productItemSettingsQuantityInput.classList.add('itemQuantity');
    productItemSettingsQuantityInput.name = 'itemQuantity';
    productItemSettingsQuantityInput.min = 1;
    productItemSettingsQuantityInput.max = 100;
    productItemSettingsQuantityInput.value = amountid;
    productItemSettingsQuantityInput.addEventListener('change', (e) => {
        let parent = e.target.closest('.cart__item');
        let newAmount = e.target.value;
        if (newAmount > 100){
            newAmount = 100;
            e.target.value = 100;
        }
        if (newAmount < 1){
            newAmount = 1;
            e.target.value = 1;
        }
        console.log(newAmount);
        modifyItem(parent, newAmount);
    })
    productItemSettingsQuantity.appendChild(productItemSettingsQuantityInput);
    
    let productItemSettingsDelete = document.createElement('div');
    productItemSettingsDelete.classList.add('cart__item__content__settings__delete');
    productItemSettingsWrapper.appendChild(productItemSettingsDelete);
    
    let productItemSettingsDeleteP = document.createElement('p');
    productItemSettingsDeleteP.classList.add('deleteItem');
    productItemSettingsDeleteP.textContent = 'Delete';
    productItemSettingsDeleteP.addEventListener('click', (e) => {
        let parent = e.target.closest('.cart__item');
        removeItem(parent);
    })
    productItemSettingsDelete.appendChild(productItemSettingsDeleteP);
    
    
    
    document.getElementById('cart__items').appendChild(productItemArticle);
    }

/* This function calculates the total amount of products and their value in the cart and adds these values to the DOM */
const calcCartAmount = (apidata, amountid) => {
    let amountFromSession = Number(amountid);
    totalAmount += amountFromSession;
    let unitTotal = amountid * apidata.price;
    console.log(unitTotal);
    totalPrice += unitTotal;
    document.getElementById('totalQuantity').textContent = Number(totalAmount);
    document.getElementById('totalPrice').textContent = Number(totalPrice);
}


/* This for loop, goes through all elements in the cart item of the local storage, and fetches the appropriate product from the backend depending on their id.
Color and amount is fetched from the cart local storage */
for (i = 0; i < cartItems.length; i++){
 console.log(cartItems[i]);
 let color = cartItems[i].color;
 let amount = cartItems[i].amount;
 let uniqueKey = cartItems[i].uniqueKey;

 let productApiUrl = productsApi + cartItems[i].id;

 fetch(productApiUrl)
  .then(response => response.json())
  .then(data => {
      console.log(color);
    createCartItem(data, color, amount, uniqueKey);
    calcCartAmount(data, amount);
            }
       );
 
}

/* This function removes selected items from the cart and recalculates the total price and amount in the cart.
It uses an API call to determine unit price */
const removeItem = (element) => {
    console.log(element.dataset.uniquekey);
    let cartItemList = getCartItems();
    
    for (i = 0; i < cartItemList.length; i++){
        if (element.dataset.uniquekey == cartItemList[i].uniqueKey){
            totalAmount -= Number(cartItemList[i].amount);
            document.getElementById('totalQuantity').textContent = Number(totalAmount);

            let amount = cartItemList[i].amount;
            let productApiUrl = productsApi + element.dataset.id;
            fetch(productApiUrl)
            .then(response => response.json())
            .then(data => {
                totalPrice -= (data.price * amount);
                document.getElementById('totalPrice').textContent = Number(totalPrice);
                      }
            );            

            cartItemList.splice(i, 1);
            localStorage.setItem('cart', JSON.stringify(cartItemList));
            element.remove();
        }
    }
}

/* This function allows the user to modify the amount of product in the cart.
It uses an API call to determin unit price. */
const modifyItem = (element, newAmount) => {
    let cartItemList = getCartItems();
    for (i = 0; i < cartItemList.length; i++){
        if (element.dataset.uniquekey == cartItemList[i].uniqueKey){
            let oldAmount = Number(cartItemList[i].amount);
            totalAmount -= oldAmount;
            cartItemList[i].amount = Number(newAmount);
            totalAmount += cartItemList[i].amount;
            document.getElementById('totalQuantity').textContent = Number(totalAmount);

            let amount = cartItemList[i].amount;
            let productApiUrl = productsApi + element.dataset.id;
            fetch(productApiUrl)
            .then(response => response.json())
            .then(data => {
                totalPrice -= (data.price * oldAmount);
                totalPrice += (data.price * amount);
                document.getElementById('totalPrice').textContent = Number(totalPrice);
                      }
            );
            localStorage.setItem('cart', JSON.stringify(cartItemList));
        }
    }
};

/* These events validate input in the order form, making sure that proper data is sent to the back. Validation happens on the FE */
document.getElementById('email').addEventListener('change', ($event) => {
    valideInput($event, '.+@.+\..+');
});

document.getElementById('firstName').addEventListener('change', ($event) => {
    valideInput($event, '^[a-zA-Z ]*$');
});

document.getElementById('lastName').addEventListener('change', ($event) => {
    valideInput($event, '^[a-zA-Z ]*$');
});

document.getElementById('address').addEventListener('change', ($event) => {
    valideInput($event, "[A-Za-z0-9'\.\-\s\,]");
});

document.getElementById('city').addEventListener('change', ($event) => {
    valideInput($event, '^[a-zA-Z ]*$');
});

/* This function utilizes Regular expressions to validate form data */
const valideInput = (e, customRegexp) => {
    let regex = new RegExp(customRegexp);
    if (regex.test(e.target.value) === true) {
        e.target.nextElementSibling.style.display = 'none';
        document.getElementById('order').disabled = false;
    } else {
        e.target.nextElementSibling.style.display = 'block';
        document.getElementById('order').disabled = true;
    }
};

/* This function creates a contact object, which represents all user inputs in the form */
const getFormItems = () => {
    let formItems = {};
    formItems.firstName = String(document.getElementById('firstName').value);
    formItems.lastName = String(document.getElementById('lastName').value);
    formItems.address = String(document.getElementById('address').value);
    formItems.city = String(document.getElementById('city').value);
    formItems.email = String(document.getElementById('email').value);

    return formItems;
}

/* This function lists all product IDs, which are currently in the cart */
const getProductFromCart = () => {
    let products = document.querySelectorAll('.cart__item');
    let productList = [];

    for (i = 0; i < products.length; i++){
        productList.push(String(products[i].dataset.id));
    }

    return productList;
};


/* This event uses getProductFromCart() and getFormItems() function to create the data to be sent to the server.
It first validates that each of the data in the POST body is valid.
Then it sends the POST request to the backend. If the response of the backend is not OK, it throws an error to the console.
If it is an OK request, it prevents default of the form, sends all data to the backend, and waits for a response.
From the response it creates a redirect to the confirmation page and adds the proper URL parameter. */
document.getElementById('order').addEventListener('click', ($event) => { 
    let allData = {
        contact: getFormItems(), 
        products: getProductFromCart()
        };       

    if (allData.contact.firstName &&
        allData.contact.lastName &&
        allData.contact.email &&
        allData.contact.address &&
        allData.contact.city &&
        allData.products){
    
    $event.preventDefault();

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(allData),
    };
    fetch('http://localhost:3000/api/products/order', options)
        .then(response => {
	        console.log(response.status);
                if (!response.ok) {
	            throw new Error('Network response was status ' + response.status);
                }
	            return response.json();

        })
        .then(data => {
            localStorage.removeItem('cart');
            let newUrl = '/P5-Web-Dev-Kanap-master/front/html/confirmation.html?orderId=' + data.orderId;
            window.location.href = newUrl;
        })
        .catch((error) => {
            console.error(error);
        });
    }
});

