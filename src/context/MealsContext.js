import React from "react";
import { flushSync } from "react-dom";

import data from "../db/dataset.json";

const UnitsToSuffixMap = new Map();
UnitsToSuffixMap.set("kilogram", "kg");
UnitsToSuffixMap.set("litre", "l");

export const MealsContext = React.createContext({
  mealsToDisplay: [],
  filterMealsToDisplay: (byName, byFilter) => {},
  getMealById: (id) => {},
  getQualityPrices: (name) => {},
  getIngredientsDetails: (id) => {},
  getHighestQualityOnBudget: (id, budget, random) => {},
  getRandomMealFromBudget : (id, budget) => {},
});

function MealsContextProvider({ children }) {
  const allMealsData = React.useRef(data.meals);
  const allIngredientsData = React.useRef(data.ingredients);

  const [mealsToDisplay, setMealsToDisplay] = React.useState(
    allMealsData.current
  );

  //sort intial meals to display by name and before rendering
  React.useEffect(() => {
    allMealsData.current.sort(compareMealsByName);
    //add lowest price, highest price and average price attributes
    __setPricesAttributes(allMealsData.current);
    // console.log(allMealsData.current);
    setMealsToDisplay([...allMealsData.current]);
  }, []);

  const __setPricesAttributes = React.useCallback((mealsData) => {
    mealsData.forEach((meal) => {
      let lowQualityPrice = 0;
      let mediumQualityPrice = 0;
      let highQualityPrice = 0;
      for (const { name, quantity } of meal.ingredients) {
        let details = allIngredientsData.current.find((ingredient) =>
          ingredient.name.toLowerCase().includes(name.toLowerCase())
        );
        let qualityPrices = details.options.map((option) => option.price);
        highQualityPrice += (quantity / 1000) * qualityPrices[0];
        mediumQualityPrice += (quantity / 1000) * qualityPrices[1];
        lowQualityPrice += (quantity / 1000) * qualityPrices[2];
      }
      meal["lowQualityPrice"] = lowQualityPrice;
      meal["mediumQualityPrice"] = mediumQualityPrice;
      meal["highQualityPrice"] = highQualityPrice;
      meal["averagePrice"] =
        (lowQualityPrice + mediumQualityPrice + highQualityPrice) / 3;
    });
  }, []);

  const filterMealsToDisplay = React.useCallback((byName, byFilter) => {
    setMealsToDisplay(() => {
      let filtered = allMealsData.current;
      if (byName !== "") {
        let namedFilter = byName.toLowerCase();
        filtered = filtered.filter((meal) =>
          meal.name.toLowerCase().includes(namedFilter)
        );
      }

      if (byFilter === "vegan" || byFilter === "vegetarian") {
        filtered = filtered.filter(({ ingredients }) => {
          for (const { name } of ingredients) {
            let details = allIngredientsData.current.filter((ingredient) => {
              return ingredient.name.toLowerCase().includes(name.toLowerCase());
            })[0];

            if (byFilter === "vegan") {
              //a vegan meal is a meal that contains only vegan ingredients
              if (!details.groups.includes("vegan")) {
                return false;
              }
            } else {
              // a vegetarian meal is a meal that contains either vegan or vegetarian
              if (
                !(
                  details.groups.includes("vegetarian") ||
                  details.groups.includes("vegan")
                )
              ) {
                return false;
              }
            }
          }
          return true;
        });
      }

      if (byFilter === "average_lh") filtered.sort(compareMealsByAvgPriceLH);
      else if (byFilter === "average_hl")
        filtered.sort(compareMealsByAvgPriceHL);
      else filtered.sort(compareMealsByName);
      return [...filtered];
    });
  }, []);

  const getMealById = (id) => {
    return allMealsData.current.filter((meal) => meal.id === parseInt(id))[0];
  };

  const getQualityPrices = (name) => {
    let ingredientDetails = allIngredientsData.current.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(name.toLowerCase())
    )[0];
    let qualityPrices = [];
    //index 2 is price of low/ index 1 is price of medium and index 0 is price of high
    for (const { price, per_amount } of ingredientDetails.options) {
      let data = { price: price, suffix: UnitsToSuffixMap.get(per_amount) };
      qualityPrices.push(data);
    }
    return qualityPrices;
  };

  const getIngredientsDetails = (id) => {
    let meal = allMealsData.current.find((meal) => meal.id === parseInt(id));
    // console.log("in get ingredients", meal);
    let returnArr = [];
    meal.ingredients.forEach((ingredient) => {
      let details = allIngredientsData.current.find(
        (detail) => detail.name === ingredient.name
      );
      returnArr.push(details);
    });
    return returnArr;
  };

  const mealsWithIngredientsSpread = React.useCallback((id) => {
    let meal = {...allMealsData.current.find(meal => meal.id === id)};
    meal.ingredients = meal.ingredients.map((ingredient) => {
      let details = allIngredientsData.current.find(
        (detail) => detail.name === ingredient.name
      );
      ingredient = { ...ingredient, ...details };
      return ingredient;
    });
    let cleanedUp = [];
    meal.ingredients.forEach((ingredient) => {
      ingredient.options.forEach(({ name, price, quality }) => {
        cleanedUp.push({
          name: name,
          price: price,
          quantity: ingredient.quantity,
          parentType: ingredient.name,
          quality: quality,
        });
      });
    });
    return cleanedUp;
  }, []);

  const getHighestQualityOnBudget = (id, budget, random) => {
    let cleanedUp = mealsWithIngredientsSpread(parseInt(id));
    //generate all possibilites
    let possibilities = [];
    let tempOrderArr1, tempOrderArr2, tempOrderArr3;
    let sum1, sum2, sum3;
    for (let i = 0; i < cleanedUp.length; i++) {
      tempOrderArr1 = [];
      tempOrderArr1.push(cleanedUp[i]);
      tempOrderArr2 = [];
      tempOrderArr2.push(cleanedUp[i]);
      tempOrderArr3 = [];
      tempOrderArr3.push(cleanedUp[i]);

      sum1 = (cleanedUp[i].quantity / 1000) * cleanedUp[i].price;
      sum2 = sum1;
      sum3 = sum1;
      for (let j = 0; j < cleanedUp.length; j += 3) {
        if (cleanedUp[j].parentType === cleanedUp[i].parentType) continue;
        sum1 += (cleanedUp[j].quantity / 1000) * cleanedUp[j].price;
        sum2 += (cleanedUp[j + 1].quantity / 1000) * cleanedUp[j + 1].price;
        sum3 += (cleanedUp[j + 2].quantity / 1000) * cleanedUp[j + 2].price;
        tempOrderArr1.push(cleanedUp[j]);
        tempOrderArr2.push(cleanedUp[j + 1]);
        tempOrderArr3.push(cleanedUp[j + 2]);
      }
      possibilities.push({ combination: [...tempOrderArr1], total: sum1 });
      possibilities.push({ combination: [...tempOrderArr2], total: sum2 });
      possibilities.push({ combination: [...tempOrderArr3], total: sum3 });
    }

    const consecutiveQualityScores = [];
    for (let i = 0; i < possibilities.length; i++) {
      let qualityScore = possibilities[i].combination.reduce((acc, curr) => {
        switch (curr.quality) {
          case "high":
            return acc + 30;
          case "medium":
            return acc + 20;
          case "low":
            return acc + 10;
        }
      }, 0);
      consecutiveQualityScores.push(
        qualityScore  / allMealsData.current.find(meal => meal.id === parseInt(id)).ingredients.length
      );
    }

    if(random) {
      return {possibilities : possibilities, scores : consecutiveQualityScores};
    }

    let maxQuality = 0;
    let budgetMealsHighQuality = [];
    for (let i = 0; i < possibilities.length; i++) {
      if (possibilities[i].total <= parseFloat(budget)) {
        // if price is in budget
        if (consecutiveQualityScores[i] > maxQuality) {
          maxQuality = consecutiveQualityScores[i];
          budgetMealsHighQuality = [];
          // check if already exists
          budgetMealsHighQuality.push(possibilities[i].combination);
        } else if (consecutiveQualityScores[i] === maxQuality) {
          let exists = false;
          for (let j = 0; j < budgetMealsHighQuality.length; j++) {
            possibilities[i].combination.every(({name : firstname}) => {
              const index = budgetMealsHighQuality[j].findIndex(({name : secondname}) => secondname === firstname);
              if (index === -1) return true;
              exists = true;
              return false;  
            })
          }
          if (!exists) budgetMealsHighQuality.push(possibilities[i].combination);
        }
      }
    }
    return {maxQuality : maxQuality, meals : budgetMealsHighQuality};
  };

  const getRandomMealFromBudget = (id, budget) => {
    id = parseInt(id);
    budget = parseFloat(budget);
    const {possibilities, scores} = getHighestQualityOnBudget(id, budget, true);
    let possibilitiesInBudget = possibilities.filter(({total}) => total <= budget);
    if (possibilitiesInBudget.length === 0) return null;
    
    let randomIndex = Math.floor(Math.random() * possibilitiesInBudget.length);
    return {quality : scores[randomIndex], meal : possibilitiesInBudget[randomIndex]}
  }

  const cxt = {
    mealsToDisplay: mealsToDisplay,
    filterMealsToDisplay: filterMealsToDisplay,
    getMealById: getMealById,
    getQualityPrices: getQualityPrices,
    getIngredientsDetails: getIngredientsDetails,
    getHighestQualityOnBudget: getHighestQualityOnBudget,
    getRandomMealFromBudget : getRandomMealFromBudget,
  };

  return <MealsContext.Provider value={cxt}>{children}</MealsContext.Provider>;
}

function compareMealsByName(first, second) {
  let firstName = first.name.toLowerCase();
  let secondName = second.name.toLowerCase();
  if (firstName < secondName) return -1;
  if (firstName > secondName) return 1;
  return 0;
}

function compareMealsByAvgPriceLH(first, second) {
  let firstAvgPrice = first.averagePrice;
  let secondAvgPrice = second.averagePrice;
  if (firstAvgPrice < secondAvgPrice) return -1;
  if (firstAvgPrice > secondAvgPrice) return 1;
  return 0;
}

function compareMealsByAvgPriceHL(first, second) {
  let firstAvgPrice = first.averagePrice;
  let secondAvgPrice = second.averagePrice;
  if (firstAvgPrice < secondAvgPrice) return 1;
  if (firstAvgPrice > secondAvgPrice) return -1;
  return 0;
}

export default MealsContextProvider;
