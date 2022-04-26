const dfd = require("danfojs-node");

async function loadCSV(category){
    return await dfd.readCSV(`./csv/${category}.csv`);
}

function calorieStartingIndex(calories, userCalories){
    let start = 0;
    while(start < calories.length && calories[start] < userCalories){
        start++;
    }
    start = start % calories.length;
    return start;
}

exports.dietDataframe = async function dietDataframe(userCalories, category){
    console.log("Loading data...");

    data = await loadCSV(category);

    console.log("Data loaded.");

    if (data){
        // Sort by calories.
        data.sortValues('Calories', {inplace: true});
        data.resetIndex({inplace: true});

        // Get calorieStartingIndex data.
        calories = (data['Calories'].values);
        start = calorieStartingIndex(calories, userCalories);

        data = data.iloc({rows: [`${start}:`]});
        data.resetIndex({inplace: true});
        

        return data;
    }
}
