import type { Schema, Attribute } from '@strapi/strapi';

export interface FoodFood extends Schema.Component {
  collectionName: 'components_food_foods';
  info: {
    displayName: 'food';
    description: '';
  };
  attributes: {};
}

export interface FoodSavings extends Schema.Component {
  collectionName: 'components_food_savings';
  info: {
    displayName: 'savings';
  };
  attributes: {};
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'food.food': FoodFood;
      'food.savings': FoodSavings;
    }
  }
}
