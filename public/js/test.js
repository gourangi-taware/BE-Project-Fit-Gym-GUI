function find_angle(L,M,R) {
    var AB = Math.sqrt(Math.pow(M.x-L.x,2)+ Math.pow(M.y-L.y,2));    
    var BC = Math.sqrt(Math.pow(M.x-R.x,2)+ Math.pow(M.y-R.y,2)); 
    var AC = Math.sqrt(Math.pow(R.x-L.x,2)+ Math.pow(R.y-L.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}
function rad_to_deg(A)
{
    let X = A * 180/Math.PI;
    return X;
}
let count=0;
if((rad_to_deg(find_angle({x:1,y:1},{x:3,y:3},{x:5,y:1})))>120)
{
    count++;
}
//console.log(count);

