const circuitBreaker = (fn, threshold, failureCnt) => {
     let timeSinceLastFailure = 0;
     let failures = 0;

     return function(...args){
          try{
               let res = fn(args);
               console.log(res);
          }catch(err){
               failures++;
               timeSinceLastFailure = new Date().now();
               console.log("Error");
          }
     }
}

console.log(circuitBreaker(fun, ))
