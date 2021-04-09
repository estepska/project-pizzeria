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

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

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
      thisProduct.initOrderForm();
      thisProduct.processOrder();
      thisProduct.amountWidget();
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
      const clickedMenuProduct.initAccordion = this.element.querySelector(select.menuProduct.clickable);

      /* START: click event listener to trigger */
      accordionTrigger.addEventListener('click', this.initAccordion);

      /* prevent default action for event */
      const clickableTrigger = function (event) {
        event.preventDefault();
        console.log('Link was clicked')
      }

      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');

      /* find all active products */
      const menuProductsActive = thisProduct.element;

      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts) {
        if (!activeProducts[thisProduct.element]) {
          activeProducts.classList.remove('active');
        }
           
      };
      /* START: if the active product isn't the element of thisProduct */

      /* remove class active for the active product */

      /* END: if the active product isn't the element of thisProduct */

      /* END LOOP: for each active product */

      /* END: click event listener to trigger */
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
        this.addToCart();

      });
    }
  
    processOrder() { 
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData', formData);

      this.params = {};
      let price = thisProduct.data.params;

      for (let params in params) {

        const options = params[param].options;
        for (let option in options) {
          const ifChecked = formData.hasOwnProperty(param) && formData[param].includes(options);
          const ifDeflaut = options[option].hasOwnProperty('deflaut') && options(option).deflaut;
          if (ifChecked && !ifDeflaut) {
            price += options[option].price;
          } else if (!ifChecked && ifDeflaut) {
            price -= options[option].price;
          }
          if (ifchecked) {
            if (!this.params[param]) {
              this.params[param] = {
                label: params[param].label,
                options: {},
              };
            }
            this.params[param].options[option] = options[option].label;
          }
          const image = thisimageWrapper.querySelector(' .${param}- ${option}');
          if (image) {
            ifChecked ?
              image.classList.add(classNames.menuProduct.imageVisible) :
              image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }

      }
      this.priceSingle = price;
      price = thisProduct.amountWidget.value
      this.price = this.priceSingle * this.AmountWidget.value;
      this.priceElem.innerHTML = this.price;

    }
    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function () {
        thisProduct.processOrder();
      })
      
      thisProduct.amountWidget = new amountWidget(thisProduct.amountWidgetElem);
    }

    addToCart() {
      const thisProduct = this;
      app.cart.add(thisProduct);
    }
  }

  class amountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.getElements(element);
      //console.log('AmountWidget:', thisWidget);
      //console.log('constructor arguments:', element);
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
      const condition =
      (newValue !== this.getValue) &&
        this.isValid(newValue);
      if (condition) {
      this._correctValue = newValue;
      this.announce();
    }
    this.renderValue();
  }
    get value() {
      return this._correctValue;
    };
      
      /*TODO add validation */
      thisWidget.value = newValue;
      thisWidget.announce();
      thisWidget.Input.value = thisWidget.value;
  };

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
        thisWidget.setValue = ++thisWidget.value
      });
    }
    announce() {
      const thisWidget = this;

      const event = new Even('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }
class Cart{
constructor(element){
  const thisCart = this;

  thisCart.products = [];

  thisCart.getElements(element);
  //console.log('new Cart', thisCart);
}
  
  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
      select.cart.toggleTrigger);
  
  }
  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(
        classNames.cart.wrapperActive
      );
    });
  }

  add(menuProduct) {
    // const thisCart = this;

    console.log('adding product', menuProduct);
    
  }
}
  const app = {
    initMenu: function () {
      const testProduct = new Product();
      //console.log('testProduct:, testProduct');
    },

    initCart: function () {
      const cartElem = document.querySelector(select.containerOf.cart);
      this.cart = new Cart(cartElem);
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
    },
  };
  utils.serializeFormToObject = function (form) {
    let output = {}
    if (typeof form == 'object' && form.nodeName == 'FORM') {
      for (let field of form.elements) {
        if (field.name && !field.disabled && field.type != 'file' && field.type != 'submit' && field.type != 'button') {
          if (field.type == 'select-multiple') {
            for (let option of field.options) {
              if (option.selected) {
                utils.createPropIfUnderfined(output, field.name);
                output[field.name].push(field.value);
              }
            }
          } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
            utils.createPropIfUnderfined(output, field.name);
            output[field.name].push(field.value);
          }
        }
      }
    }
    return output;

  };
  app.init();
}
