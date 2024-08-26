interface String {
    format(...replacements: any[]): string;
}
String.prototype.format = format;
function format() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};