/*global Handlebars, utils, */ // eslint-disable-line no-unused-vars*/
{
  'use strict';
  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
  // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };
  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initAmountWidget();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
      
      //console.log('new Product:', thisProduct);
    }
  
    renderInMenu() {
      const thisProduct = this;
      /*generate HTML based on this template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /*create element using utils*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /*find menu container*/
      const menuContainer = document.querySelector(select.containerOf.menu);

      /*add element to menu*/
      menuContainer.appendChild(thisProduct.element);
    }

    initActions() {
      const thisProduct = this;

      document.addEventListener('edit', function () {
        thisProduct.updateProduct(event.detail.cartProduct);
      });
    }


    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }
    
    initAccordion() {

      /* find the clickable trigger (the element that should react to clicking) */
      const thisProduct = this;

      /* START: click event listener to trigger */
      thisProduct.accordionTrigger.addEventListener('click', function (event) {
      /* prevent default action for event */
        event.preventDefault();
        console.log('Link was clicked');

        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
        /* find all active products */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
        /* START LOOP: for each active product */
        for (let activeProduct of activeProducts) {
          /* START: if the active product isn't the element of thisProduct */
          if (activeProduct !== thisProduct.element) {
          /* remove class active for the active product */
            activeProduct.classList.remove('active');
          /* END: if the active product isn't the element of thisProduct */
          }
        /* END LOOP: for each active product */
        }
        /* END: click event listener to trigger */ /* END: click event listener to trigger */
      });
    }
    initOrderForm() {
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function (event) {event.preventDefault();
        thisProduct.processOrder();
      });
      for (let input of thisProduct.formInputs) {input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
      }
      thisProduct.cartButton.addEventListener('click', function (event) {event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }
    processOrder()  {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData', formData);

      this.params = {};
      let price = thisProduct.data.price;

      for (let param in thisProduct.data.params) {

        const options = thisProduct.data.params[param].options;
        for (let option in options) {
          const ifChecked = formData.hasOwnProperty(param) && formData[param].includes(option);
          const ifDefault = options[option].default;

          if (ifChecked && !ifDefault) {
            price += options[option].price;
          } else if (!ifChecked && ifDefault) {
            price -= options[option].price;
          }
          if (ifChecked) {
            if (!this.params[param]) {
              this.params[param] = {
                label: thisProduct.data.params[param].label,
                options: {},
              };
            }
            this.params[param].options[option] = options[option].label;
          }
          const image = thisProduct.element.querySelector(`.${param}-${option}`);
          if (image) {
            ifChecked ?
              image.classList.add(classNames.menuProduct.imageVisible) :
              image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }

      }
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = thisProduct.price;

    }
    
    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function () {
        thisProduct.processOrder();
      });
      
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    }
    
    addToCart() {
      const thisProduct = this;

      app.cart.add(thisProduct);
    }
  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.initActions();
      //console.log('AmountWidget:', thisWidget);
      //console.log('constructor arguments:', element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.dom.input.value);
    }

    getElements(element){
      const thisWidget = this;
      thisWidget.dom = {};
      thisWidget.dom = element;
      thisWidget.dom.input = thisWidget.dom.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.querySelector(select.widgets.amount.linkIncrease);
      thisWidget.dom.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.dom.input.value);
    }

    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);
      
      if (!isNaN(newValue)) {
        thisWidget.value = newValue;
      }
      thisWidget.dom.input.value = thisWidget.value;
      thisWidget.announce();
    }

    initActions() {
      const thisWidget = this;

      thisWidget.dom.input.addEventListener('change', function (event) {
        event.preventDefault();
        thisWidget.value(thisWidget.dom.input.value);
      });

      thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.value(thisWidget.value -1);
      });

      thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value +1);
      });
    }

    announce() {
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.dom.dispatchEvent(event);
    }
  }
   
  class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.getElements(element);
      thisCart.initActions();

    }
    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};
      
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
      for(let key of thisCart.renderTotalsKeys){
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      } 
    }

    initActions() {
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });

      thisCart.dom.productList.addEventListener('updated', function () {
        thisCart.update();
      });

      thisCart.dom.productList.addEventListener('remove', function () {
        thisCart.remove(event.detail.cartProduct);
      });

      thisCart.dom.productList.addEventListener('edit', function () {
        thisCart.edit(event.detail.cartProduct);
      });

      //thisCart.dom.form.addEventListener('submit', function () {
      // event.preventDefault();
      //if(thisCart.validForm()) {
      //thisCart.sendOrder();
      // }
      //});
    }

    add(menuProduct) {
      
      /* generate html */
      const generatedHTML = templates.cartProduct(menuProduct);

      /* create DOM element based on  HTML code */
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      /* insert new DOM element to product list in cart */
      this.dom.productList.append(generatedDOM);

      this.products.push(new CartProduct(menuProduct, generatedDOM));

      this.update();
    }

    update() {
      const thisCart = this;
      this.totalNumber = 0;
      this.subTotalPrice = 0;

      for (let product of thisCart.products) {
        thisCart.subTotalPrice += product.price;
        thisCart.totalNumber += product.amount;
        
      }
      thisCart.totalPrice = thisCart.subTotalPrice + thisCart.deliveryFee;
      for (let key of thisCart.renderTotalsKeys) {
        for (let elem of thisCart.dom[key]) {
          elem.innerHTML = thisCart[key];
        } 
      }
    }

    remove(cartProduct) {
      const thisCart = this;
      const index = thisCart.products.indexOf(cartProduct);

      thisCart.products.splice(index, 1);
      cartProduct.dom.wrapper.remove();
      thisCart.update();
    }
    sendOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.order;

      const payload = {
        phone: thisCart.phone.value,
        address: thisCart.address.value,
        totalNumber: thisCart.totalNumber,
        subtotalPrice: thisCart.subtotalPrice,
        totalPrice: thisCart.totalPrice,
        deliveryFee: thisCart.deliveryFee,
        products: []
      };

      for (let product of thisCart.products) {
        payload.products.push(product.getData());
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      fetch(url, options)
        .then(function (response) {
          return response.json();
        });

    }
  }

  class CartProduct{
    constructor(menuProduct, element) {
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
  
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
      
      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
    }

    getElements(element) {
      this.dom = {};
      this.dom.wrapper = element;
      this.dom.price = this.dom.wrapper.querySelector(select.cartProduct.price);
      this.dom.amountWidget = this.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      this.dom.edit = this.dom.wrapper.querySelector(select.cartProduct.edit);
      this.dom.remove = this.dom.wrapper.querySelector(select.cartProduct.remove);
    }

    initAmountWidget() {
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.AmountWidget);

      thisCartProduct.dom.AmountWidget.addEventListener('updated', function () {
        thisCartProduct.processOrder();
      });
      
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
    }

    remove() {
      const thisCartProduct = this;

      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct
        }
      });

      thisCartProduct.dom.wrapper.dispatchEvent(event);

    }

    initActions() {
      const thisCartProduct = this;

      thisCartProduct.dom.edit.addEventListener('click', function (event) {
        event.preventDefault();
      });

      thisCartProduct.dom.remove.addEventListener('click', function (event) {
        event.preventDefault();
        thisCartProduct.remove();
      });
      thisCartProduct.dom.edit.addEventListener('click', function (event) {
        event.preventDefault;
        thisCartProduct.edit();
      });

    }
  }
  const app = {
    initMenu: function () {
      const thisApp = this;
      for (let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },
    initCart: function () {
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

    },
    initData: function () {
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.product;

      fetch(url)
        .then(function (rawResponse) {
          return rawResponse.json();
        })
        .then(function (parsedResponse) {
          thisApp.data.products = parsedResponse;
          thisApp.initMenu();
        });
    }, 

    init: function () {
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);

      thisApp.initData();
      thisApp.initCart();
    },
  };

  app.init();
  
}

