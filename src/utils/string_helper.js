function formatted_string(left, right, b) {
	return b ? left.substr(0, b.length) + right : right + left.substr(0, left.length - ("" + right).length);
}
function zeroPadding(number, length) {
	return (Array(length).join("0") + number).slice(-length);
}

function stringConcat(array) {
	var output = "";
	for (var i = 0, len = array.length; i < len; i++) {
		output += array[i];
	}
	return output;
}
module.exports = {
	formatted_string,
	zeroPadding,
	stringConcat
};
