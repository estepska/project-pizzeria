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
      console.log('new Product:', thisProduct);
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

    initAccordion() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      this.initAccordion = thisProduct(select.menuProduct.clickable);

      /* START: click event listener to trigger */
      trigger.addEventListener('click', this.initAccordion);

      /* prevent default action for event */
      const clickableTrigger = function (event) {
        event.preventDefault();
        console.log('Link was clicked!');

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
      };
    }
  
    const app = {
      initMenu: function () {
        const testProduct = new Product();
        console.log('testProduct:', testProduct);
      },

      initData: function () {
        const thisApp = this;

        thisApp.data = dataSource;
        console.log('thisApp.data:', thisApp.data);
        for (let productData in thisApp.data.products) {
          new Product(productData, thisApp.data.products[productData]);
        };
      },

      init: function () {
        const thisApp = this;
        console.log('*** App starting ***');
        console.log('thisApp:', thisApp);
        console.log('classNames:', classNames);
        console.log('settings:', settings);
        console.log('templates:', templates);

        thisApp.initData();
        thisApp.initMenu();
        thisApp.initAccordion();
      },
    };
  }
}
app.init();
