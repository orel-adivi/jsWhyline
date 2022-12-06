var a = 5;
function not_called(param) {
    console.log('Entered function \'not_called\'.');
    const b = 6;
    var c = 7;
    console.log('Exited function \'not_called\' without an explicit return.');
}
function called(param) {
    console.log('Entered function \'called\'.');
    const d = 8;
    console.log('Exited function \'called\' with an explicit return of value 9.');
    return 9;
    console.log('Exited function \'called\' with an explicit return of value \'a\'.');
    return 'a';
    var e = 10;
    console.log('Exited function \'called\' without an explicit return.');
}
var f = 11;
called(12);