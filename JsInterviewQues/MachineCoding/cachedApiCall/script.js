const cachedApiCall = (time) => {
     const cacheMemory = {};
     return async (url, config = {}) => {
          let key = `${url}${JSON.stringify(config)}`;
          const entry = cacheMemory[key];

          if(!entry || Date.now() > config.expiry){
               console.log("Making fresh API Call");

               try{
                    let res = await fetch(url, config);
                    let result = await res.json();
                    cacheMemory[key] = { value: result, expirty: Date.now() + time };
               }catch(err){
                    console.log("Failed to make API Call ", err);
               }
          }
          return cacheMemory[key];
     }
}

const call = cachedApiCall(1200);
call('https://jsonplaceholder.typicode.com/todos/1', {}).then((result) => console.log(result));
setTimeout(() =>{
     call('https://jsonplaceholder.typicode.com/todos/1', {}).then((result) => console.log(result));
}, 6400);
