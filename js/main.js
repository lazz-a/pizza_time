// Start header 
;(function() {

  if(window.matchMedia('(max-width: 992px)').matches){
    return;
  }
  let headerPage = document.querySelector('.header-page');
  
  window.addEventListener('scroll', function(){
    if (window.pageYOffset > 0) {
      headerPage.classList.add('is-active');
    } else {
      headerPage.classList.remove('is-active');
    }
  });
}());

// Start myLib 

;(function(){
  window.myLib = {};

  window.myLib.body = document.querySelector('body');

  window.myLib.closesAttr = function(item, attr){
    let node = item;
    
    while(node) {
      let attrValue = node.getAttribute(attr);
      if (attrValue){
        return attrValue;
      }
      node = node.parentElement;  
    }

    return null;
 };

 
  window.myLib.closesItemByClass = function(item, className){
    let node = item;
    
    while(node) {
      if (node.classList.contains(className)){
        return node;
      }
      node = node.parentElement;  
    }

    return null;
  };

  window.myLib.toggleScroll = function () {
    myLib.body.classList.toggle('no-scroll');
  };


}());

// Start screenTo 

;(function(){

  let scroll = function(target){
 
    let targetTop = target.getBoundingClientRect().top;
    let scrollTop = window.pageYOffset;
    let targetOffsetTop = targetTop + scrollTop;
    let headerOffset = document.querySelector('.header-page').clientHeight;
 
    window.scrollTo(0, targetOffsetTop - headerOffset + 1);
    
  }
 
  myLib.body.addEventListener('click', function(e) {
     let target = e.target;
     let scrollToItemClass = myLib.closesAttr(target, 'data-scroll-to');
 
     if (scrollToItemClass == null){
       return;
     }
     
     e.preventDefault();
     let scrollToItem = document.querySelector('.' + scrollToItemClass);
 
     if (scrollToItem) {
       scroll(scrollToItem);
     }
   });
 
 }());

//  Start popup

;(function(){

  let showPopup = function(target){
     target.classList.add('is-active');
  };

  let closePopup = function(target){
    target.classList.remove('is-active');
 };

 myLib.body.addEventListener('click', function(e) {
     let target = e.target;
     let popupClass = myLib.closesAttr(target, 'data-popup');

     if (popupClass === null){
       return;
     }

     e.preventDefault();
     let popup = document.querySelector('.' + popupClass);

     if (popup) {
       showPopup(popup);
       myLib.toggleScroll();
     }     
  });

  myLib.body.addEventListener('click', function(e) {
   let target = e.target;

   if (target.classList.contains('popup-close') || 
       target.classList.contains('popup__inner')) {
        let popup = myLib.closesItemByClass(target, 'popup');

        closePopup(popup);
        myLib.toggleScroll();
        
       }
    
  });

  myLib.body.addEventListener('keydown', function(e) {
    console.log(e.keyCode);

    if (e.keyCode !== 27){
      return;
    }

    let popup = document.querySelector('.popup.is-active');

    if (popup) {
      closePopup(popup);
      myLib.toggleScroll();
    }
    
  });

}());

// Start catalog 

;(function(){

  let catalogSection = document.querySelector('.section-catalog');

  if (catalogSection === null){
    return;
  }

  let removeChildren = function(item) {
    while (item.firstChild){
      item.removeChild(item.firstChild);
    }
  };
  
  let updateChildren = function(item, children) {
    console.log(children);
    
    removeChildren(item);
    for (var i = 0; i < children.length; i += 1) {
      item.appendChild(children[i]);
    }
  };

  let catalog = catalogSection.querySelector('.catalog');
  let catalogNav = catalogSection.querySelector('.catalog-nav');
  let catalogItems = catalogSection.querySelectorAll('.catalog__item');

  catalogNav.addEventListener('click', function(e) {
    let target = e.target;
    let item = myLib.closesItemByClass(target, 'catalog-nav__btn');

    if (item === null || item.classList.contains('is-active')) {
      return;
    }

    e.preventDefault();
    let filterValue = item.getAttribute('data-filter');
    let previousBtnActive = catalogNav.querySelector('.catalog-nav__btn.is-active');

    previousBtnActive.classList.remove('is-active');
    item.classList.add('is-active');

    if (filterValue === 'all') {
      updateChildren(catalog, catalogItems);
      return;
    }
    
    let filteredItems = [];
    for (var i = 0; i < catalogItems.length; i += 1) {
      let current = catalogItems[i];
      if (current.getAttribute('data-category') === filterValue) {
        filteredItems.push(current);
      }
    }

    updateChildren(catalog, filteredItems);
    
  });


}());

// Start product 

;(function(){

  let catalog = document.querySelector('.catalog');

  if (catalog === null) {
    return;
  }

  let updateProductPrice = function(product, price) {
    let productPrice = product.querySelector('.product__price-value');
    productPrice.textContent = price;
  };

  let changeProductSize = function(target){
    console.log(target);
    let product = myLib.closesItemByClass(target, 'product');
    let previousBtnActive = product.querySelector('.product__size.is-active');
    let newPrice = target.getAttribute('data-product-size-price')

    previousBtnActive.classList.remove('is-active');
    target.classList.add('is-active');
    updateProductPrice(product, newPrice)    
  };

  let changeProductOrderInfo = function(target){
    let product = myLib.closesItemByClass(target, 'product');
    let order = document.querySelector('.popup-order');

    let productTitle = product.querySelector('.product__title').textContent;
    let productSize = product.querySelector('.product__size.is-active').textContent;
    let productPrice = product.querySelector('.product__price-value').textContent;
    let productImgSrc = product.querySelector('.product__img').getAttribute('src');

    order.querySelector('.order-info-title').setAttribute('value', productTitle);
    order.querySelector('.order-info-size').setAttribute('value', productSize);
    order.querySelector('.order-info-price').setAttribute('value', productPrice);

    order.querySelector('.order-product-title').textContent = productTitle;
    order.querySelector('.order-product-price').textContent = productPrice;
    order.querySelector('.order__size').textContent = productSize;
    order.querySelector('.order__img').setAttribute('src', productImgSrc);

    console.log(productTitle);
    
  };

  catalog.addEventListener('click', function(e){
    let target = e.target;

    if (target.classList.contains('product__size') && !target.classList.contains('is-active')){     
      e.preventDefault();

      changeProductSize(target);
    }

    if (target.classList.contains('product__btn')){
      e.preventDefault();

      changeProductOrderInfo(target);
    }
  });

}());

// Start map 

;(function(){
  ymaps.ready(function () {
    var myMap = new ymaps.Map('ymap', {
            center: [55.751574, 37.573856],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        }),
        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            balloonContent: 'г. Москва, Преображенская площадь, 8'
        }, {

            iconLayout: 'default#image',
 
            iconImageHref: '../img/marker.svg',

            iconImageSize: [30, 42],

            iconImageOffset: [-5, -38]
        });

    myMap.geoObjects.add(myPlacemark)

    myMap.behaviors.disable('scrollZoom');
 
});

}());