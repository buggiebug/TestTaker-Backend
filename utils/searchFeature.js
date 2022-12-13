class SearchFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filterByQuestionType(){
        const queryStrCopy = {...this.queryStr};
        this.query = this.query.find(queryStrCopy);
        return this;
    }

};

module.exports = SearchFeature;


