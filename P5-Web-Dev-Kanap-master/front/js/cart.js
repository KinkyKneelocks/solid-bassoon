let productsApi = 'http://localhost:3000/api/products/';

const getCartItems = () => {
    if (localStorage.getItem('cart') === null){
        let cart = [];
        return cart;
        } else {
        let cart = JSON.parse(localStorage.getItem('cart'));
        return cart;
    }
}

const cartItems = getCartItems();
let totalAmount = 0;
let totalPrice = 0;


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

const calcCartAmount = (apidata, amountid) => {
    let amountFromSession = Number(amountid);
    totalAmount += amountFromSession;
    let unitTotal = amountid * apidata.price;
    console.log(unitTotal);
    totalPrice += unitTotal;
    document.getElementById('totalQuantity').textContent = Number(totalAmount);
    document.getElementById('totalPrice').textContent = Number(totalPrice);
}



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

const getFormItems = () => {
    let formItems = {};
    formItems.firstName = String(document.getElementById('firstName').value);
    formItems.lastName = String(document.getElementById('lastName').value);
    formItems.address = String(document.getElementById('address').value);
    formItems.city = String(document.getElementById('city').value);
    formItems.email = String(document.getElementById('email').value);

    return formItems;
}

const getProductFromCart = () => {
    let products = document.querySelectorAll('.cart__item');
    let productList = [];

    for (i = 0; i < products.length; i++){
        productList.push(products[i].dataset.id);
    }

    return productList;
};

