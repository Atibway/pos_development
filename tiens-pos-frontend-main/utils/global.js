export const extraLatestArrayIndex = (array) => {
    let lastIndexItem = null;
    for (let i = 0; i < array.length; i++) {
        if (array.length - 1 === i) {
            lastIndexItem = array[i];
        }
    }
    return lastIndexItem
}
