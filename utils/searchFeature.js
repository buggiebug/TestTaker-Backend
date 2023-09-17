class SearchFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filterByQuestionType() {
    const queryStrCopy = { ...this.queryStr };
    const keyword = queryStrCopy.questionCategory
      ? {
          $or: [
            {
              questionName: {
                $regex: String(queryStrCopy.questionCategory),
                $options: "i",
              },
            },
            {
              questionCategory: {
                $regex: String(queryStrCopy.questionCategory),
                $options: "i",
              },
            },
            {
              questionType: {
                $regex: String(queryStrCopy.questionCategory),
                $options: "i",
              },
            },
          ],
        }
      : {};
    this.query = this.query.find(keyword);
    return this;
  }
}

module.exports = SearchFeature;
