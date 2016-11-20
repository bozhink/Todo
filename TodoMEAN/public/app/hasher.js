/* globals CryptoJS */
function Hasher() {
    return {
        hash: function (param) {
            return CryptoJS.SHA1(param).toString();
        }
    }
}