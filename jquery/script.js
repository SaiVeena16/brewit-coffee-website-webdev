$("#search-btn").on("click",function() {
    $(".search-form").toggleClass("active");
});
$("#login-btn").on("click",function() {
    $(".login-form").toggleClass("active");
});
$("#menu-bars").on("click",function() {
    $(".drop-down").toggleClass("responsive");
});
$("#cart-btn").on("click",function() {
    $(".shopping-cart").toggleClass("showcart");
});
$(".close").on("click",function() {
    $(".shopping-cart").toggleClass("showcart");
});
let listProduct = document.querySelector('.listproducts');
let listCart = document.querySelector(".listcart");
let menuContainer = document.querySelectorAll('.container');
let iconCartSpan = document.querySelector('#cart-btn span')
let listItems = [];
let cart = [];

const addDataToHTML = () => {
    menuContainer.innerHTML = ""
    if (listItems.length > 0) {
        listItems.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add("menu-item");
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h4>${product.name}</h4>
                <p class="price">Price: <span>Rs${product.price}</span></p>
                <button class="add-to-cart">Add to cart</button>
            `;
            menuContainer.forEach(container =>{
                container.appendChild(newProduct);

            })
        });
    }
};


listProduct.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('add-to-cart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
        
    }
});
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCart.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = listItems.findIndex((value) => value.id == item.product_id);
            let info = listItems[positionProduct];
            listCart.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}
listCart.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}


const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            listItems = data;
            addDataToHTML();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};

initApp();


