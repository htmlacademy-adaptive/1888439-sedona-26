'use strict';

const toggleMenu = ({currentTarget}) => {
  const menuElement = currentTarget.closest('.main-header').querySelector('.main-navigation');
  menuElement.classList.toggle('main-navigation--closed');
};

const contentLoadedHandler = () => {
  const mainMenu = document.querySelector('.main-navigation');
  mainMenu.classList.add('main-navigation--closed');

  const mainMenuToggleButton = document.querySelector('.main-header__navigation-toggle-button');
  mainMenuToggleButton.addEventListener('click', toggleMenu);
};

document.addEventListener('DOMContentLoaded', contentLoadedHandler);
