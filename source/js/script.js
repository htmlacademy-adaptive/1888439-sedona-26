'use strict';

const toggleMenu = ({currentTarget}) => {
  const menuElement = currentTarget.closest('.main-navigation').querySelector('.main-navigation__list');
  menuElement.classList.toggle('main-navigation__list--closed');
};

const handleMapError = ({target}) => {
  target.classList.add('map__content--invisible');
};

const contentLoadedHandler = () => {
  const mainNavigation = document.querySelector('.main-header__navigation');
  mainNavigation.classList.add('main-header__navigation--js-enabled');

  const mainMenu = mainNavigation.querySelector('.main-navigation__list');
  mainMenu.classList.add('main-navigation__list--closed');

  const mainMenuToggleButton = mainNavigation.querySelector('.main-navigation__toggle-button');
  mainMenuToggleButton.classList.remove('main-navigation__toggle-button--invisible');
  mainMenuToggleButton.addEventListener('click', toggleMenu);

  const mapIframe = document.querySelector('.map__content');
  if (mapIframe) {
    mapIframe.addEventListener('error', handleMapError);
  }
};

document.addEventListener('DOMContentLoaded', contentLoadedHandler);
