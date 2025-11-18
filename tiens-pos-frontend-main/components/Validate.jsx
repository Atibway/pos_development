const validate = (e,callback)  => {
    if (e.target.value === "") {
        callback()
    }
};
export default validate
