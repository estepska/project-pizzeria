/*global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars*/
{
  'use strict';
  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
      activeProducts: '.product.active',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      }
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  //const settings = {
  //amountWidget: {
  //defaultValue: 1,
  //defaultMin: 1,
  //defaultMax: 9,
  //}
  //};
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.initAccordion();
      thisProduct.getElements();
      thisProduct.amountWidget();
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
      const MenuContainer = document.querySelector(select.containerOf.menu);

      /*add element to menu*/
      MenuContainer.appendChild(thisProduct.element);
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
          if (activeProducts !== thisProduct.element) {
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
      //console.log('initOrderForm');

      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
    }
  
    processOrder()  {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData', formData);

      this.params = {};
      let price = thisProduct.data.params;

      for (let param in thisProduct.data.params) {

        const options = thisProduct.data.params[param].options;
        for (let option in options) {
          const ifChecked = formData.hasOwnProperty(param) && formData[param].includes(option);
          const ifDeflaut = options[option].deflaut;

          if (ifChecked && !ifDeflaut) {
            price += options[option].price;
          } else if (!ifChecked && ifDeflaut) {
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
      this.priceSingle = price;
      this.price = this.priceSingle;
      this.priceElem.innerHTML = this.price;

    }
    
    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function () {
        thisProduct.processOrder();
      });
      
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    }
    
  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.getElements(element);
      //console.log('AmountWidget:', thisWidget);
      //console.log('constructor arguments:', element);
      thisWidget.setValue(thisWidget.input.value);
    }
    

    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      thisWidget.setValue(thisWidget.input.value);
    }

    

    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);
      
      

      thisWidget.value = newValue;
      thisWidget.announce();
      thisWidget.input.value = thisWidget.value;
    }

    initActions() {
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function (event) {
        event.preventDeflaut();
        thisWidget.setValue = thisWidget.input.value;
      });

      thisWidget.linkDecrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.setValue = --thisWidget.value;
      });

      thisWidget.linkIncrease.addEventListener('click', function (event) {
        event.preventDefault();
        thisWidget.setValue = ++thisWidget.value;
      });
    }
    announce() {
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }
  class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];
      
      thisCart.getElements(element);

    }
    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};
      
      thisCart.dom.wrapper = element;
    }
  }
  const app = {
    initMenu: function () {
      //const testProduct = new Product();
      //console.log('testProduct:, testProduct');
    },

    initCart: function () {
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

    },

    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
      //console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    init: function () {
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };
  app.init();
}
