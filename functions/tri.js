triAlpha = function (a, b) {

    if (a.roleName < b.roleName) {
        return -1;
    } else {
        return 1;
    };

}

module.exports = {triAlpha}