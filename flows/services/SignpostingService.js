const { getNumberFromText } = require("../helpers/format.helpers");
class SignpostingService {
  constructor(db) {
    this.db = db;
    this.collection = this.db.collection("signposting_data");

    this.signpostingMap = [
      {
        category_1: "budget_debt_and_benefits",
        tags: {
          1: "benefits-advice",
          2: "debt-advice",
          3: "budget-advice",
        },
      },
      {
        category_1: "housing_and_bills",
        tags: {
          1: "homelessness",
          2: "housing-rights",
          3: "council-tax",
          4: "credit-union",
          5: "homeswap",
          6: "energy-bills",
        },
      },
      {
        category_1: "food_clothes_and_home",
        tags: {
          1: "foodbank",
          2: "food-projects",
          3: "household-goods",
          4: "clothing-bank",
          5: "community-larder",
        },
      },
      {
        category_1: "families_youth_and_elders",
        tags: {
          1: "families",
          2: "elder",
          3: "single-parents",
          4: "young-parents",
          5: "children",
          6: "young-adult",
          7: "pregnancy",
          8: "adult-social-care",
        },
      },
      {
        category_1: "employment",
        tags: {
          1: "employability",
          2: "small-businesses",
        },
      },
      {
        category_1: "health",
        tags: {
          1: "mental-health",
          2: "long-term-health-condition",
          3: "disability",
          4: "cancer",
          5: "neurodiversity",
          6: "bereavement",
        },
      },
      {
        category_1: "local_community_hubs",
        tags: {
          1: "community-hub",
        },
      },
      {
        category_1: "vulnerable_situations",
        tags: {
          1: "drugs&alcohol",
          2: "criminal-justice",
          3: "domestic-abuse",
          4: "gambling",
          5: "fire&flood",
          6: "victim-support",
          7: "suicide",
        },
      },
      {
        category_1: "specific_groups",
        tags: {
          1: "refugees",
          2: "ex-army",
          3: "mens-support",
          4: "lgbtq+",
          5: "carers",
          6: "womens-support",
        },
      },
      {
        category_1: "other",
        tags: {
          1: "drinks",
          2: "fishermen",
          3: "hospitality",
          4: "racial-justice",
        },
      },
    ];
  }
  getTag(category1Value, category2Value) {
    const category2Number = getNumberFromText(category2Value);
    if (category2Number) {
      const optionTags = this.signpostingMap.find(
        (optionConfig) => optionConfig.category_1 === category1Value
      );
      const selectedTag = optionTags?.tags?.[category2Number];
      if (!selectedTag) {
        return null;
      }
      return selectedTag;
    }
    return null;
  }
  async selectOptions({ category1Value, category2Value, location, page }) {
    const selectedTag = this.getTag(category1Value, category2Value);
    if (selectedTag) {
      const cursor = await this.collection.find({
        "category_tags": selectedTag,
      });
      const options = await cursor.toArray();
      console.log("DB found some options", options);
    }
  }
}

module.exports = {
  SignpostingService,
};
