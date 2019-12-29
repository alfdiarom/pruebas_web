//window.onload = updateClock;
var totalTime = 60;
function updateClock() {
document.getElementById('tiempo_restante').innerHTML = `
<p>-- ${totalTime} --</p>
`
if(totalTime==0){
//alert('Final');
totalTime = 60;
}else{
totalTime-=1;
setTimeout("updateClock()",1000);
}
}
