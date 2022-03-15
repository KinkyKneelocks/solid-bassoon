const getUrlParameters = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');
    
        return productId;
    }


const createProductItem = (itemData) => {
    let productItemImg = document.createElement('img');
    productItemImg.src = itemData.imageUrl;
    productItemImg.alt = itemData.altTxt;
    document.querySelector('.item__img').appendChild(productItemImg);
    
    document.getElementById('title').textContent = itemData.name;
    document.getElementById('price').textContent = itemData.price;
    document.getElementById('description').textContent = itemData.description;
    document.getElementById('colors').querySelector('option').remove();

    for (i=0; i < itemData.colors.length; i++){
        let listItem = document.createElement('option');
        listItem.textContent = itemData.colors[i];
        listItem.value = itemData.colors[i];
        document.getElementById('colors').appendChild(listItem);
}
}


let productsApi = 'http://localhost:3000/api/products/';
productsApi += getUrlParameters();
console.log(productsApi);

fetch(productsApi)
  .then(response => response.json())
  .then(data => {
      createProductItem(data);
            }
       );



let inputElement = document.getElementById('quantity');
inputElement.addEventListener('change',() => {
    if (inputElement.value > 100) {
        inputElement.value = 100;
        alert('You cannot purchase more than 100 items.');
    } else 
    if (inputElement.value < 1){
        inputElement.value = 1;
        alert('Purchase amount must be at least 1.');
    };
});



let cartButton = document.getElementById('addToCart');
cartButton.addEventListener('click', () => {
addToCart();
});


const createCartItem = () => {
let cartItem = {};
cartItem.id = getUrlParameters();
cartItem.amount = Number(document.getElementById('quantity').value);
cartItem.color = document.getElementById('colors').value;
cartItem.uniqueKey = cartItem.id + '_' + cartItem.color;
return cartItem;
}


const getCartItems = () => {
    if (localStorage.getItem('cart') === null){
        let cart = [];
        return cart;
        } else {
        let cart = JSON.parse(localStorage.getItem('cart'));
        return cart;
    }
}



const addToCart = () => {
    let item = createCartItem();
    let cartItemList = getCartItems();
    let foundId = false;

    if (cartItemList.length < 1){        
        cartItemList.push(item);
        firstItem = true;
    }  else {
        for (i = 0; i < cartItemList.length; i++){
            if (cartItemList[i].uniqueKey === item.uniqueKey){
                cartItemList[i].amount += item.amount;
                if (cartItemList[i].amount > 100){
                    cartItemList[i].amount = 100;
                } 
                let foundId = true;
                break;
            }
            if (i == (cartItemList.length - 1) && foundId === false){
                cartItemList.push(item);
                break;
            }
        }

        
    }
    localStorage.setItem('cart', JSON.stringify(cartItemList));
}

