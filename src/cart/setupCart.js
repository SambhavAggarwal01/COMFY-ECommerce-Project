import {
    getStorageItem,
    setStorageItem,
    formatPrice,
    getElement,
} from '../utils.js';

import { openCart } from './toggleCart.js';
import { findProduct } from '../store.js';
import addToCartDOM from './addToCartDOM.js';

// set items

const cartItemCountDOM = getElement('.cart-item-count');
const cartItemsDOM = getElement('.cart-items');
const cartTotalDOM = getElement('.cart-total');

let cart = getStorageItem('cart');

export const addToCart = (id) => {

    let item = cart.find((cartItem) => cartItem.id === id);

    if (!item) {
        let product = findProduct(id);

        // Adding Item to the Cart
        product = {...product, amount: 1 };
        cart = [...cart, product];

        // Add Item to the DOM
        addToCartDOM(product);
    } else {

        // update values

        const amount = increaseAmount(id);
        const items = [...cartItemsDOM.querySelectorAll('.cart-item-amount')];
        const newAmount = items.find((value) => value.dataset.id === id);
        newAmount.textContent = amount;
    }

    // Adding to the Item Count

    displayCartItemCount();

    // Display Cart Totals

    displayCartTotal();

    // Set Cart in Local Storage

    setStorageItem('cart', cart);

    openCart();
};

function displayCartItemCount() {
    const amount = cart.reduce((total, cartItem) => {
        return (total += cartItem.amount);
    }, 0);
    cartItemCountDOM.textContent = amount;
}

function displayCartTotal() {
    let total = cart.reduce((total, cartItem) => {
        return total += cartItem.price * cartItem.amount;
    }, 0);
    cartTotalDOM.textContent = `Total : ${formatPrice(total)}`;
}

function displayCartItemsDOM() {
    cart.forEach((cartItem) => {
        addToCartDOM(cartItem);
    });
}

function removeItem(id) {
    cart = cart.filter((cartItem) => cartItem.id !== id);
}

function increaseAmount(id) {
    let newAmount;
    cart = cart.map((cartItem) => {
        if (cartItem.id === id) {
            newAmount = cartItem.amount + 1;
            cartItem = {...cartItem, amount: newAmount };

        }
        return cartItem;
    });
    return newAmount;
}

function decreaseAmount(id) {
    let newAmount;
    cart = cart.map((cartItem) => {
        if (cartItem.id === id) {
            newAmount = cartItem.amount - 1;
            cartItem = {...cartItem, amount: newAmount };

        }
        return cartItem;
    });
    return newAmount;
}

function setupCartFunctionality() {
    cartItemsDOM.addEventListener('click', function(e) {
        const element = e.target;
        const parent = e.target.parentElement;
        const id = e.target.dataset.id;
        const parentID = e.target.parentElement.dataset.id;

        // Remove

        if (element.classList.contains('cart-item-remove-btn')) {
            removeItem(id);
            parent.parentElement.remove();
        }

        //Increase

        if (parent.classList.contains('cart-item-increase-btn')) {
            const newAmount = increaseAmount(parentID);
            parent.nextElementSibling.textContent = newAmount;
        }

        //Decrease

        if (parent.classList.contains('cart-item-decrease-btn')) {
            const newAmount = decreaseAmount(parentID);
            if (newAmount === 0) {
                removeItem(parentID);
                parent.parentElement.parentElement.remove();
            } else {
                parent.previousElementSibling.textContent = newAmount;
            }
        }

        displayCartItemCount();
        displayCartTotal();
        setStorageItem('cart', cart);
    });
}

const init = () => {
    // Display Amount of Cart Items

    displayCartItemCount();

    // Display Total

    displayCartTotal();

    // Add all cart items to DOM

    displayCartItemsDOM();

    // Set up Cart Functionalllity

    setupCartFunctionality();

};

init();