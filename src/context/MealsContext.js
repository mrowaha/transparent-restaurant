import React from "react";
import { flushSync } from "react-dom";

import data from "../db/dataset.json";

const UnitsToSuffixMap = new Map();
UnitsToSuffixMap.set("kilogram", "kg");
UnitsToSuffixMap.set("litre", "l");

export const MealsContext = React.createContext({
  mealsToDisplay: [],
  filterMealsToDisplay: (byName, byDietaryPreference) => {},
  getMealById: (id) => {},
  getQualityPrices: (name) => {},
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

  const filterMealsToDisplay = React.useCallback(
    (byName, byDietaryPreference) => {
      // if there are no filters set
      if (byName === "" && byDietaryPreference === "none") {
        setMealsToDisplay(allMealsData.current);
        return;
      }

      //filter by name only
      // if (byDietaryPreference === "none" && byName !== "") {

      setMealsToDisplay(() => {
        let filtered = allMealsData.current;
        if (byName !== "") {
          let namedFilter = byName.toLowerCase();
          filtered = filtered.filter((meal) =>
            meal.name.toLowerCase().includes(namedFilter)
          );
        }

        if (byDietaryPreference !== "none") {
          filtered = filtered.filter(({ ingredients }) => {
            for (const { name } of ingredients) {
              let details = allIngredientsData.current.filter((ingredient) => {
                return ingredient.name
                  .toLowerCase()
                  .includes(name.toLowerCase());
              })[0];

              if (byDietaryPreference === "vegan") {
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

        // sort by name before returning
        filtered = filtered.sort(compareMealsByName);
        return filtered;
      });

      // return;

      //filter by dietary preference only
      // if (byName === "" && byDietaryPreference !== "none") {
      // if (byDietaryPreference !== "none") {
      //   setMealsToDisplay(() => {
      //     let filteredByDietaryPref = mealsToDisplay.filter(
      //       ({ ingredients }) => {
      //         for (const { name } of ingredients) {
      //           let details = allIngredientsData.current.filter(
      //             (ingredient) => {
      //               return ingredient.name
      //                 .toLowerCase()
      //                 .includes(name.toLowerCase());
      //             }
      //           )[0];

      //           if (byDietaryPreference === "vegan") {
      //             //a vegan meal is a meal that contains only vegan ingredients
      //             if (!details.groups.includes("vegan")) {
      //               return false;
      //             }
      //           } else {
      //             // a vegetarian meal is a meal that contains either vegan or vegetarian
      //             if (
      //               !(
      //                 details.groups.includes("vegetarian") ||
      //                 details.groups.includes("vegan")
      //               )
      //             ) {
      //               return false;
      //             }
      //           }
      //         }
      //         return true;
      //       }
      //     );
      //     filteredByDietaryPref =
      //       filteredByDietaryPref.sort(compareMealsByName);
      //     return filteredByDietaryPref;
      //   });
      // }

      // //filter by both name and dietary preference
      // setMealsToDisplay(() => {
      //   let filtered = allMealsData.current.filter(meal => {
      //     //check by ingredient first
      //     for (const {name} of meal.ingredients) {
      //       let details = allIngredientsData.current.filter(ingredient => ingredient.name.toLowerCase().includes(name.toLowerCase()))[0];
      //       if (byDietaryPreference === "vegan") {
      //         if (!details.groups.includes("vegan")) return false;
      //       } else {
      //         if (!(details.groups.includes("vegetarian") || details.groups.includes("vegan"))) return false;
      //       }
      //     }
      //     // uptil here the meal satisfies the dietary filter preference
      //     return meal.name.toLowerCase().includes(byName.toLowerCase());
      //   })
      //   filtered = filtered.sort(compareMealsByName);
      //   return filtered;
      // })
    },
    []
  );

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

  const cxt = {
    mealsToDisplay: mealsToDisplay,
    filterMealsToDisplay: filterMealsToDisplay,
    getMealById: getMealById,
    getQualityPrices: getQualityPrices,
  };

  return <MealsContext.Provider value={cxt}>{children}</MealsContext.Provider>;
}

function compareMealsByName(first, second) {
  let firstName = first.name.toLowerCase();
  let secondName = second.name.toLowerCase();
  if (firstName < secondName) {
    return -1;
  }
  if (firstName > secondName) {
    return 1;
  }
  return 0;
}

export default MealsContextProvider;
