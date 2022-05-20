// jshint esversion:6
// console.log(module);
// module.exports.getDate=getDate;
// function getDate()
// var getDate=function()
// module.exports.getDate=function()

exports.getDate=function()
{
    let today=new Date();
    let options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    // let day=today.toLocaleDateString("en-US",options);
    // return day;
    return today.toLocaleDateString("en-US",options);
};

// module.exports.getDay=getDay;
// function getDay()
// module.exports.getDay=function()
exports.getDay=function()
{
    let today=new Date();
    let options={
        weekday:"long"
    };
    let day=today.toLocaleDateString("en-US",options);
    return day;
}
// console.log(module.exports);