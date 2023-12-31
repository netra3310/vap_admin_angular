export const customSearchFn = (term: string, item: any) => {
    // 
    term = term.toLowerCase();

    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);

    let isWordThere : any = [];

    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
        let search = item['label'].toLowerCase();
        isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word : any) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
}
