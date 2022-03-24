const productsApi = 'http://localhost:3000/api/products/';
const items = document.getElementById('items');

/* This function generates each DOM element that is passed through in the productData variable */

const createItems = (productData) => {
    for (i=0; i < productData.length; i++) {

        let productItem = document.createElement('a');
        productItem.href = './product.html?id=' + productData[i]._id;
        productItem.id = (productData[i]._id);
        
        let productItemArticle = document.createElement('article');
        productItem.appendChild(productItemArticle);
        
        let productItemImg = document.createElement('img');
        productItemImg.src = productData[i].imageUrl;
        productItemImg.alt = productData[i].altTxt;
        productItemArticle.appendChild(productItemImg);
        
        let productItemHeading = document.createElement('h3');
        productItemHeading.classList.add('productName');
        productItemHeading.textContent = productData[i].name;
        productItemArticle.appendChild(productItemHeading);
        
        let productItemText = document.createElement('p');
        productItemText.classList.add('productDescription');
        productItemText.textContent = productData[i].description;
        productItemArticle.appendChild(productItemText);
        
        
        items.appendChild(productItem);
}
}

/* This fetch gets ALL products from the backend and then calls the createItems function to integrate into the DOM */

fetch(productsApi)
  .then(response => response.json())
  .then(data => {
    createItems(data);
console.log('products have been loaded successfully');
})
;

